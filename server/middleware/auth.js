import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'music-app-secret';

// 轻量 JWT：生成 token
export function signToken(payload, expiresIn = '7d') {
  const now = Math.floor(Date.now() / 1000);
  const seconds = typeof expiresIn === 'string'
    ? parseDuration(expiresIn)
    : expiresIn;

  const body = {
    ...payload,
    iat: now,
    exp: now + seconds
  };

  const headerB64 = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(body)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

// 轻量 JWT：验证 token
export function verifyToken(token) {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  // 时间恒定比较，防时序攻击
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

// 鉴权中间件
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: '未登录或 Token 已过期' });
  }

  req.user = payload;
  next();
}

// 管理员鉴权中间件
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: '无权访问' });
  }
  next();
}

function parseDuration(str) {
  const unit = str.slice(-1);
  const value = parseInt(str, 10);
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 86400 * 7;
  }
}
