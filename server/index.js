import express from 'express';
import cors from 'cors';
import songsRouter from './routes/songs.js';
import audioRouter from './routes/audio.js';
import authRouter from './routes/auth.js';
import commentsRouter from './routes/comments.js';
import pool from './db/connection.js';

const app = express();
const PORT = process.env.PORT || 8080;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== 根路由 ==========
app.get('/', (_req, res) => {
  res.json({
    name: 'Music App API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      songs: '/api/songs',
      audio: '/api/audio/:id',
      health: '/api/health',
      auth: '/api/auth',
      comments: '/api/comments'
    }
  });
});

// ========== API 路由 ==========
app.use('/api/songs', songsRouter);
app.use('/api/audio', audioRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentsRouter);

// 健康检查
app.get('/api/health', async (_req, res) => {
  let dbOk = false;
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    dbOk = rows.length > 0;
  } catch (_) {
    // db not ready
  }
  res.json({
    status: 'ok',
    db: dbOk ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 启动前先测一下数据库能不能连上
async function start() {
  // 尝试连接数据库
  try {
    await pool.query('SELECT 1');
    console.log('✅ 数据库连接成功 (music_app)');
  } catch (err) {
    console.warn('⚠️  数据库连接失败:', err.message);
    console.warn('   请先运行 npm run db:init 初始化数据库\n');
  }

  app.listen(PORT, () => {
    console.log(`\n🎵 Music Server running at http://localhost:${PORT}`);
    console.log(`   根路由:   http://localhost:${PORT}/`);
    console.log(`   音频:     http://localhost:${PORT}/api/audio/:id`);
    console.log(`   歌曲列表: http://localhost:${PORT}/api/songs\n`);
  });
}

start();
