import { Router } from 'express';
import multer from 'multer';
import pool from '../db/connection.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const API_BASE = process.env.API_BASE || '';

// 将数据库行转为 Song 对象
function toSong(row) {
  return {
    id: row.id,
    name: row.name,
    artist: row.artist,
    album: row.album,
    cover: row.cover,
    audio: row.has_audio ? `${API_BASE}/api/audio/${row.id}` : '',
    duration: row.duration,
    genre: row.genre || '流行',
    createdAt: row.created_at
  };
}

// GET /api/songs — 获取所有歌曲
router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, artist, album, cover, duration, genre, created_at, audio_data IS NOT NULL AND LENGTH(audio_data) > 0 AS has_audio FROM songs ORDER BY id ASC'
    );
    const songs = rows.map(toSong);
    res.json(songs);
  } catch (err) {
    console.error('获取歌曲列表失败:', err);
    res.status(500).json({ error: '获取歌曲列表失败' });
  }
});

// GET /api/songs/search?q=keyword — 搜索歌曲
router.get('/search', async (req, res) => {
  try {
    const q = `%${req.query.q || ''}%`;
    const [rows] = await pool.query(
      `SELECT id, name, artist, album, cover, duration, genre, created_at, audio_data IS NOT NULL AND LENGTH(audio_data) > 0 AS has_audio
       FROM songs
       WHERE name LIKE ? OR artist LIKE ? OR album LIKE ?
       ORDER BY id ASC`,
      [q, q, q]
    );
    const songs = rows.map(toSong);
    res.json({ songs, albums: [], artists: [] });
  } catch (err) {
    console.error('搜索歌曲失败:', err);
    res.status(500).json({ error: '搜索失败' });
  }
});

// GET /api/songs/:id — 获取单首歌曲
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, artist, album, cover, duration, genre, created_at, audio_data IS NOT NULL AND LENGTH(audio_data) > 0 AS has_audio FROM songs WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: '歌曲不存在' });
    res.json(toSong(rows[0]));
  } catch (err) {
    console.error('获取歌曲失败:', err);
    res.status(500).json({ error: '获取歌曲失败' });
  }
});

// POST /api/songs — 添加歌曲 (multipart/form-data) [需要管理员权限]
router.post('/', requireAuth, requireAdmin, upload.single('audio'), async (req, res) => {
  try {
    const { name, artist, album, duration, genre, cover } = req.body;
    if (!name || !artist) {
      return res.status(400).json({ error: '歌曲名称和歌手不能为空' });
    }

    const audioBuffer = req.file ? req.file.buffer : null;
    const audioMime = req.file ? req.file.mimetype : null;

    const [result] = await pool.query(
      'INSERT INTO songs (name, artist, album, cover, audio_data, audio_mime, duration, genre) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, artist, album || '', cover || '', audioBuffer, audioMime, parseInt(duration) || 240, genre || '流行']
    );

    const newSong = {
      id: result.insertId,
      name,
      artist,
      album: album || '',
      cover: cover || '',
      audio: audioBuffer ? `${API_BASE}/api/audio/${result.insertId}` : '',
      duration: parseInt(duration) || 240,
      genre: genre || '流行'
    };
    res.status(201).json(newSong);
  } catch (err) {
    console.error('添加歌曲失败:', err);
    res.status(500).json({ error: '添加歌曲失败' });
  }
});

// PUT /api/songs/:id — 更新歌曲 [需要管理员权限]
router.put('/:id', requireAuth, requireAdmin, upload.single('audio'), async (req, res) => {
  try {
    const { name, artist, album, duration, genre, cover } = req.body;
    const id = req.params.id;

    const [existing] = await pool.query('SELECT * FROM songs WHERE id = ?', [id]);
    if (existing.length === 0) return res.status(404).json({ error: '歌曲不存在' });

    let audioBuffer = existing[0].audio_data;
    let audioMime = existing[0].audio_mime;
    if (req.file) {
      audioBuffer = req.file.buffer;
      audioMime = req.file.mimetype;
    }

    await pool.query(
      `UPDATE songs SET name=?, artist=?, album=?, cover=?, audio_data=?, audio_mime=?, duration=?, genre=? WHERE id=?`,
      [
        name || existing[0].name,
        artist || existing[0].artist,
        album !== undefined ? album : existing[0].album,
        cover !== undefined ? cover : existing[0].cover,
        audioBuffer,
        audioMime,
        parseInt(duration) || existing[0].duration,
        genre || existing[0].genre,
        id
      ]
    );

    res.json({
      id: parseInt(id),
      name: name || existing[0].name,
      artist: artist || existing[0].artist,
      album: album !== undefined ? album : existing[0].album,
      cover: cover !== undefined ? cover : existing[0].cover,
      audio: audioBuffer ? `${API_BASE}/api/audio/${id}` : '',
      duration: parseInt(duration) || existing[0].duration,
      genre: genre || existing[0].genre
    });
  } catch (err) {
    console.error('更新歌曲失败:', err);
    res.status(500).json({ error: '更新歌曲失败' });
  }
});

// DELETE /api/songs/:id — 删除歌曲 [需要管理员权限]
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM songs WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: '歌曲不存在' });
    res.json({ success: true });
  } catch (err) {
    console.error('删除歌曲失败:', err);
    res.status(500).json({ error: '删除歌曲失败' });
  }
});

export default router;
