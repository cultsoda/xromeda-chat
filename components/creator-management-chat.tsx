"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Users, Smile, Send, Trash2, Ban, Pause, Play, Square } from "lucide-react"
import { useCreatorManagementChat } from "@/hooks/use-creator-management-chat"
import ConfirmationModal from "./confirmation-modal"

interface CreatorManagementChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatorManagementChat({ isOpen, onClose }: CreatorManagementChatProps) {
  const {
    chatState,
    setChatState,
    messages,
    currentMessage,
    setCurrentMessage,
    scrollRef,
    sendMessage,
    deleteMessage,
    blockUser,
    togglePause,
    addReaction,
    selectMessage,
    formatTime,
    groupMessagesByDate,
  } = useCreatorManagementChat()

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    onConfirm: () => void
    variant?: "default" | "destructive"
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
  })

  const emojiPalette = ["❤", "😍", "🔥", "👍", "👏", "🤔", "💭", "😢", "😂", "🎉"]

  const getMembershipBadge = (level: string) => {
    switch (level) {
      case "premium":
        return <Badge className="bg-blue-100 text-blue-700 text-xs">후원멤버십</Badge>
      case "basic":
        return <Badge className="bg-yellow-100 text-yellow-700 text-xs">기본멤버십</Badge>
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

  const handleDeleteMessage = (messageId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "메시지 삭제",
      message: "이 메시지를 삭제하시겠습니까?",
      confirmText: "삭제",
      variant: "destructive",
      onConfirm: () => {
        deleteMessage(messageId)
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleBlockUser = (userId: string, userName: string) => {
    setConfirmModal({
      isOpen: true,
      title: "사용자 차단",
      message: `${userName}님을 1시간 동안 차단하시겠습니까?`,
      confirmText: "차단",
      variant: "destructive",
      onConfirm: () => {
        blockUser(userId, userName)
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
      },
    })
  }

  const handleTogglePause = () => {
    if (chatState.isPaused) {
      togglePause()
    } else {
      setConfirmModal({
        isOpen: true,
        title: "채팅 일시 정지",
        message: "전체 채팅을 일시 정지하시겠습니까?",
        confirmText: "일시 정지",
        variant: "destructive",
        onConfirm: () => {
          togglePause()
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        },
      })
    }
  }

  const handleEndChat = () => {
    setConfirmModal({
      isOpen: true,
      title: "채팅방 종료",
      message: "채팅방을 종료하시겠습니까? 종료 후에는 복구할 수 없습니다.",
      confirmText: "종료",
      variant: "destructive",
      onConfirm: () => {
        console.log("채팅방 종료")
        setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        onClose()
      },
    })
  }

  if (!isOpen) return null

  const messageGroups = groupMessagesByDate(messages)

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-lg flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-lg font-semibold text-gray-900">모모리나의 라이브 채팅</h1>
              {chatState.isPaused && <Badge className="bg-yellow-100 text-yellow-700 text-xs">일시정지</Badge>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {chatState.participantCount}명
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
                    <div
                      className={`flex items-start gap-3 ${
                        message.type === "creator" ? "bg-gray-100 p-3 rounded-lg" : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === "creator"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        <span className="font-semibold text-sm">썸</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* User Info */}
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-semibold ${
                              message.type === "creator" ? "text-purple-700" : "text-gray-900"
                            }`}
                          >
                            {message.userName}
                          </span>
                          {message.type === "creator" ? (
                            <Badge className="bg-orange-100 text-orange-700 text-xs">크리에이터</Badge>
                          ) : (
                            getMembershipBadge(message.membershipLevel)
                          )}
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>

                        {/* Message Content */}
                        <div
                          className={`rounded-2xl p-3 cursor-pointer transition-all ${
                            message.type === "creator"
                              ? "bg-white shadow-sm border border-purple-100"
                              : "bg-white shadow-sm hover:shadow-md"
                          } ${
                            chatState.selectedMessageId === message.id && message.type === "fan"
                              ? "ring-2 ring-purple-300"
                              : ""
                          }`}
                          onClick={() => message.type === "fan" && selectMessage(message.id)}
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
                              onClick={() =>
                                setChatState((prev) => ({
                                  ...prev,
                                  selectedMessageId: message.id,
                                  showEmojiPalette: !prev.showEmojiPalette,
                                  showManagementMenu: false,
                                }))
                              }
                              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              <Smile className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}

                        {/* Management Menu */}
                        {chatState.selectedMessageId === message.id &&
                          chatState.showManagementMenu &&
                          message.type === "fan" && (
                            <Card className="mt-2 border-0 shadow-lg">
                              <CardContent className="p-3">
                                {/* Emoji Palette */}
                                <div className="mb-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">이모지 반응</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setChatState((prev) => ({ ...prev, showManagementMenu: false }))}
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-5 gap-2">
                                    {emojiPalette.map((emoji) => (
                                      <button
                                        key={emoji}
                                        onClick={() => {
                                          addReaction(message.id, emoji)
                                          setChatState((prev) => ({ ...prev, showManagementMenu: false }))
                                        }}
                                        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-all hover:scale-110"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Management Actions */}
                                <div className="space-y-2 pt-2 border-t border-gray-200">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    삭제
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleBlockUser(message.userId, message.userName)}
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Ban className="w-4 h-4 mr-2" />
                                    차단 (1시간)
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                        {/* Emoji Palette Only */}
                        {chatState.selectedMessageId === message.id &&
                          chatState.showEmojiPalette &&
                          !chatState.showManagementMenu && (
                            <Card className="mt-2 border-0 shadow-lg">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">이모지 반응</span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setChatState((prev) => ({ ...prev, showEmojiPalette: false }))}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                  {emojiPalette.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => {
                                        addReaction(message.id, emoji)
                                        setChatState((prev) => ({ ...prev, showEmojiPalette: false }))
                                      }}
                                      className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-lg transition-all hover:scale-110"
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

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
            {chatState.isPaused && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3 text-center">
                <p className="text-sm text-yellow-800 font-medium">채팅이 일시 정지되었습니다.</p>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setChatState((prev) => ({ ...prev, showEmojiPalette: !prev.showEmojiPalette }))}
                className="flex-shrink-0"
              >
                <Smile className="w-4 h-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="메시지를 입력하세요......(500자 제한)"
                  maxLength={500}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {currentMessage.length}/500
                </span>
              </div>

              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Management Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleTogglePause}
                variant="outline"
                className={`flex-1 ${
                  chatState.isPaused
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                }`}
              >
                {chatState.isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    일시 정지 해제
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    전체 채팅 일시 정지
                  </>
                )}
              </Button>
              <Button
                onClick={handleEndChat}
                variant="outline"
                className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
              >
                <Square className="w-4 h-4 mr-2" />
                채팅방 종료
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.variant}
      />
    </>
  )
}
