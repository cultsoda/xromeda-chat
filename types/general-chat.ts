export interface GeneralChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  originalContent?: string // 필터링 전 원본
  timestamp: Date
  type: "user" | "creator" | "system"
  membershipLevel: "basic" | "premium" | "vip"
  isFiltered?: boolean
  reactions?: {
    [emoji: string]: number
  }
  userReaction?: string // 현재 사용자가 누른 이모지
}

export interface ChatRestriction {
  type: "cooldown" | "blocked" | "paused"
  remainingTime: number // seconds
  reason?: string
  isActive: boolean
}

export interface ChatState {
  status: "active" | "paused" | "restricted"
  participantCount: number
  restriction: ChatRestriction | null
}
