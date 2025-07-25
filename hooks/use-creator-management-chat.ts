"use client"

import { useState, useEffect, useRef } from "react"
import type { CreatorManagementMessage, ChatManagementState } from "@/types/creator-management-chat"

export function useCreatorManagementChat() {
  const [chatState, setChatState] = useState<ChatManagementState>({
    isPaused: false,
    participantCount: 332,
    selectedMessageId: null,
    showManagementMenu: false,
    showEmojiPalette: false,
  })

  const [messages, setMessages] = useState<CreatorManagementMessage[]>([
    {
      id: "msg-1",
      userId: "creator-1",
      userName: "모모리나",
      userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
      content: "다음 주 금요일에 새 콘텐츠를 공개할거에요. :)",
      timestamp: new Date("2025-07-22T00:01:00"),
      type: "creator",
      membershipLevel: "vip",
      reactions: { "😍": 89, "❤": 156, "👏": 204 },
    },
    {
      id: "msg-2",
      userId: "fan-1",
      userName: "케인",
      userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
      content: "어떤 콘텐츠에요?",
      timestamp: new Date("2025-07-22T00:03:00"),
      type: "fan",
      membershipLevel: "basic",
    },
    {
      id: "msg-3",
      userId: "fan-2",
      userName: "블레이크",
      userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
      content: "아니 그걸 알려줘야지. *****",
      originalContent: "아니 그걸 알려줘야지. 진짜로",
      timestamp: new Date("2025-07-22T00:05:00"),
      type: "fan",
      membershipLevel: "premium",
      isFiltered: true,
    },
    {
      id: "msg-4",
      userId: "fan-3",
      userName: "팬123",
      userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
      content: "기대됩니다! 🎉",
      timestamp: new Date("2025-07-22T00:07:00"),
      type: "fan",
      membershipLevel: "basic",
    },
  ])

  const [currentMessage, setCurrentMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // 실시간 참여자 수 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setChatState((prev) => ({
        ...prev,
        participantCount: prev.participantCount + Math.floor(Math.random() * 5) - 2,
      }))
    }, 5000)

    // 새 메시지 시뮬레이션
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newMessages = [
          "와 정말 기대돼요!",
          "언제 공개되나요?",
          "항상 응원합니다 💪",
          "새 콘텐츠 궁금해요",
          "화이팅! 👍",
        ]
        const randomMessage = newMessages[Math.floor(Math.random() * newMessages.length)]

        const newMessage: CreatorManagementMessage = {
          id: `msg-${Date.now()}`,
          userId: `fan-${Date.now()}`,
          userName: `팬${Math.floor(Math.random() * 1000)}`,
          userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
          content: randomMessage,
          timestamp: new Date(),
          type: "fan",
          membershipLevel: Math.random() > 0.7 ? "premium" : "basic",
        }

        setMessages((prev) => [...prev, newMessage])
      }
    }, 8000)

    return () => {
      clearInterval(interval)
      clearInterval(messageInterval)
    }
  }, [])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const sendMessage = () => {
    if (!currentMessage.trim() || chatState.isPaused) return

    const newMessage: CreatorManagementMessage = {
      id: `msg-${Date.now()}`,
      userId: "creator-1",
      userName: "모모리나",
      userAvatar: "/placeholder.svg?height=40&width=40&text=썸",
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
    setChatState((prev) => ({ ...prev, selectedMessageId: null, showManagementMenu: false }))
  }

  const blockUser = (userId: string, userName: string) => {
    // 해당 사용자의 메시지들을 숨김 처리
    setMessages((prev) =>
      prev.map((msg) =>
        msg.userId === userId ? { ...msg, content: "[차단된 사용자의 메시지]", isFiltered: true } : msg,
      ),
    )
    setChatState((prev) => ({ ...prev, selectedMessageId: null, showManagementMenu: false }))
  }

  const togglePause = () => {
    setChatState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
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
      showManagementMenu: prev.selectedMessageId !== messageId,
      showEmojiPalette: false,
    }))
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

  const groupMessagesByDate = (messages: CreatorManagementMessage[]) => {
    const groups: { [key: string]: CreatorManagementMessage[] } = {}

    messages.forEach((message) => {
      const dateKey = formatDate(message.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return groups
  }

  return {
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
    formatDate,
    groupMessagesByDate,
    scrollToBottom,
  }
}
