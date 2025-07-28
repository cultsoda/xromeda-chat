"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Users, Smile, Send, Trash2, Ban, Pause, Play } from "lucide-react"
import ContextMenu from "./context-menu"
import type { ContextMenuPosition } from "@/types/creator-management"

interface GeneralChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  originalContent?: string
  timestamp: Date
  type: "user" | "creator" | "system"
  membershipLevel: "basic" | "premium" | "vip"
  isFiltered?: boolean
  reactions?: {
    [emoji: string]: number
  }
  userReaction?: string
}

interface ChatManagementState {
  isPaused: boolean
  participantCount: number
  selectedMessageId: string | null
  showEmojiPalette: boolean
}

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
  const [chatState, setChatState] = useState<ChatManagementState>({
    isPaused: false,
    participantCount: 332,
    selectedMessageId: null,
    showEmojiPalette: false,
  })

  const [messages, setMessages] = useState<GeneralChatMessage[]>([
    {
      id: "msg-1",
      userId: "creator-1",
      userName: "모모리나",
      userAvatar: "/placeholder.svg?height=40&width=40&text=모",
      content: "안녕하세요! 오늘도 함께해주셔서 감사합니다 ✨",
      timestamp: new Date(Date.now() - 300000),
      type: "creator",
      membershipLevel: "vip",
      reactions: { "❤": 45, "👍": 23, "🔥": 67 },
    },
    {
      id: "msg-2",
      userId: "user-1",
      userName: "게임러버123",
      userAvatar: "/placeholder.svg?height=40&width=40&text=게",
      content: "안녕하세요! 오늘 방송 재밌어요",
      timestamp: new Date(Date.now() - 240000),
      type: "user",
      membershipLevel: "basic",
      reactions: { "👍": 12, "😊": 8 },
    },
    {
      id: "msg-3",
      userId: "user-2",
      userName: "후원왕",
      userAvatar: "/placeholder.svg?height=40&width=40&text=후",
      content: "오늘도 화이팅하세요! 응원합니다 💪",
      timestamp: new Date(Date.now() - 180000),
      type: "user",
      membershipLevel: "premium",
      reactions: { "💪": 34, "❤": 19, "👏": 15 },
    },
    {
      id: "msg-4",
      userId: "user-3",
      userName: "익명팬",
      userAvatar: "/placeholder.svg?height=40&width=40&text=익",
      content: "이 ***** 정말 재밌네요!",
      originalContent: "이 게임 정말 재밌네요!",
      timestamp: new Date(Date.now() - 120000),
      type: "user",
      membershipLevel: "basic",
      isFiltered: true,
      reactions: { "😂": 5, "👍": 3 },
    },
    {
      id: "msg-5",
      userId: "user-4",
      userName: "팬123",
      userAvatar: "/placeholder.svg?height=40&width=40&text=팬",
      content: "기대됩니다! 🎉",
      timestamp: new Date(Date.now() - 60000),
      type: "user",
      membershipLevel: "basic",
    },
  ])

  const [currentMessage, setCurrentMessage] = useState("")
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const emojiPalette = ["😊", "😂", "❤️", "👍", "👏", "🔥", "😍", "🤔", "😢", "🎉", "💪", "🎮", "✨", "🙌", "💯"]

  // 실시간 참여자 수 업데이트 및 새 메시지 시뮬레이션
  useEffect(() => {
    if (!isOpen && !isFullPage) return

    const participantInterval = setInterval(() => {
      setChatState((prev) => ({
        ...prev,
        participantCount: prev.participantCount + Math.floor(Math.random() * 5) - 2,
      }))
    }, 5000)

    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7 && !chatState.isPaused) {
        const newMessages = [
          "ㅋㅋㅋㅋ",
          "재밌어요!",
          "오늘 방송 언제까지 하나요?",
          "다음 컨텐츠 기대돼요",
          "화이팅! 👍",
          "와 대박이네요",
          "모모리나 최고!",
        ]
        const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)]

        const newMessage: GeneralChatMessage = {
          id: `msg-${Date.now()}`,
          userId: `user-${Date.now()}`,
          userName: `팬${Math.floor(Math.random() * 1000)}`,
          userAvatar: "/placeholder.svg?height=40&width=40&text=팬",
          content: randomMessage,
          timestamp: new Date(),
          type: "user",
          membershipLevel: Math.random() > 0.7 ? "premium" : "basic",
        }

        setMessages((prev) => [...prev, newMessage])
      }
    }, 8000)

    return () => {
      clearInterval(participantInterval)
      clearInterval(messageInterval)
    }
  }, [isOpen, isFullPage, chatState.isPaused])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage: GeneralChatMessage = {
      id: `msg-${Date.now()}`,
      userId: "creator-1",
      userName: "모모리나",
      userAvatar: "/placeholder.svg?height=40&width=40&text=모",
      content: currentMessage,
      timestamp: new Date(),
      type: "creator",
      membershipLevel: "vip",
      reactions: {},
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")
    scrollToBottom()
  }

  const deleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    setContextMenu(null)
  }

  const blockUser = (userId: string, userName: string) => {
    // 해당 사용자의 메시지들을 숨김 처리
    setMessages((prev) =>
      prev.map((msg) =>
        msg.userId === userId ? { ...msg, content: "[차단된 사용자의 메시지]", isFiltered: true } : msg,
      ),
    )
    setContextMenu(null)
  }

  const togglePause = () => {
    setChatState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
    
    // 시스템 메시지 추가
    const systemMessage: GeneralChatMessage = {
      id: `system-${Date.now()}`,
      userId: "system",
      userName: "시스템",
      userAvatar: "",
      content: chatState.isPaused ? "채팅이 재개되었습니다" : "채팅이 일시정지되었습니다",
      timestamp: new Date(),
      type: "system",
      membershipLevel: "basic",
    }
    
    setMessages((prev) => [...prev, systemMessage])
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || {}
          return {
            ...msg,
            reactions: {
              ...reactions,
              [emoji]: (reactions[emoji] || 0) + 1,
            },
          }
        }
        return msg
      }),
    )
  }

  const selectMessage = (messageId: string) => {
    setChatState((prev) => ({
      ...prev,
      selectedMessageId: prev.selectedMessageId === messageId ? null : messageId,
    }))
  }

  const handleRightClick = (e: React.MouseEvent, messageId: string, userId: string, userName: string) => {
    e.preventDefault()
    if (userId === "creator-1" || userId === "system") return // 크리에이터나 시스템 메시지는 우클릭 불가

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId,
      userId,
      userName,
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getMembershipBadge = (level: string, type: string) => {
    if (type === "creator") {
      return <Badge className="bg-purple-100 text-purple-700 text-xs">크리에이터</Badge>
    }
    switch (level) {
      case "vip":
        return <Badge className="bg-purple-100 text-purple-700 text-xs">VIP</Badge>
      case "premium":
        return <Badge className="bg-yellow-100 text-yellow-700 text-xs">후원멤버십</Badge>
      case "basic":
        return <Badge className="bg-gray-100 text-gray-600 text-xs">기본멤버십</Badge>
      default:
        return null
    }
  }

  const content = (
    <div className={isFullPage ? "h-screen bg-white flex flex-col" : "w-full max-w-4xl h-[90vh] bg-white rounded-lg flex flex-col"}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 ${chatState.isPaused ? 'bg-yellow-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
          <h1 className="text-lg font-semibold text-gray-900">일반 채팅 관리</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={chatState.isPaused ? "default" : "outline"}
            onClick={togglePause}
            className="flex items-center gap-1"
          >
            {chatState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            {chatState.isPaused ? "재개" : "일시정지"}
          </Button>
          <Badge className={`text-xs ${chatState.isPaused ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {chatState.isPaused ? "🟡 일시정지" : "🟢 활성"}
          </Badge>
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {chatState.participantCount}명
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Status Info */}
      {chatState.isPaused && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="flex items-center gap-2 text-yellow-700">
            <Pause className="w-4 h-4" />
            <span className="text-sm font-medium">채팅이 일시정지되었습니다. 팬들은 메시지를 보낼 수 없습니다.</span>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === "system" ? (
              <div className="flex justify-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">{message.content}</div>
              </div>
            ) : (
              <div
                className={`flex items-start gap-3 ${
                  message.type === "creator" ? "bg-purple-50 p-3 rounded-lg" : ""
                } ${chatState.selectedMessageId === message.id ? "ring-2 ring-purple-300 rounded-lg" : ""}`}
                onContextMenu={(e) => handleRightClick(e, message.id, message.userId, message.userName)}
                onClick={() => selectMessage(message.id)}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "creator"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  <span className="font-semibold text-sm">{message.userName.charAt(0)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold ${message.type === "creator" ? "text-purple-700" : "text-gray-900"}`}
                    >
                      {message.userName}
                    </span>
                    {getMembershipBadge(message.membershipLevel, message.type)}
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                  </div>

                  {/* Message Content */}
                  <div
                    className={`rounded-2xl p-3 cursor-pointer transition-all ${
                      message.type === "creator"
                        ? "bg-white shadow-sm border border-purple-100"
                        : "bg-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <p className="text-gray-900">
                      {message.content}
                      {message.isFiltered && <span className="text-xs text-gray-500 ml-2">(필터링됨)</span>}
                    </p>
                  </div>

                  {/* Emoji Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <span>{emoji}</span>
                          <span className="font-medium">{count}</span>
                        </button>
                      ))}

                      <button
                        onClick={() => selectMessage(message.id)}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Smile className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}

                  {/* Emoji Selection */}
                  {chatState.selectedMessageId === message.id && (
                    <Card className="mt-2 border-0 shadow-lg">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">이모지 반응</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => selectMessage(message.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {emojiPalette.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
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
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-purple-800">크리에이터 메시지 입력</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="팬들에게 메시지를 보내세요..."
              className="flex-1"
            />
            <Button size="sm" onClick={sendMessage} disabled={!currentMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setChatState(prev => ({ ...prev, showEmojiPalette: !prev.showEmojiPalette }))}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Emoji Palette */}
        {chatState.showEmojiPalette && (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-8 gap-2">
                {emojiPalette.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setCurrentMessage((prev) => prev + emoji)
                      setChatState(prev => ({ ...prev, showEmojiPalette: false }))
                    }}
                    className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Context Menu */}
      <ContextMenu
        position={contextMenu}
        onClose={() => setContextMenu(null)}
        onDelete={deleteMessage}
        onBlock={blockUser}
      />
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