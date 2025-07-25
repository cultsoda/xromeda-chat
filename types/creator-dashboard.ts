export interface ChatStats {
  totalParticipants: number
  totalMessages: number
  activeRooms: number
  blockedUsers: number
}

export interface PopularKeyword {
  rank: number
  keyword: string
  count: number
}

export interface AutoBlockStats {
  spam: number
  profanity: number
  flooding: number
}

export interface ChatRoom {
  id: string
  name: string
  type: "creator-only" | "general"
  status: "active" | "paused" | "ended"
  participantCount: number
  messageCount: number
  createdAt: Date
}

export interface AutoModerationSettings {
  enableSpamFilter: boolean
  enableProfanityFilter: boolean
  enableFloodProtection: boolean
  slowModeEnabled: boolean
  slowModeSeconds: number
}

export interface ChatLog {
  id: string
  roomName: string
  date: string
  messageCount: number
  participantCount: number
  downloadUrl: string
}
