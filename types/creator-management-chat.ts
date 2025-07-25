export interface CreatorManagementMessage {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  originalContent?: string
  timestamp: Date
  type: "creator" | "fan"
  membershipLevel: "basic" | "premium" | "vip"
  isFiltered?: boolean
  reactions?: {
    [emoji: string]: number
  }
}

export interface ChatManagementState {
  isPaused: boolean
  participantCount: number
  selectedMessageId: string | null
  showManagementMenu: boolean
  showEmojiPalette: boolean
}

export interface ManagementAction {
  type: "delete" | "block" | "pause" | "resume" | "end"
  messageId?: string
  userId?: string
  userName?: string
}
