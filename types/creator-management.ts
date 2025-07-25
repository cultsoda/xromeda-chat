export interface ManagementAction {
  type: "delete" | "block" | "pause" | "resume" | "end"
  messageId?: string
  userId?: string
  userName?: string
}

export interface ContextMenuPosition {
  x: number
  y: number
  messageId: string
  userId: string
  userName: string
}
