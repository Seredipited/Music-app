import type { Song, Comment, SearchResult } from './types'

// 模拟歌曲数据
export const mockSongs: Song[] = [
  {
    id: 1,
    name: '起风了',
    artist: '买辣椒也用券',
    album: '起风了',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 325
  },
  {
    id: 2,
    name: '光年之外',
    artist: '邓紫棋',
    album: '光年之外',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 236
  },
  {
    id: 3,
    name: '演员',
    artist: '薛之谦',
    album: '绅士',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 285
  },
  {
    id: 4,
    name: '稻香',
    artist: '周杰伦',
    album: '魔杰座',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 229
  },
  {
    id: 5,
    name: '青花瓷',
    artist: '周杰伦',
    album: '我很忙',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 214
  },
  {
    id: 6,
    name: '告白气球',
    artist: '周杰伦',
    album: '周杰伦的床边故事',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 225
  },
  {
    id: 7,
    name: '说散就散',
    artist: '袁娅维',
    album: '说散就散',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 195
  },
  {
    id: 8,
    name: '后来',
    artist: '刘若英',
    album: '我等你',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 305
  },
  {
    id: 9,
    name: '平凡之路',
    artist: '朴树',
    album: '后会无期',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: 285
  },
  {
    id: 10,
    name: '追光者',
    artist: '岑宁儿',
    album: '夏至未至',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: 258
  },
  {
    id: 11,
    name: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    duration: 267
  },
  {
    id: 12,
    name: '七里香',
    artist: '周杰伦',
    album: '七里香',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: 301
  },
  {
    id: 13,
    name: '夜曲',
    artist: '周杰伦',
    album: '十一月的萧邦',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    duration: 254
  },
  {
    id: 14,
    name: '简单爱',
    artist: '周杰伦',
    album: '范特西',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    duration: 264
  },
  {
    id: 15,
    name: '江南',
    artist: '林俊杰',
    album: '第二天堂',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    duration: 257
  },
  {
    id: 16,
    name: '可惜没如果',
    artist: '林俊杰',
    album: '新地球',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    duration: 269
  },
  {
    id: 17,
    name: '修炼爱情',
    artist: '林俊杰',
    album: '因你而在',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    duration: 248
  },
  {
    id: 18,
    name: '那些年',
    artist: '胡夏',
    album: '那些年，我们一起追的女孩',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
    duration: 259
  },
  {
    id: 19,
    name: '匆匆那年',
    artist: '王菲',
    album: '匆匆那年',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
    duration: 245
  },
  {
    id: 20,
    name: '爱情转移',
    artist: '陈奕迅',
    album: '认了吧',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
    duration: 273
  },
  {
    id: 21,
    name: '富士山下',
    artist: '陈奕迅',
    album: 'What\'s Going On...?',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 289
  },
  {
    id: 22,
    name: '十年',
    artist: '陈奕迅',
    album: '黑白灰',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 231
  },
  {
    id: 23,
    name: '体面',
    artist: '于文文',
    album: '体面',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 252
  },
  {
    id: 24,
    name: '消愁',
    artist: '毛不易',
    album: '巨星不易工作室',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 276
  },
  {
    id: 25,
    name: '像我这样的人',
    artist: '毛不易',
    album: '平凡的一天',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 238
  },
  {
    id: 26,
    name: '成都',
    artist: '赵雷',
    album: '无法长大',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 312
  },
  {
    id: 27,
    name: '年少有为',
    artist: '李荣浩',
    album: '耳朵',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    duration: 244
  },
  {
    id: 28,
    name: '李白',
    artist: '李荣浩',
    album: '模特',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    duration: 253
  },
  {
    id: 29,
    name: '演员和歌手',
    artist: '贾征宇',
    album: '小时代',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    duration: 228
  },
  {
    id: 30,
    name: '水星记',
    artist: '郭顶',
    album: '飞行器的执行周期',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    duration: 295
  },
  {
    id: 31,
    name: '温柔',
    artist: '五月天',
    album: '人生海海',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    duration: 291
  },
  {
    id: 32,
    name: '知足',
    artist: '五月天',
    album: '为爱而生',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    duration: 276
  },
  {
    id: 33,
    name: '说好不哭',
    artist: '周杰伦/阿信',
    album: '说好不哭',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    duration: 225
  },
  {
    id: 34,
    name: 'Mojito',
    artist: '周杰伦',
    album: 'Mojito',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    duration: 208
  },
  {
    id: 35,
    name: '红色高跟鞋',
    artist: '蔡健雅',
    album: '若你懂我的心',
    cover: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    duration: 234
  },
  {
    id: 36,
    name: '旅行的意义',
    artist: '陈绮贞',
    album: '华丽的冒险',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    duration: 265
  },
  {
    id: 37,
    name: '小幸运',
    artist: '田馥甄',
    album: '我的少女时代',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
    duration: 268
  },
  {
    id: 38,
    name: '矜持',
    artist: '王菲',
    album: '天空',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3',
    duration: 276
  },
  {
    id: 39,
    name: '遇见',
    artist: '孙燕姿',
    album: 'The Moment',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3',
    duration: 232
  },
  {
    id: 40,
    name: '绿光',
    artist: '孙燕姿',
    album: '绿光',
    cover: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3',
    duration: 264
  }
]

// 模拟评论数据
export const mockComments: Comment[] = [
  {
    id: 1,
    userId: 1001,
    userName: '音乐小王子',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    content: '这首歌真的太赞了！每次听都有不同的感受，歌词写得深入人心，旋律优美动听。',
    time: '2小时前',
    liked: 2345,
    isLiked: false,
    type: 'hot'
  },
  {
    id: 2,
    userId: 1002,
    userName: '深夜听歌人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    content: '这首歌陪伴了我整个青春，每次听到都会想起那些美好的时光。',
    time: '5小时前',
    liked: 1890,
    isLiked: true,
    type: 'hot'
  },
  {
    id: 3,
    userId: 1003,
    userName: '音符控',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey',
    content: '歌手的声线太美了，这首歌的编曲也很棒，强烈推荐给大家！',
    time: '1天前',
    liked: 1567,
    isLiked: false,
    type: 'hot'
  },
  {
    id: 4,
    userId: 1004,
    userName: '新用户123',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Muffin',
    content: '第一次听这首歌就被吸引了，已经单曲循环好久了~',
    time: '刚刚',
    liked: 12,
    isLiked: false,
    type: 'new'
  },
  {
    id: 5,
    userId: 1005,
    userName: '音乐探索者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',
    content: '发现了一首好歌，今天心情特别好！',
    time: '3分钟前',
    liked: 45,
    isLiked: false,
    type: 'new'
  },
  {
    id: 6,
    userId: 1006,
    userName: '夜猫子听歌',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
    content: '深夜独处的时候最适合听这首歌了，治愈心灵。',
    time: '10分钟前',
    liked: 89,
    isLiked: false,
    type: 'new'
  }
]

// 搜索函数
export function searchMusic(keyword: string): Promise<SearchResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerKeyword = keyword.toLowerCase()
      const filteredSongs = mockSongs.filter(
        song =>
          song.name.toLowerCase().includes(lowerKeyword) ||
          song.artist.toLowerCase().includes(lowerKeyword) ||
          song.album.toLowerCase().includes(lowerKeyword)
      )

      resolve({
        songs: filteredSongs,
        albums: [],
        artists: []
      })
    }, 300)
  })
}

// 获取歌曲评论
export function getComments(_songId: number, page: number = 1, type: 'hot' | 'new' = 'hot'): Promise<{ comments: Comment[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredComments = mockComments.filter(c => c.type === type)
      const start = (page - 1) * 10
      const end = start + 10
      resolve({
        comments: filteredComments.slice(start, end),
        total: filteredComments.length
      })
    }, 300)
  })
}

// 提交评论
export function submitComment(_songId: number, content: string): Promise<Comment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now(),
        userId: 9999,
        userName: '当前用户',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
        content,
        time: '刚刚',
        liked: 0,
        isLiked: false,
        type: 'new'
      }
      resolve(newComment)
    }, 500)
  })
}
