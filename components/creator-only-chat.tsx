"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Users, Smile, Crown } from "lucide-react"
import { useCreatorChat } from "@/hooks/use-creator-chat"
import type { CreatorMessage } from "@/types/creator-chat"

interface CreatorOnlyChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatorOnlyChat({ isOpen, onClose }: CreatorOnlyChatProps) {
  const { participantCount, messages, addReaction, scrollRef, scrollToBottom } = useCreatorChat()
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [showEmojiPalette, setShowEmojiPalette] = useState(false)
  const [animatingEmoji, setAnimatingEmoji] = useState<{ messageId: string; emoji: string } | null>(null)

  const emojiPalette = ["❤", "😍", "🔥", "👍", "👏", "🤔", "💭", "😢", "😂", "🎉"]

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [isOpen, messages, scrollToBottom])

  const handleEmojiClick = (messageId: string, emoji: string) => {
    addReaction(messageId, emoji)
    setAnimatingEmoji({ messageId, emoji })
    setSelectedMessage(null)

    // 애니메이션 후 상태 초기화
    setTimeout(() => {
      setAnimatingEmoji(null)
    }, 600)
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

  const groupMessagesByDate = (messages: CreatorMessage[]) => {
    const groups: { [key: string]: CreatorMessage[] } = {}

    messages.forEach((message) => {
      const dateKey = formatDate(message.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  if (!isOpen) return null

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <Crown className="w-5 h-5 text-yellow-500" />
            <h1 className="text-lg font-semibold text-gray-900">크리에이터 전용 채팅</h1>
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
                      <div
                        className="bg-white rounded-2xl rounded-tl-md p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow relative"
                        onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                      >
                        <p className="text-gray-900">{message.content}</p>

                        {/* Animating Emoji */}
                        {animatingEmoji?.messageId === message.id && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
                            {animatingEmoji.emoji}
                          </div>
                        )}
                      </div>

                      {/* Emoji Reactions */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiClick(message.id, emoji)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all hover:scale-105 ${
                              message.userReaction === emoji
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="font-medium">{count}</span>
                          </button>
                        ))}

                        <button
                          onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          <Smile className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Emoji Selection Popup */}
                      {selectedMessage === message.id && (
                        <Card className="mt-2 border-0 shadow-lg">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">이모지 반응</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedMessage(null)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {emojiPalette.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleEmojiClick(message.id, emoji)}
                                  className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xl transition-all hover:scale-110"
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
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600 font-medium">메시지 입력이 제한됩니다</p>
            <p className="text-xs text-gray-500 mt-1">메시지별 이모지를 클릭하여 소통해 보세요</p>
          </div>

          {/* Emoji Palette Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setShowEmojiPalette(!showEmojiPalette)}
              className="flex items-center gap-2"
            >
              <Smile className="w-4 h-4" />
              이모지 팔레트
            </Button>

            {showEmojiPalette && (
              <Button variant="ghost" size="sm" onClick={() => setShowEmojiPalette(false)} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Emoji Palette */}
          {showEmojiPalette && (
            <Card className="mt-3 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-3">
                  {emojiPalette.map((emoji) => (
                    <button
                      key={emoji}
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
    </div>
  )
}
