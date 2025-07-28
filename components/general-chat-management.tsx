"use client"

import CreatorManagementChat from "./creator-management-chat"

interface GeneralChatManagementProps {
  isOpen: boolean
  onClose: () => void
  isFullPage?: boolean
}

export default function GeneralChatManagement({ 
  isOpen, 
  onClose,
  isFullPage = false 
}: GeneralChatManagementProps) {
  return (
    <CreatorManagementChat 
      isOpen={isOpen} 
      onClose={onClose} 
      isFullPage={isFullPage}
    />
  )
}