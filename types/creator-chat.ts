export interface CreatorMessage {
  id: string
  content: string
  timestamp: Date
  reactions: {
    [emoji: string]: number
  }
  userReaction?: string
}

export interface EmojiReaction {
  emoji: string
  count: number
  hasUserReacted: boolean
}
