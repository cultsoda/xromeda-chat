"use client"

import { useSearchParams } from 'next/navigation'
import CreatorManagementChat from "@/components/creator-management-chat"
import GeneralChatManagement from "@/components/general-chat-management"

export default function ChatLivePage() {
  const searchParams = useSearchParams()
  const roomType = searchParams.get('room')
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen">
        {roomType === 'creator-only' ? (
          <CreatorManagementChat 
            isOpen={true} 
            onClose={() => window.close()}
            isFullPage={true}
          />
        ) : (
          <GeneralChatManagement 
            isOpen={true} 
            onClose={() => window.close()}
            isFullPage={true}
          />
        )}
      </div>
    </div>
  )
}