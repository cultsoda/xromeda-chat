"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { X, Users, Crown, Send, Smile } from "lucide-react"
import { useCreatorChat } from "@/hooks/use-creator-chat"

interface CreatorChatManagementProps {
  isOpen: boolean
  onClose: () => void
  isFullPage?: boolean
}

export default function CreatorChatManagement({ 
  isOpen, 
  onClose,
  isFullPage = false 
}: CreatorChatManagementProps) {
  const { participantCount, messages, scrollRef, scrollToBottom } = useCreatorChat()
  const [creatorMessage, setCreatorMessage] = useState("")
  const [showEmojiPalette, setShowEmojiPalette] = useState(false)

  const emojiPalette = ["😊", "😂", "❤️", "👍", "👏", "🔥", "😍", "🤔", "😢", "🎉"]

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, messages, scrollToBottom])

  const sendMessage = () => {
    if (!creatorMessage.trim()) return

    console.log("Sending creator message:", creatorMessage)
    setCreatorMessage("")
    setShowEmojiPalette(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\./g, ".")
      .slice(0, -1)
  }

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {}

    messages.forEach((message) => {
      const dateKey = formatDate(message.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  const content = (
    <div className={isFullPage ? "h-screen bg-white flex flex-col" : "w-full max-w-2xl h-[90vh] bg-white rounded-lg flex flex-col"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <Crown className="w-5 h-5 text-yellow-500" />
          <h1 className="text-lg font-semibold text-gray-900">크리에이터 전용 채팅 관리</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {participantCount}명
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {Object.entries(messageGroups).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-6">
              <div className="bg-gray-300 h-px flex-1"></div>
              <span className="px-4 text-xs text-gray-500 bg-gray-50">{date}</span>
              <div className="bg-gray-300 h-px flex-1"></div>
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className="flex items-start gap-3 bg-purple-50 p-3 rounded-lg">
                  {/* Creator Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">모</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Creator Name & Badge */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-purple-700">모모리나</span>
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        크리에이터
                      </span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>

                    {/* Message Content */}
                    <div className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm">
                      <p className="text-gray-900">{message.content}</p>
                    </div>

                    {/* Emoji Reactions */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <div
                          key={emoji}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">크리에이터 전용 메시지 입력</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={creatorMessage}
              onChange={(e) => setCreatorMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="팬들에게 메시지를 보내세요..."
              className="flex-1"
            />
            <Button size="sm" onClick={sendMessage} disabled={!creatorMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowEmojiPalette(!showEmojiPalette)}>
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Emoji Palette */}
        {showEmojiPalette && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-3">
                {emojiPalette.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setCreatorMessage((prev) => prev + emoji)
                      setShowEmojiPalette(false)
                    }}
                    className="w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )

  if (isFullPage) {
    return content
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {content}
    </div>
  )
}