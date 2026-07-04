import type { Song, SearchResult, Comment } from './types'
import { searchSongs, fetchComments, addComment } from '@/lib/api'

// 模拟歌曲数据（API 不可用时的降级数据）
export const mockSongs: Song[] = []

// 模拟评论数据（降级数据）
export const mockComments: Comment[] = []

// 搜索函数 — 优先调用后端 API，失败则降级
export function searchMusic(keyword: string): Promise<SearchResult> {
  return searchSongs(keyword).catch(() => {
    // 降级：本地过滤
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          songs: [],
          albums: [],
          artists: []
        })
      }, 300)
    })
  })
}

// 获取歌曲评论
export function getComments(songId: number, page: number = 1, type: 'hot' | 'new' = 'hot'): Promise<{ comments: Comment[]; total: number }> {
  return fetchComments(songId, page, type).catch(() => {
    return { comments: [], total: 0 }
  })
}

// 提交评论
export function submitComment(songId: number, content: string): Promise<Comment> {
  return addComment(songId, content)
}
