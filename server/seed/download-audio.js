/**
 * =============================================================
 *  音频种子下载脚本 — 从 GitHub Release 下载 MP3 并入库
 *  使用方法: node server/seed/download-audio.js
 * =============================================================
 *
 * 流程:
 *   1. 从 GitHub Release 下载 audio-seed.zip
 *   2. 解压 MP3 文件到 server/seed/mp3/
 *   3. 自动运行 import-mp3 逻辑，将音频写入 songs.audio_data
 *
 * 前置条件:
 *   - 项目维护者需先把 MP3 打包为 audio-seed.zip，上传到 GitHub Release
 *   - 普通用户克隆项目后只需运行: npm run setup:audio
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import pool from '../db/connection.js';

// --------------- 配置 ---------------
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MP3_DIR = path.join(__dirname, 'mp3');

// GitHub Release 下载地址（首次发布后用真实地址替换）
const GITHUB_REPO = 'Seredipited/Music-app';
const RELEASE_TAG = 'v1.0.0';
const ASSET_NAME = 'audio-seed.zip';
const DOWNLOAD_URL = `https://github.com/${GITHUB_REPO}/releases/download/${RELEASE_TAG}/${ASSET_NAME}`;

// zip 文件保存路径
const ZIP_PATH = path.join(__dirname, 'audio-seed.zip');

// --------------- 工具函数 ---------------

/**
 * HTTPS 下载文件（自动跟随重定向）
 * @param {string} url        - 下载地址
 * @param {string} destPath   - 保存到本地的路径
 * @param {number} maxRedirects - 最大重定向次数
 */
function downloadFile(url, destPath, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    let totalBytes = 0;

    function attempt(currentUrl, redirectsLeft) {
      const lib = currentUrl.startsWith('https') ? https : http;

      lib.get(currentUrl, { headers: { 'User-Agent': 'MusicApp/1.0' } }, (response) => {
        // 处理 3xx 重定向
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          if (redirectsLeft <= 0) {
            file.close();
            fs.unlinkSync(destPath);
            return reject(new Error('重定向次数过多，下载失败'));
          }
          const redirectUrl = new URL(response.headers.location, currentUrl).href;
          console.log(`  ↪ 重定向至: ${redirectUrl}`);
          return attempt(redirectUrl, redirectsLeft - 1);
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          return reject(new Error(`下载失败: HTTP ${response.statusCode}`));
        }

        const total = parseInt(response.headers['content-length'], 10) || 0;
        console.log(`  文件大小: ${(total / (1024 * 1024)).toFixed(2)} MB`);

        response.on('data', (chunk) => {
          totalBytes += chunk.length;
          // 每 5MB 打印一次进度
          if (totalBytes % (5 * 1024 * 1024) < chunk.length) {
            const pct = total ? ((totalBytes / total) * 100).toFixed(1) : '?';
            console.log(`  下载进度: ${pct}% (${(totalBytes / (1024 * 1024)).toFixed(1)} MB)`);
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`  ✅ 下载完成: ${(totalBytes / (1024 * 1024)).toFixed(1)} MB`);
          resolve();
        });

        file.on('error', (err) => {
          file.close();
          if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
          reject(err);
        });
      }).on('error', reject);
    }

    attempt(url, maxRedirects);
  });
}

/**
 * 解压 zip 文件（纯 JavaScript 实现，无需外部依赖）
 * 仅提取 .mp3 文件到目标目录
 */
async function extractZip(zipPath, destDir) {
  // 使用动态 import 加载 adm-zip
  // 如果未安装则自动提示
  let AdmZip;
  try {
    const mod = await import('adm-zip');
    AdmZip = mod.default;
  } catch {
    console.log('\n📦 adm-zip 未安装，正在为你自动安装...');
    const { execSync } = await import('node:child_process');
    execSync('npm install adm-zip --no-save', {
      cwd: path.join(__dirname, '..', '..'),
      stdio: 'inherit'
    });
    const mod = await import('adm-zip');
    AdmZip = mod.default;
  }

  console.log(`\n📂 正在解压到: ${destDir}`);

  // 确保目标目录存在
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const zip = new AdmZip(zipPath);
  const entries = zip.getEntries();

  let extractedCount = 0;
  entries.forEach((entry) => {
    // 只提取 .mp3 文件，跳过目录
    if (entry.isDirectory) return;
    const entryName = path.basename(entry.entryName);
    if (!entryName.toLowerCase().endsWith('.mp3')) return;

    const targetPath = path.join(destDir, entryName);
    zip.extractEntryTo(entry, destDir, false, true);

    // 如果 extractEntryTo 行为不符合预期，直接写文件
    if (!fs.existsSync(targetPath)) {
      fs.writeFileSync(targetPath, entry.getData());
    }

    const sizeMB = (entry.getData().length / (1024 * 1024)).toFixed(2);
    console.log(`  📄 ${entryName} (${sizeMB} MB)`);
    extractedCount++;
  });

  console.log(`  ✅ 共解压 ${extractedCount} 首 MP3`);
  return extractedCount;
}

/**
 * 将 mp3 目录下的文件批量导入数据库（复用 import-mp3.js 的核心逻辑）
 */
async function importMp3ToDatabase() {
  // 检查 mp3 目录
  if (!fs.existsSync(MP3_DIR)) {
    console.log('\n⚠️  mp3/ 文件夹不存在，无需导入');
    return 0;
  }

  const files = fs.readdirSync(MP3_DIR).filter(f => f.toLowerCase().endsWith('.mp3'));

  if (files.length === 0) {
    console.log('\n⚠️  mp3/ 文件夹为空');
    return 0;
  }

  console.log(`\n🎵 开始导入 ${files.length} 首歌曲到数据库...\n`);

  let successCount = 0;
  let failCount = 0;

  for (const filename of files) {
    const songName = filename.replace(/\.mp3$/i, '');
    const filePath = path.join(MP3_DIR, filename);
    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`  📄 ${filename} (${fileSizeMB} MB)`);

    let buffer;
    try {
      buffer = fs.readFileSync(filePath);
    } catch (err) {
      console.log(`     ❌ 读取文件失败: ${err.message}`);
      failCount++;
      continue;
    }

    // 估算时长（128kbps MP3）
    const approxDuration = Math.round(buffer.length / (128 * 1024 / 8));

    try {
      const [result] = await pool.query(
        `UPDATE songs
           SET audio_data = ?,
               audio_mime = 'audio/mpeg',
               duration   = ?
         WHERE name = ?`,
        [buffer, approxDuration, songName]
      );

      if (result.affectedRows > 0) {
        console.log(`     ✅ 成功! 已更新 ${songName}`);
        successCount++;
      } else {
        console.log(`     ⚠️  数据库中没找到 name='${songName}' 的歌曲（跳过）`);
        failCount++;
      }
    } catch (err) {
      console.log(`     ❌ 数据库写入失败: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ 导入完成: 成功 ${successCount} 首 | 跳过/失败 ${failCount} 首`);
  console.log(`${'='.repeat(50)}`);

  return successCount;
}

// --------------- 主流程 ---------------

async function main() {
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│   🎵 从 GitHub Release 下载音频种子并入库    │');
  console.log('└─────────────────────────────────────────────┘');
  console.log(`\n📥 下载地址: ${DOWNLOAD_URL}\n`);

  // 步骤 1: 下载 zip
  console.log('┌─ 步骤 1/3: 下载音频压缩包 ──────────────┐');
  try {
    await downloadFile(DOWNLOAD_URL, ZIP_PATH);
  } catch (err) {
    console.error(`\n❌ 下载失败: ${err.message}`);
    console.error('\n请确认:');
    console.error('  1. GitHub Release 已创建且包含 audio-seed.zip');
    console.error(`  2. 地址正确: ${DOWNLOAD_URL}`);
    console.error('  3. 网络可以访问 GitHub\n');

    // 如果 Release 还没创建，给出备用方案
    console.error('💡 备用方案 (手动导入):');
    console.error('  1. 把你的 MP3 文件放到: server/seed/mp3/');
    console.error('  2. 运行: npm run db:import\n');

    process.exit(1);
  }

  // 步骤 2: 解压
  console.log('\n┌─ 步骤 2/3: 解压音频文件 ──────────────────┐');
  let extractedCount = 0;
  try {
    extractedCount = await extractZip(ZIP_PATH, MP3_DIR);
  } catch (err) {
    console.error(`\n❌ 解压失败: ${err.message}`);
    process.exit(1);
  }

  // 步骤 3: 导入数据库
  console.log('\n┌─ 步骤 3/3: 导入音频到数据库 ─────────────┐');
  try {
    await importMp3ToDatabase();
  } catch (err) {
    console.error(`\n❌ 数据库导入失败: ${err.message}`);
    process.exit(1);
  }

  // 清理 zip 文件
  if (fs.existsSync(ZIP_PATH)) {
    fs.unlinkSync(ZIP_PATH);
    console.log('\n🧹 已清理临时 zip 文件');
  }

  console.log('\n🎉 全部完成! 现在可以启动项目听歌了: npm run dev');
  console.log(`   (共 ${extractedCount} 首歌曲已就绪)\n`);

  await pool.end();
}

main();
