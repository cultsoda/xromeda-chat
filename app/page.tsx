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
import {
  X,
  Users,
  Smile,
  Send,
  AlertTriangle,
  Ban,
  Clock,
  Minus,
  ChevronUp,
  Share2,
  ListFilter,
  Search,
} from "lucide-react"
import { useGeneralChat } from "@/hooks/use-general-chat"
// --- End: Imports for ChannelHomeWithChat component ---

/**
 * PC 최소화 채팅 컴포넌트
 */
function PCMinimizedChat({
  participantCount,
  onExpand,
  onClose,
}: {
  participantCount: number
  onExpand: () => void
  onClose: () => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-80 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">라이브 채팅</span>
          <span className="text-xs text-gray-500">{participantCount}명</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onExpand} className="h-6 w-6 p-0" title="채팅창 복구">
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-6 w-6 p-0" title="채팅 나가기">
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="cursor-pointer" onClick={onExpand}>
        <p className="text-xs text-gray-600 truncate">최신: "오늘 방송 재밌어요"</p>
      </div>
    </div>
  )
}

/**
 * 채널 홈 배경 위에 표시될 라이브 채팅 레이어 컴포넌트
 */
function LiveChatLayer({ onMinimize }: { onMinimize: () => void }) {
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
    <div className="w-[420px] h-[calc(100vh - 9rem - 132px)] bg-white rounded-lg flex flex-col shadow-2xl border">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-base font-semibold text-gray-900">모모리나의 라이브 채팅</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-700 text-xs">🟢 활성</Badge>
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Users className="w-4 h-4" />
            {chatState.participantCount}명
          </span>
          <Button variant="ghost" size="sm" onClick={onMinimize} className="h-8 w-8 p-0 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
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
                  className={`rounded-2xl p-3 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md ${
                    selectedMessageId === message.id ? "ring-2 ring-purple-300" : ""
                  }`}
                  onClick={() => setSelectedMessageId(selectedMessageId === message.id ? null : message.id)}
                >
                  <p className="text-gray-900">{message.content}</p>
                </div>
              </div>
            </div>
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
              placeholder={isInputDisabled() ? "메시지 입력이 제한됩니다" : "메시지를 입력하세요..."}
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
            className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/**
 * 채널 홈 배경과 채팅 레이어를 포함하는 뷰 컴포넌트
 */
function ChannelHomeWithChat({ onExit }: { onExit: () => void }) {
  const [isChatMinimized, setIsChatMinimized] = useState(false)

  return (
    <div className="w-full h-screen overflow-hidden bg-white">
      {/* Background Image */}
      <div className="absolute inset-x-0 top-0 h-[200px] z-0">
        <Image
          src="/channel-home-bg.jpg"
          alt="채널 아트"
          layout="fill"
          objectFit="cover"
          objectPosition="center 30%"
          quality={100}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Channel Header */}
        <div className="pt-[132px]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                <Image
                  src="/placeholder-user.jpg"
                  alt="케인"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">케인의 채널</h1>
                <p className="text-sm text-gray-600 mt-1">케인인님 케인</p>
                <p className="text-sm text-gray-500 mt-1">회원 7 · 콘텐츠 9 · 채널 소개</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b">
          <nav className="-mb-px flex space-x-8">
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">홈</a>
            <a href="#" className="border-purple-500 text-purple-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" aria-current="page">멤버십</a>
            <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">채팅</a>
          </nav>
        </div>

        {/* Content Area */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Recent Contents */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">최근 콘텐츠</h2>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">최근 콘텐츠 영역</p>
            </div>
          </div>

          {/* Right: Popular Contents & Chat */}
          <div className="relative">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">인기 콘텐츠</h3>
                <div className="relative">
                  <Input placeholder="콘텐츠 검색" className="pl-8 w-48" />
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">인기 콘텐츠 영역</p>
              </div>
            </div>

            {/* Chat Layer Position */}
            <div className="absolute inset-0">
              {!isChatMinimized ? (
                <LiveChatLayer onMinimize={() => setIsChatMinimized(true)} />
              ) : (
                <div className="absolute bottom-0 right-0">
                  <PCMinimizedChat
                    participantCount={322}
                    onExpand={() => setIsChatMinimized(false)}
                    onClose={onExit}
                  />
                </div>
              )}
            </div>
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
