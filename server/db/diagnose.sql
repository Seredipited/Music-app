-- ==========================================
-- 诊断脚本：找出 LOAD_FILE 失败的原因
-- 在 Navicat 中运行这个查询，看看到底哪里出错了
-- ==========================================
USE music_app;

-- 第1步：检查你的 secure_file_priv 路径是什么
-- 返回值就是 MySQL 允许 LOAD_FILE 读取的目录
-- 你的 MP3 文件必须在这个目录下
SELECT @@secure_file_priv AS 允许路径;

-- 第2步：测试读取一个具体的文件（换你的实际文件名）
-- 如果返回 NULL 表示读不到；返回二进制数据表示能读到
SELECT 
  'D:/MySQLDate/MySQL/MySQL Server 8.0/Uploads/起风了.mp3' AS 测试路径,
  LOAD_FILE('D:/MySQLDate/MySQL/MySQL Server 8.0/Uploads/起风了.mp3') IS NULL AS 是否读取失败;

-- 第3步：检查文件路径是否存在（如果上一步返回 NULL，试试这个）
-- 如果路径不存在或权限不足，这里会报错
SELECT 
  IF(
    LOAD_FILE('D:/MySQLDate/MySQL/MySQL Server 8.0/Uploads/起风了.mp3') IS NULL,
    '❌ 读不到！原因: 1)路径不存在 2)不在secure_file_priv下 3)MySQL没权限',
    '✅ 能读到'
  ) AS 诊断结果;

-- 第4步：把上面四条 UPDATE 改成一条可见结果的 SELECT，方便调试
-- 先把 UPDATE 换成 SELECT 测试，确认路径正确后再改成 UPDATE
SELECT 
  '起风了' AS 歌名,
  LENGTH(LOAD_FILE('D:/MySQLDate/MySQL/MySQL Server 8.0/Uploads/起风了.mp3')) AS 文件大小_字节,
  CASE 
    WHEN LENGTH(LOAD_FILE('D:/MySQLDate/MySQL/MySQL Server 8.0/Uploads/起风了.mp3')) > 0 THEN '✅ 能读取'
    ELSE '❌ 读取失败，路径或权限问题'
  END AS 状态;
