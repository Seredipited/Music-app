import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/connection.js';
import { signToken, verifyToken, requireAuth } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const token = signToken({ id: user.id, username: user.username, role: user.role }, '7d');
    const refreshToken = signToken({ id: user.id, type: 'refresh' }, '30d');

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
      refreshToken
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ error: '登录失败' });
  }
});

// POST /api/auth/refresh — Token 刷新
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: '缺少 refreshToken' });
    }

    const payload = verifyToken(refreshToken);
    if (!payload || payload.type !== 'refresh') {
      return res.status(401).json({ error: 'refreshToken 无效或已过期' });
    }

    const [rows] = await pool.query('SELECT id, username, role FROM users WHERE id = ?', [payload.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '用户不存在' });
    }

    const user = rows[0];
    const token = signToken({ id: user.id, username: user.username, role: user.role }, '7d');

    res.json({ token });
  } catch (err) {
    console.error('Token 刷新失败:', err);
    res.status(500).json({ error: 'Token 刷新失败' });
  }
});

// GET /api/auth/check — 校验登录状态
router.get('/check', requireAuth, async (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default router;
