"use client"

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import CreatorManagementChat from "@/components/creator-management-chat"
import GeneralChatManagement from "@/components/general-chat-management"

function ChatLiveContent() {
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
        ) : roomType === 'general-chat' || roomType === 'general' ? (
          <GeneralChatManagement 
            isOpen={true} 
            onClose={() => window.close()}
            isFullPage={true}
          />
        ) : (
          // 기본값으로 일반 채팅 표시
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

export default function ChatLivePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    }>
      <ChatLiveContent />
    </Suspense>
  )
}