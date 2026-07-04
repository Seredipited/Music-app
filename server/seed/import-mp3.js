
/**
 * =============================================================
 *  本地 MP3 批量导入脚本 — 把 mp3 文件夹里的歌曲存到 MySQL 的 BLOB 字段
 *  使用方法: node server/seed/import-mp3.js
 * =============================================================
 *
 * 用人话讲，这个脚本做了 3 件事:
 *
 *   第 1 步 — 找到 mp3/ 文件夹下所有 .mp3 文件
 *   第 2 步 — 把每个文件读成"二进制数据"(Node.js 叫 Buffer)
 *   第 3 步 — 更新数据库，把二进制数据填到 songs.audio_data 字段里
 *
 * 匹配规则: 文件名去掉 .mp3 后缀 = songs 表里的 name
 *   比如: "起风了.mp3" → UPDATE songs SET audio_data=? WHERE name='起风了'
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from '../db/connection.js';

// --------------- 配置 ---------------
const MP3_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)), // 当前脚本所在目录 = server/seed/
  'mp3'                                         // mp3 子文件夹
);

// --------------- 用到的主要知识点 ---------------
console.log('┌─────────────────────────────────────────────┐');
console.log('│      🎵 本地 MP3 → MySQL BLOB 批量导入       │');
console.log('└─────────────────────────────────────────────┘');
console.log(`\n📂 MP3 文件目录: ${MP3_DIR}\n`);

// 第 1 步: 检查文件夹是否存在
if (!fs.existsSync(MP3_DIR)) {
  // 如果文件夹不存在，帮你自动创建并给出提示
  fs.mkdirSync(MP3_DIR, { recursive: true });
  console.log('⚠️  mp3/ 文件夹刚刚自动创建，目前是空的。');
  console.log('   请把你的 .mp3 文件复制到:');
  console.log(`   ${MP3_DIR}`);
  console.log('   然后重新运行: node server/seed/import-mp3.js\n');
  process.exit(0);
}

// 第 2 步: 读取文件夹下所有以 .mp3 结尾的文件
const files = fs.readdirSync(MP3_DIR).filter(f => f.toLowerCase().endsWith('.mp3'));

if (files.length === 0) {
  console.log('⚠️  mp3/ 文件夹是空的，没有任何 .mp3 文件。');
  console.log(`   请把 .mp3 文件放到: ${MP3_DIR}\n`);
  process.exit(0);
}

console.log(`📋 找到 ${files.length} 个 MP3 文件:\n`);

// 第 3 步: 逐个处理每个 MP3 文件
let successCount = 0;
let failCount = 0;

for (const filename of files) {
  // ----- 3a. 根据文件名，推测歌曲在数据库里对应的 name -----
  //     去掉 .mp3 后缀，就是歌手名 + 歌名
  const songName = filename.replace(/\.mp3$/i, '');
  const filePath = path.join(MP3_DIR, filename);

  // ----- 3b. 读取文件大小 -----
  const stats = fs.statSync(filePath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log(`  📄 ${filename}`);
  console.log(`     大小: ${fileSizeMB} MB`);

  // ★★★ 核心! ★★★
  // ----- 3c. 用 fs.readFileSync() 把整个 MP3 文件读成一个 Buffer -----
  //     Buffer 就是 Node.js 里的"二进制数据容器"
  //     你可以理解成: 把 MP3 文件完整地复制到内存里
  //     这个 Buffer 可以直接作为 SQL 的 ? 参数传给 MySQL 的 LONGBLOB 字段
  let buffer;
  try {
    buffer = fs.readFileSync(filePath);
    // ↑ 这一行就是"把文件读成二进制数据(BLOB)"的全部代码!
    //    buffer 是一个 Buffer 对象，里面装的就是 MP3 的所有字节
  } catch (err) {
    console.log(`     ❌ 读取文件失败: ${err.message}`);
    failCount++;
    continue;
  }

  // ----- 3d. 计算音频大概时长(秒) -----
  //     MP3 一般 128kbps = 16KB/秒
  //     这是一个近似算法，不精确但够用
  const approxDuration = Math.round(buffer.length / (128 * 1024 / 8));

  // ----- 3e. 写入 MySQL -----
  //     关键: buffer 作为 SQL 参数传给 mysql2，
  //     mysql2 会自动把它当成 BLOB 数据存入 audio_data 字段
  try {
    const [result] = await pool.query(
      `UPDATE songs
           SET audio_data = ?,
               audio_mime = 'audio/mpeg',
               duration   = ?
         WHERE name = ?`,
      [buffer, approxDuration, songName]
      //  ↑      ↑                ↑
      //  BLOB  时长(秒)         匹配歌名
    );

    if (result.affectedRows > 0) {
      console.log(`     ✅ 成功! 已更新 ${songName}`);
      successCount++;
    } else {
      // 没匹配到 — 可能 songs 表里没有这首歌的名字
      console.log(`     ⚠️  数据库中没找到 name='${songName}' 的歌曲`);
      console.log(`     (请确认 init.sql 里这首歌的 name 跟文件名一致)`);
      failCount++;
    }
  } catch (err) {
    console.log(`     ❌ 数据库写入失败: ${err.message}`);
    failCount++;
  }
}

// 第 4 步: 打印汇总结果
console.log(`\n${'='.repeat(50)}`);
console.log(`✅ 成功: ${successCount} 首  |  ❌ 失败: ${failCount} 首`);
console.log(`${'='.repeat(50)}\n`);

// 关闭数据库连接池
await pool.end();
