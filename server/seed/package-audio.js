/**
 * =============================================================
 *  GitHub Release 上传脚本 — 创建 Release 并上传 audio-seed.zip
 *  使用方法:
 *    set GITHUB_TOKEN=ghp_xxxxxxxxxxxx
 *    node server/seed/package-audio.js <zip文件路径>
 *
 *  或者:
 *    $env:GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
 *    node server/seed/package-audio.js <zip文件路径>
 * =============================================================
 *
 * 流程:
 *   1. 读取本地的 audio-seed.zip
 *   2. 调用 GitHub API 创建 Release (tag: v1.0.0)
 *   3. 上传 zip 作为 Release 附件
 *
 * 前置条件:
 *   - 需要在 GitHub 生成 Personal Access Token (classic)
 *     权限勾选: repo (全部)
 *   - Token 通过环境变量 GITHUB_TOKEN 传入
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --------------- 配置 ---------------
const REPO_OWNER = 'Seredipited';
const REPO_NAME = 'Music-app';
const TAG_NAME = 'v1.0.0';
const ASSET_NAME = 'audio-seed.zip';
const DEFAULT_ZIP = path.join(__dirname, 'audio-seed.zip');

// --------------- 工具函数 ---------------

function makeRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf-8');
        let data;
        try {
          data = JSON.parse(raw);
        } catch {
          data = raw;
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

/**
 * 步骤 1: 创建 GitHub Release
 */
async function createRelease(token) {
  console.log(`\n🚀 正在创建 Release: ${TAG_NAME}...`);

  const body = JSON.stringify({
    tag_name: TAG_NAME,
    name: TAG_NAME,
    body: '🎵 音频种子 — 包含 MP3 文件，用于 `npm run setup:audio` 自动导入',
    draft: false,
    prerelease: false
  });

  const options = {
    hostname: 'api.github.com',
    path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases`,
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'MusicApp/1.0',
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json'
    }
  };

  const release = await makeRequest(options, body);
  console.log(`  ✅ Release 创建成功: id=${release.id}, tag=${release.tag_name}`);
  console.log(`  📎 上传地址: ${release.upload_url}`);
  return release;
}

/**
 * 步骤 2: 上传 zip 文件到 Release
 */
async function uploadAsset(token, uploadUrl, zipPath) {
  const zipSize = fs.statSync(zipPath).size;
  const zipBuffer = fs.readFileSync(zipPath);
  const sizeMB = (zipSize / (1024 * 1024)).toFixed(2);

  console.log(`\n📤 正在上传 ${ASSET_NAME} (${sizeMB} MB)...`);

  // 解析 upload_url: {?name,label} 替换为 ?name=xxx
  const urlObj = new URL(uploadUrl.replace('{?name,label}', ''));
  urlObj.searchParams.set('name', ASSET_NAME);

  const options = {
    hostname: urlObj.hostname,
    path: urlObj.pathname + urlObj.search,
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'MusicApp/1.0',
      'Content-Type': 'application/zip',
      'Content-Length': zipSize,
      'Accept': 'application/vnd.github+json'
    }
  };

  // 大文件上传 — 用流方式支持进度显示
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf-8');
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`  ✅ 上传成功`);
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`上传失败: HTTP ${res.statusCode}\n${body}`));
        }
      });
    });
    req.on('error', reject);

    // 分块写入，每 5MB 打印进度
    let uploaded = 0;
    const chunkSize = 5 * 1024 * 1024;
    function writeChunk() {
      let canContinue = true;
      while (canContinue && uploaded < zipSize) {
        const end = Math.min(uploaded + chunkSize, zipSize);
        const chunk = zipBuffer.subarray(uploaded, end);
        canContinue = req.write(chunk);
        uploaded = end;
        const pct = ((uploaded / zipSize) * 100).toFixed(1);
        console.log(`  上传进度: ${pct}% (${(uploaded / (1024 * 1024)).toFixed(1)}/${sizeMB} MB)`);
      }
      if (uploaded >= zipSize) {
        req.end();
      } else {
        req.once('drain', writeChunk);
      }
    }
    writeChunk();
  });
}

// --------------- 主流程 ---------------

async function main() {
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│   🚀 上传 audio-seed.zip 到 GitHub Release   │');
  console.log('└─────────────────────────────────────────────┘');

  // 获取 Token
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('\n❌ 缺少 GitHub Token!');
    console.error('\n请先设置环境变量 GITHUB_TOKEN:');
    console.error('  PowerShell: $env:GITHUB_TOKEN="ghp_xxxxxxxxxxxx"');
    console.error('  CMD:        set GITHUB_TOKEN=ghp_xxxxxxxxxxxx');
    console.error('\n获取 Token: https://github.com/settings/tokens');
    console.error('  勾选权限: repo (全部)\n');
    process.exit(1);
  }

  // 获取 zip 文件路径（命令行参数或默认路径）
  const zipPath = process.argv[2] || DEFAULT_ZIP;

  console.log(`\n📂 Zip 文件: ${zipPath}`);
  console.log(`📦 目标仓库: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`🏷️  标签:     ${TAG_NAME}`);

  if (!fs.existsSync(zipPath)) {
    console.error(`\n❌ 找不到文件: ${zipPath}`);
    console.error('\n用法: node server/seed/package-audio.js <audio-seed.zip路径>');
    console.error(`示例: node server/seed/package-audio.js ${DEFAULT_ZIP}`);
    process.exit(1);
  }

  // ---- 第 1 步：创建 Release ----
  try {
    var release = await createRelease(token);
  } catch (err) {
    const msg = err.message || String(err);
    if (msg.includes('already_exists')) {
      console.log('\n⚠️  Release v1.0.0 已存在，尝试复用...');
      // 获取已有 release
      console.log('  正在查找已有 Release...');
      const listOpts = {
        hostname: 'api.github.com',
        path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/tags/${TAG_NAME}`,
        method: 'GET',
        headers: {
          'Authorization': `token ${token}`,
          'User-Agent': 'MusicApp/1.0',
          'Accept': 'application/vnd.github+json'
        }
      };
      release = await makeRequest(listOpts);
      console.log(`  ✅ 找到已有 Release: id=${release.id}`);
    } else if (msg.includes('Not Found')) {
      console.error(`\n❌ 仓库不存在或 Token 无权限访问: ${REPO_OWNER}/${REPO_NAME}`);
      console.error('   请确认 Token 勾选了 repo 权限，且仓库名正确\n');
      process.exit(1);
    } else if (msg.includes('Bad credentials')) {
      console.error('\n❌ Token 无效或已过期');
      console.error('   请重新生成: https://github.com/settings/tokens\n');
      process.exit(1);
    } else {
      console.error(`\n❌ 创建 Release 失败: ${msg}`);
      process.exit(1);
    }
  }

  // ---- 第 2 步：上传 zip ----
  try {
    await uploadAsset(token, release.upload_url, zipPath);
  } catch (err) {
    const msg = err.message || String(err);
    // 如果 asset 已存在，尝试删除后重新上传
    if (msg.includes('already_exists')) {
      console.log('\n⚠️  asset 已存在，删除旧版本后重新上传...');
      // 找到并删除旧 asset
      const asset = release.assets?.find(a => a.name === ASSET_NAME);
      if (asset) {
        console.log(`  正在删除旧 asset: id=${asset.id}`);
        const delOpts = {
          hostname: 'api.github.com',
          path: `/repos/${REPO_OWNER}/${REPO_NAME}/releases/assets/${asset.id}`,
          method: 'DELETE',
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'MusicApp/1.0',
            'Accept': 'application/vnd.github+json'
          }
        };
        await makeRequest(delOpts);
        console.log('  ✅ 旧 asset 已删除');
        await uploadAsset(token, release.upload_url, zipPath);
      } else {
        console.error('  ❌ 无法找到旧 asset');
        process.exit(1);
      }
    } else {
      console.error(`\n❌ 上传失败: ${msg}`);
      process.exit(1);
    }
  }

  console.log('\n─────────────────────────────────────────────');
  console.log('🎉 完成! Release 已就绪');
  console.log(`   🔗 ${release.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/tag/${TAG_NAME}`}`);
  console.log('─────────────────────────────────────────────');
  console.log('\n现在其他人克隆项目后运行 npm run setup:audio 即可自动下载!\n');
}

main();
