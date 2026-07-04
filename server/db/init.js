/**
 * 数据库初始化脚本 — 自动读取 init.sql 并执行
 * 用法: node server/db/init.js
 * 优点: 不需要安装 MySQL CLI，直接通过 mysql2 npm 包连接数据库
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PASSWORD = '112233';

async function main() {
  // 1. 连接 MySQL（先不指定数据库，因为数据库可能还不存在）
  console.log('🔧 正在连接 MySQL...');
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: PASSWORD,
      multipleStatements: false
    });
    console.log('✅ MySQL 连接成功\n');
  } catch (err) {
    console.error(`❌ MySQL 连接失败: ${err.message}`);
    console.error('   请确认:');
    console.error('   1. MySQL 8.0 服务已启动（任务管理器 → 服务 → MySQL80）');
    console.error('   2. root 用户密码是 112233');
    console.error('   3. 如果密码不对，请修改 connection.js 里的 password\n');
    process.exit(1);
  }

  // 2. 读取 SQL 文件
  const sqlPath = path.join(__dirname, 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // 3. 按分号拆分语句，过滤空行和纯注释行
  //    先移除单行注释，避免多行注释与 SQL 混在同一个段里被整体过滤
  const statements = sql
    .split('\n')
    .map(line => {
      const idx = line.indexOf('--');
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`📄 共 ${statements.length} 条 SQL 语句\n`);

  // 4. 逐条执行
  let ok = 0;
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    // 取前 60 个字符显示在控制台
    const preview = stmt.replace(/\s+/g, ' ').trim().substring(0, 60);
    try {
      await conn.query(stmt);
      console.log(`  ✅ [${i + 1}/${statements.length}] ${preview}...`);
      ok++;
    } catch (err) {
      // 已经存在的表、重复数据 → 不算失败
      if (err.code === 'ER_DUP_ENTRY' || err.code === 'ER_TABLE_EXISTS_ERROR' || err.errno === 1062) {
        console.log(`  ⚠️  [${i + 1}/${statements.length}] 已存在，跳过`);
        ok++;
      } else {
        console.log(`  ❌ [${i + 1}/${statements.length}] ${err.message}`);
      }
    }
  }

  await conn.end();
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ 完成! ${ok}/${statements.length} 条执行成功`);
  console.log(`   数据库: music_app`);
  console.log(`   后台登录: admin / ${PASSWORD}`);
  console.log(`   歌曲: 40 首（元数据已录入，还需导入 MP3）`);
  console.log(`${'='.repeat(50)}\n`);
}

main();
