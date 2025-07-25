"use client"

import CreatorManagementChat from "./creator-management-chat"

interface GeneralChatManagementProps {
  isOpen: boolean
  onClose: () => void
}

export default function GeneralChatManagement({ isOpen, onClose }: GeneralChatManagementProps) {
  return <CreatorManagementChat isOpen={isOpen} onClose={onClose} />
}
