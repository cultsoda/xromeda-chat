"use client"

import { Button } from "@/components/ui/button"
import { X, Minus, Square } from "lucide-react"
import CreatorOnlyChat from "./creator-only-chat"
import GeneralChat from "./general-chat"
import { useState } from "react"

interface SidebarChatProps {
  roomType: string
  isMinimized: boolean
  onMinimize: () => void
  onClose: () => void
}

export default function SidebarChat({ roomType, isMinimized, onMinimize, onClose }: SidebarChatProps) {
  const [showCreatorChat, setShowCreatorChat] = useState(false)
  const [showGeneralChat, setShowGeneralChat] = useState(false)

  const handleChatOpen = () => {
    if (roomType === "creator-only") {
      setShowCreatorChat(true)
    } else {
      setShowGeneralChat(true)
    }
  }

  return (
    <>
      <div className={`flex flex-col h-full bg-white border-l shadow-lg transition-all duration-300 ${
        isMinimized ? 'w-16' : 'w-96'
      }`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          {!isMinimized && (
            <h3 className="font-semibold text-gray-900">
              {roomType === "creator-only" ? "크리에이터 전용" : "라이브 채팅"}
            </h3>
          )}
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={onMinimize} className="h-8 w-8 p-0">
              <Minus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* 채팅 영역 */}
        {!isMinimized && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-4">
              <Button 
                onClick={handleChatOpen}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                채팅 참여하기
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 채팅 모달들 */}
      <CreatorOnlyChat isOpen={showCreatorChat} onClose={() => setShowCreatorChat(false)} />
      <GeneralChat isOpen={showGeneralChat} onClose={() => setShowGeneralChat(false)} />
    </>
  )
}