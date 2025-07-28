"use client"

import { Button } from "@/components/ui/button"
import { X, ChevronUp } from "lucide-react"

interface MobileChatMinibarProps {
  participantCount: number
  latestMessage: string
  onExpand: () => void
  onClose: () => void
}

export default function MobileChatMinibar({ 
  participantCount, 
  latestMessage, 
  onExpand, 
  onClose 
}: MobileChatMinibarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 lg:hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1 cursor-pointer" onClick={onExpand}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">채팅 중 • {participantCount}명 참여</span>
            <ChevronUp className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-600 truncate">
            최신: "{latestMessage}"
          </p>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose} className="ml-2">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}