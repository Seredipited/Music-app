import type { Song, SearchResult, Comment } from '@/stores/types';

const BASE_URL = '/api';

type RefreshFn = () => Promise<boolean>;
let refreshHandler: RefreshFn | null = null;

// 注册 token 刷新处理器（由 main.ts 在 pinia 初始化后设置）
export function registerRefreshHandler(fn: RefreshFn) {
  refreshHandler = fn;
}

// 从 localStorage 读取当前 token
function getToken(): string | null {
  try {
    const raw = localStorage.getItem('music_auth');
    if (!raw) return null;
    return JSON.parse(raw).token || null;
  } catch {
    return null;
  }
}

// 构造带认证头的请求参数
function authHeaders(init?: RequestInit): RequestInit {
  const token = getToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return { ...init, headers };
}

// 带认证的请求封装：遇到 401 时自动尝试刷新 token 并重试一次
async function fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, authHeaders(init));

  // 401 且存在刷新处理器时，尝试刷新后重试
  if (res.status === 401 && refreshHandler) {
    const ok = await refreshHandler();
    if (ok) {
      return fetch(input, authHeaders(init));
    }
  }

  return res;
}

// ===================== 歌曲 API =====================

export async function fetchSongs(): Promise<Song[]> {
  const res = await fetchWithAuth(`${BASE_URL}/songs`);
  if (!res.ok) throw new Error('获取歌曲列表失败');
  return res.json();
}

export async function fetchSong(id: number): Promise<Song> {
  const res = await fetchWithAuth(`${BASE_URL}/songs/${id}`);
  if (!res.ok) throw new Error('获取歌曲失败');
  return res.json();
}

export async function createSong(formData: FormData): Promise<Song> {
  const res = await fetchWithAuth(`${BASE_URL}/songs`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('添加歌曲失败');
  return res.json();
}

export async function updateSong(id: number, formData: FormData): Promise<Song> {
  const res = await fetchWithAuth(`${BASE_URL}/songs/${id}`, {
    method: 'PUT',
    body: formData
  });
  if (!res.ok) throw new Error('更新歌曲失败');
  return res.json();
}

export async function deleteSong(id: number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/songs/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('删除歌曲失败');
}

export async function searchSongs(keyword: string): Promise<SearchResult> {
  const res = await fetchWithAuth(`${BASE_URL}/songs/search?q=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('搜索失败');
  return res.json();
}

// ===================== 评论 API =====================

export async function fetchComments(
  songId: number,
  page: number = 1,
  type: 'hot' | 'new' = 'hot'
): Promise<{ comments: Comment[]; total: number }> {
  const res = await fetchWithAuth(
    `${BASE_URL}/comments?songId=${songId}&page=${page}&type=${type}`
  );
  if (!res.ok) throw new Error('获取评论失败');
  return res.json();
}

export async function addComment(
  songId: number,
  content: string
): Promise<Comment> {
  const res = await fetchWithAuth(`${BASE_URL}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ songId, content })
  });
  if (!res.ok) throw new Error('提交评论失败');
  return res.json();
}

// ===================== 认证 API =====================

export async function loginApi(
  username: string,
  password: string
): Promise<{ id: number; username: string; role: string; token: string; refreshToken: string }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '登录失败' }));
    throw new Error(err.error || '登录失败');
  }
  return res.json();
}

export async function refreshTokenApi(refreshToken: string): Promise<{ token: string }> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) throw new Error('Token 刷新失败');
  return res.json();
}
