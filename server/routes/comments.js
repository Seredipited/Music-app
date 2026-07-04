import { Router } from 'express';
import pool from '../db/connection.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/comments?songId=1&page=1&type=hot
router.get('/', async (req, res) => {
  try {
    const songId = parseInt(req.query.songId) || 1;
    const page = parseInt(req.query.page) || 1;
    const type = req.query.type || 'hot';
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const [countRows] = await pool.query(
      'SELECT COUNT(*) AS total FROM comments WHERE song_id = ? AND type = ?',
      [songId, type]
    );
    const total = countRows[0].total;

    const [rows] = await pool.query(
      'SELECT id, song_id AS songId, user_name AS userName, user_avatar AS userAvatar, content, liked, type, created_at AS createdAt FROM comments WHERE song_id = ? AND type = ? ORDER BY liked DESC, created_at DESC LIMIT ? OFFSET ?',
      [songId, type, pageSize, offset]
    );

    res.json({
      comments: rows.map(r => ({ ...r, isLiked: false, time: formatRelativeTime(r.createdAt) })),
      total
    });
  } catch (err) {
    console.error('获取评论失败:', err);
    res.status(500).json({ error: '获取评论失败' });
  }
});

// POST /api/comments [需要登录]
router.post('/', requireAuth, async (req, res) => {
  try {
    const { songId, content } = req.body;
    if (!songId || !content) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (song_id, user_name, user_avatar, content, liked, type) VALUES (?, ?, ?, ?, ?, ?)',
      [songId, '当前用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=User', content, 0, 'new']
    );

    res.status(201).json({
      id: result.insertId,
      songId,
      userName: '当前用户',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      content,
      liked: 0,
      isLiked: false,
      type: 'new',
      time: '刚刚'
    });
  } catch (err) {
    console.error('提交评论失败:', err);
    res.status(500).json({ error: '提交评论失败' });
  }
});

function formatRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  return `${diffDay}天前`;
}

export default router;
