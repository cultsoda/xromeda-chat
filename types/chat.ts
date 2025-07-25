export interface User {
  id: string
  name: string
  avatar: string
  role: "creator" | "fan" | "moderator"
  isBlocked?: boolean
}

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  type: "text" | "emoji" | "system"
  isDeleted?: boolean
}

export interface ChatRoom {
  id: string
  name: string
  type: "creator-only" | "general"
  status: "active" | "ongoing" | "waiting" | "ended"
  creatorId: string
  participantCount: number
  messages: ChatMessage[]
  settings: {
    allowEmojis: boolean
    autoModeration: boolean
    slowMode: number // seconds
  }
}

export interface ChatStats {
  totalMessages: number
  activeUsers: number
  blockedUsers: number
  deletedMessages: number
}
