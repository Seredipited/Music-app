import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// GET /api/audio/:id — 流式返回 MP3 音频 (支持 Range 请求)
router.get('/:id', async (req, res) => {
  // 1. 解析并校验动态参数 :id
  const rawId = req.params.id;
  const id = parseInt(rawId, 10);

  // 如果请求的是 /api/audio/:id 字面量，或 id 不是正整数，直接拒绝
  if (Number.isNaN(id) || id <= 0 || String(id) !== rawId) {
    console.warn(`[audio] 收到非法歌曲 ID: "${rawId}"`);
    return res.status(400).json({
      error: '非法的歌曲 ID',
      received: rawId,
      expected: '正整数，例如 1, 2, 3',
      example: 'http://localhost:8080/api/audio/1'
    });
  }

  try {
    // 2. 根据有效 ID 查询数据库
    const [rows] = await pool.query(
      'SELECT id, name, artist, audio_data, audio_mime FROM songs WHERE id = ?',
      [id]
    );

    // 3. 歌曲 ID 不存在
    if (!rows.length) {
      console.warn(`[audio] 数据库中找不到歌曲 id=${id}`);
      return res.status(404).json({
        error: '歌曲不存在',
        songId: id,
        detail: `在数据库 music_app.songs 中找不到 id=${id} 的记录`
      });
    }

    const row = rows[0];

    // 4. 歌曲存在但 audio_data BLOB 为空
    if (!row.audio_data || row.audio_data.length === 0) {
      console.warn(`[audio] 歌曲 id=${id} 存在但未导入音频 BLOB`);
      return res.status(404).json({
        error: '该歌曲尚未上传 MP3 音频文件',
        song: { id: row.id, name: row.name, artist: row.artist },
        hint: '请先将 .mp3 导入到 songs.audio_data 字段后再试'
      });
    }

    const audio = row.audio_data;        // Buffer
    const mime = row.audio_mime || 'audio/mpeg';
    const totalSize = audio.length;

    console.log(`[audio] 返回歌曲 id=${id}, name="${row.name}", size=${totalSize} bytes, mime=${mime}`);

    const range = req.headers.range;

    if (range) {
      // 支持 Range 请求（进度拖拽/分段下载）
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize) {
        res.status(416).set('Content-Range', `bytes */${totalSize}`).end();
        return;
      }

      const chunk = audio.subarray(start, end + 1);
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunk.length,
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=86400'
      });
      res.end(chunk);
    } else {
      // 完整返回
      res.writeHead(200, {
        'Content-Length': totalSize,
        'Content-Type': mime,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400'
      });
      res.end(audio);
    }
  } catch (err) {
    console.error('[audio] 音频流传输失败:', err);
    res.status(500).json({ error: '音频流传输失败', detail: err.message });
  }
});

export default router;
