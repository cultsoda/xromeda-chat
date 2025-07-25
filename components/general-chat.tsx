"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Users, Smile, Send, AlertTriangle, Ban, Clock } from "lucide-react"
import { useGeneralChat } from "@/hooks/use-general-chat"

interface GeneralChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function GeneralChat({ isOpen, onClose }: GeneralChatProps) {
  const {
    chatState,
    messages,
    currentMessage,
    setCurrentMessage,
    showEmojiPalette,
    setShowEmojiPalette,
    sendMessage,
    scrollRef,
    formatTime,
    restrictionDemo,
    setRestrictionDemo,
    selectedMessageId,
    setSelectedMessageId,
    addReaction,
  } = useGeneralChat()

  // 이모지 팔레트 확장
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

  const getStatusText = () => {
    switch (chatState.status) {
      case "active":
        return "🟢 활성"
      case "paused":
        return "🟡 일시정지"
      case "restricted":
        return "🔴 제한"
      default:
        return "⚪ 대기"
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-lg flex flex-col">
        {/* Demo Controls - 개발용 */}
        <div className="bg-gray-100 p-2 flex gap-2 text-xs rounded-t-lg">
          <Button
            size="sm"
            variant={restrictionDemo === "none" ? "default" : "outline"}
            onClick={() => setRestrictionDemo("none")}
          >
            정상
          </Button>
          <Button
            size="sm"
            variant={restrictionDemo === "cooldown" ? "default" : "outline"}
            onClick={() => setRestrictionDemo("cooldown")}
          >
            쿨타임
          </Button>
          <Button
            size="sm"
            variant={restrictionDemo === "blocked" ? "default" : "outline"}
            onClick={() => setRestrictionDemo("blocked")}
          >
            차단
          </Button>
          <Button
            size="sm"
            variant={restrictionDemo === "paused" ? "default" : "outline"}
            onClick={() => setRestrictionDemo("paused")}
          >
            일시정지
          </Button>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 ${getStatusColor()} rounded-full animate-pulse`}></div>
            <h1 className="text-lg font-semibold text-gray-900">모모리나의 라이브 채팅</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-gray-100 text-gray-600 text-xs">{getStatusText()}</Badge>
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
            {chatState.restriction.type === "cooldown" && (
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  ⚠️ 1분 쿨타임이 적용되었습니다. ({chatState.restriction.remainingTime}초 남음)
                </span>
              </div>
            )}
            {chatState.restriction.type === "blocked" && (
              <div className="text-red-700">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-4 h-4" />
                  <span className="font-medium">🚫 채팅이 제한되었습니다</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>1시간 차단 - 남은 시간: {chatState.restriction.remainingTime}초</p>
                  <p>사유: {chatState.restriction.reason}</p>
                  <p>문의사항이 있으시면 고객센터로 연락해주세요</p>
                </div>
              </div>
            )}
            {chatState.restriction.type === "paused" && (
              <div className="flex items-center gap-2 text-yellow-700">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  🟡 전체 채팅 일시정지 - 남은 시간: {chatState.restriction.remainingTime}초
                </span>
              </div>
            )}
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

                    {/* Message Content */}
                    <div
                      className={`rounded-2xl p-3 cursor-pointer transition-all ${
                        message.type === "creator"
                          ? "bg-white shadow-sm border border-purple-100"
                          : "bg-white shadow-sm hover:shadow-md"
                      } ${
                        selectedMessageId === message.id && message.type !== "system" ? "ring-2 ring-purple-300" : ""
                      }`}
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

                    {/* Emoji Reactions */}
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

                    {/* Emoji Selection Popup */}
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
        <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
          {chatState.status === "paused" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 text-center">
              <p className="text-sm text-yellow-800 font-medium">
                채팅이 일시 정지되었습니다. 크리에이터만 메시지를 보낼 수 있습니다.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmojiPalette(!showEmojiPalette)}
              disabled={isInputDisabled()}
              className="flex-shrink-0"
            >
              <Smile className="w-4 h-4" />
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
              className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Emoji Palette */}
          {showEmojiPalette && !isInputDisabled() && (
            <Card className="mt-3 border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="grid grid-cols-5 gap-3">
                  {emojiPalette.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setCurrentMessage((prev) => prev + emoji)
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
    </div>
  )
}
