"use client"

import { ChatProvider } from "@/context/chat-context"
import { useState } from "react"
import ChannelHomeChatTab from "@/components/channel-home-chat"
import CreatorDashboard from "@/components/creator-dashboard"
import { Button } from "@/components/ui/button"

// --- Start: Imports for ChannelHomeWithChat component ---
import Image from "next/image"
import type React from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Users, Smile, Send, AlertTriangle, Ban, Clock } from "lucide-react"
import { useGeneralChat } from "@/hooks/use-general-chat"
// --- End: Imports for ChannelHomeWithChat component ---

/**
 * 채널 홈 배경 위에 표시될 라이브 채팅 레이어 컴포넌트
 */
function LiveChatLayer({ onClose }: { onClose: () => void }) {
  const {
    chatState,
    messages,
    currentMessage,
    setCurrentMessage,
    showEmojiPalette,
    setShowEmojiPalette,
    sendMessage,
    scrollRef,
    selectedMessageId,
    setSelectedMessageId,
    addReaction,
  } = useGeneralChat()

  const emojiPalette = ["😊", "😂", "❤️", "👍", "👏", "🔥", "😍", "🤔", "😢", "🎉", "💪", "🎮", "✨", "🙌", "💯"]

  const getMembershipBadge = (level: string) => {
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

  const getStatusColor = () => {
    switch (chatState.status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "restricted":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const isInputDisabled = () => {
    return chatState.restriction?.isActive || chatState.status === "paused"
  }

  return (
    <div className="w-[420px] h-[calc(100vh - 9rem)] bg-white rounded-lg flex flex-col shadow-2xl border">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 ${getStatusColor()} rounded-full animate-pulse`}></div>
          <h1 className="text-lg font-semibold text-gray-900">모모리나의 라이브 채팅</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-700 text-xs">
            🟢 활성
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

      {/* Restriction Warning */}
      {chatState.restriction?.isActive && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          {/* ... (Restriction logic from GeneralChat) ... */}
        </div>
      )}

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.type === "system" ? (
              <div className="flex justify-center">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">{message.content}</div>
              </div>
            ) : (
              <div
                className={`flex items-start gap-3 ${message.type === "creator" ? "bg-purple-50 p-3 rounded-lg" : ""}`}
              >
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
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold ${message.type === "creator" ? "text-purple-700" : "text-gray-900"}`}
                    >
                      {message.userName}
                    </span>
                    {message.type === "creator" && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">크리에이터</Badge>
                    )}
                    {message.type === "user" && getMembershipBadge(message.membershipLevel)}
                    <span className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <div
                    className={`rounded-2xl p-3 cursor-pointer transition-all ${
                      message.type === "creator"
                        ? "bg-white shadow-sm border border-purple-100"
                        : "bg-white shadow-sm hover:shadow-md"
                    } ${selectedMessageId === message.id && message.type !== "system" ? "ring-2 ring-purple-300" : ""}`}
                    onClick={() =>
                      message.type !== "system" &&
                      setSelectedMessageId(selectedMessageId === message.id ? null : message.id)
                    }
                  >
                    <p className="text-gray-900">
                      {message.content}
                      {message.isFiltered && <span className="text-xs text-gray-500 ml-2">(필터링됨)</span>}
                    </p>
                  </div>
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
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
                        onClick={() => setSelectedMessageId(selectedMessageId === message.id ? null : message.id)}
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Smile className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}

                  {selectedMessageId === message.id && message.type !== "system" && (
                    <Card className="mt-2 border-0 shadow-lg">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">이모지 반응</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedMessageId(null)}
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
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEmojiPalette(!showEmojiPalette)}
            disabled={isInputDisabled()}
            className="flex-shrink-0"
          >
            <Smile className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isInputDisabled() ? "메시지 입력이 제한됩니다" : "메시지를 입력하세요......(500자 제한)"}
              disabled={isInputDisabled()}
              maxLength={500}
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              {currentMessage.length}/500
            </span>
          </div>
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isInputDisabled()}
            size="icon"
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {showEmojiPalette && !isInputDisabled() && (
          <Card className="mt-3 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-8 gap-2">
                {emojiPalette.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setCurrentMessage((prev) => prev + emoji)
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
    </div>
  )
}

/**
 * 채널 홈 배경과 채팅 레이어를 포함하는 뷰 컴포넌트
 */
function ChannelHomeWithChat({ onExit }: { onExit: () => void }) {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/channel-home-bg.jpg"
          alt="케인의 채널 홈"
          layout="fill"
          objectFit="cover"
          objectPosition="top center"
          quality={100}
        />
      </div>

      {/* Centered Content container to help with positioning */}
      <div className="relative w-full h-full flex justify-center">
        <div className="w-full max-w-6xl h-full relative">
          <div className="absolute top-[132px] right-0">
            <LiveChatLayer onClose={onExit} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [currentView, setCurrentView] = useState<"fan" | "creator" | "channel-chat">("fan")

  return (
    <ChatProvider>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={() => setCurrentView("fan")} variant={currentView === "fan" ? "default" : "outline"} size="sm">
          팬 뷰
        </Button>
        <Button
          onClick={() => setCurrentView("creator")}
          variant={currentView === "creator" ? "default" : "outline"}
          size="sm"
        >
          크리에이터 뷰
        </Button>
        <Button
          onClick={() => setCurrentView("channel-chat")}
          variant={currentView === "channel-chat" ? "default" : "outline"}
          size="sm"
        >
          채널 홈+채팅
        </Button>
      </div>

      {currentView === "fan" && <ChannelHomeChatTab />}
      {currentView === "creator" && <CreatorDashboard />}
      {currentView === "channel-chat" && <ChannelHomeWithChat onExit={() => setCurrentView("fan")} />}
    </ChatProvider>
  )
}