export interface Song {
  id: number
  name: string
  artist: string
  album: string
  cover: string
  audio: string
  duration: number
  genre?: string
  lyrics?: string
}

export interface Comment {
  id: number
  userId: number
  userName: string
  userAvatar: string
  content: string
  time: string
  liked: number
  isLiked: boolean
  type: 'hot' | 'new'
}

export interface SearchResult {
  songs: Song[]
  albums: Album[]
  artists: Artist[]
}

export interface Album {
  id: number
  name: string
  artist: string
  cover: string
  year: number
}

export interface Artist {
  id: number
  name: string
  avatar: string
  fans: number
}
