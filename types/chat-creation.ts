export interface ChatRoomCreationData {
  type: "creator-only" | "general"
  title: string
  description: string
}

export interface ExistingChatRooms {
  hasCreatorOnly: boolean
  hasActiveGeneral: boolean
}
