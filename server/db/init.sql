-- =============================================================
-- Music App - MySQL 8.0 建表及初始化脚本
-- 使用说明: mysql -u root -p112233 < init.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS music_app
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE music_app;

-- -----------------------------------------------------------
-- 1. 用户表 (管理后台登录)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  username  VARCHAR(50)  NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role      VARCHAR(20)  NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 默认管理员: admin / 112233 (bcrypt 哈希)
-- 如果已存在同名用户则更新密码，确保密码哈希始终正确
INSERT INTO users (username, password, role)
VALUES ('admin', '$2a$10$q7EqCYi82mUtXyZcon6wV.wniBiyx1jp6qI2SeUrt7N3qIyk0vRAG', 'admin')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- -----------------------------------------------------------
-- 2. 歌曲表 (MP3 文件以 BLOB 形式存入 audio_data 字段)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS songs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(200)  NOT NULL,
  artist     VARCHAR(200)  NOT NULL,
  album      VARCHAR(200)  NOT NULL DEFAULT '',
  cover      VARCHAR(500)  NOT NULL DEFAULT '',
  audio_data LONGBLOB      NULL     COMMENT 'MP3 音频文件 BLOB',
  audio_mime VARCHAR(50)   NULL     DEFAULT 'audio/mpeg',
  duration   INT           NOT NULL DEFAULT 0 COMMENT '时长(秒)',
  genre      VARCHAR(50)   NOT NULL DEFAULT '流行',
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 3. 评论表
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  song_id    INT          NOT NULL,
  user_name  VARCHAR(100) NOT NULL DEFAULT '匿名用户',
  user_avatar VARCHAR(500) NOT NULL DEFAULT '',
  content    TEXT         NOT NULL,
  liked      INT          NOT NULL DEFAULT 0,
  type       VARCHAR(10)  NOT NULL DEFAULT 'new' COMMENT 'hot / new',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------
-- 4. 初始化歌曲元数据 (不含 BLOB，后续通过 API 上传 MP3)
-- -----------------------------------------------------------
INSERT INTO songs (id, name, artist, album, cover, duration, genre) VALUES
(1,  '起风了',       '买辣椒也用券',   '起风了',                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 325, '流行'),
(2,  '光年之外',     '邓紫棋',         '光年之外',              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 236, '流行'),
(3,  '演员',         '薛之谦',         '绅士',                  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 285, '流行'),
(4,  '稻香',         '周杰伦',         '魔杰座',                'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 229, '流行'),
(5,  '青花瓷',       '周杰伦',         '我很忙',                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 214, '流行'),
(6,  '告白气球',     '周杰伦',         '周杰伦的床边故事',      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 225, '流行'),
(7,  '说散就散',     '袁娅维',         '说散就散',              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 195, '流行'),
(8,  '后来',         '刘若英',         '我等你',                'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 305, '流行'),
(9,  '平凡之路',     '朴树',           '后会无期',              'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 285, '流行'),
(10, '追光者',       '岑宁儿',         '夏至未至',              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 258, '流行'),
(11, '晴天',         '周杰伦',         '叶惠美',                'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop', 267, '流行'),
(12, '七里香',       '周杰伦',         '七里香',                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 301, '流行'),
(13, '夜曲',         '周杰伦',         '十一月的萧邦',          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 254, '流行'),
(14, '简单爱',       '周杰伦',         '范特西',                'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 264, '流行'),
(15, '江南',         '林俊杰',         '第二天堂',              'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 257, '流行'),
(16, '可惜没如果',   '林俊杰',         '新地球',                'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 269, '流行'),
(17, '修炼爱情',     '林俊杰',         '因你而在',              'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop', 248, '流行'),
(18, '那些年',       '胡夏',           '那些年',                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 259, '流行'),
(19, '匆匆那年',     '王菲',           '匆匆那年',              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 245, '流行'),
(20, '爱情转移',     '陈奕迅',         '认了吧',                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 273, '流行'),
(21, '富士山下',     '陈奕迅',         'What''s Going On...?',  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 289, '流行'),
(22, '十年',         '陈奕迅',         '黑白灰',                'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 231, '流行'),
(23, '体面',         '于文文',         '体面',                  'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop', 252, '流行'),
(24, '消愁',         '毛不易',         '巨星不易工作室',        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 276, '流行'),
(25, '像我这样的人', '毛不易',         '平凡的一天',            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 238, '流行'),
(26, '成都',         '赵雷',           '无法长大',              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 312, '流行'),
(27, '年少有为',     '李荣浩',         '耳朵',                  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 244, '流行'),
(28, '李白',         '李荣浩',         '模特',                  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 253, '流行'),
(29, '水星记',       '郭顶',           '飞行器的执行周期',      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 295, '流行'),
(30, '温柔',         '五月天',         '人生海海',              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 291, '摇滚'),
(31, '知足',         '五月天',         '为爱而生',              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 276, '摇滚'),
(32, '说好不哭',     '周杰伦/阿信',    '说好不哭',              'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 225, '流行'),
(33, 'Mojito',       '周杰伦',         'Mojito',                'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 208, '流行'),
(34, '红色高跟鞋',   '蔡健雅',         '若你懂我的心',          'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop', 234, '流行'),
(35, '旅行的意义',   '陈绮贞',         '华丽的冒险',            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop', 265, '民谣'),
(36, '小幸运',       '田馥甄',         '我的少女时代',          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop', 268, '流行'),
(37, '矜持',         '王菲',           '天空',                  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop', 276, '流行'),
(38, '遇见',         '孙燕姿',         'The Moment',            'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop', 232, '流行'),
(39, '绿光',         '孙燕姿',         '绿光',                  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop', 264, '流行'),
(40, '演员和歌手',   '贾征宇',         '小时代',                'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop', 228, '流行')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- -----------------------------------------------------------
-- 5. 初始化默认评论数据
-- -----------------------------------------------------------
INSERT INTO comments (id, song_id, user_name, user_avatar, content, liked, type) VALUES
(1, 1, '音乐小王子', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', '这首歌真的太赞了！每次听都有不同的感受，歌词写得深入人心，旋律优美动听。', 2345, 'hot'),
(2, 1, '深夜听歌人', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', '这首歌陪伴了我整个青春，每次听到都会想起那些美好的时光。', 1890, 'hot'),
(3, 1, '音符控',     'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey', '歌手的声线太美了，这首歌的编曲也很棒，强烈推荐给大家！', 1567, 'hot'),
(4, 1, '新用户123',  'https://api.dicebear.com/7.x/avataaars/svg?seed=Muffin', '第一次听这首歌就被吸引了，已经单曲循环好久了~', 12, 'new'),
(5, 1, '音乐探索者', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',   '发现了一首好歌，今天心情特别好！', 45, 'new'),
(6, 1, '夜猫子听歌', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',   '深夜独处的时候最适合听这首歌了，治愈心灵。', 89, 'new')
ON DUPLICATE KEY UPDATE content = VALUES(content);
