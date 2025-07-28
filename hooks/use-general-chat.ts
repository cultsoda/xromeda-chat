"use client"

import { useState, useEffect, useRef } from "react"
import type { GeneralChatMessage, ChatState } from "@/types/general-chat"

export function useGeneralChat() {
  const [chatState, setChatState] = useState<ChatState>({
    status: "active",
    participantCount: 332,
    restriction: null,
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
  ])

  const [currentMessage, setCurrentMessage] = useState("")
  const [showEmojiPalette, setShowEmojiPalette] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // 제재 상황 시뮬레이션을 위한 상태
  const [restrictionDemo, setRestrictionDemo] = useState<"none" | "cooldown" | "blocked" | "paused">("none")

  // 이모지 반응 관련 상태 추가
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  const resetChatHistory = () => {
    setMessages([])
  }

  useEffect(() => {
    // 참여자 수 실시간 업데이트
    const participantInterval = setInterval(() => {
      setChatState((prev) => ({
        ...prev,
        participantCount: prev.participantCount + Math.floor(Math.random() * 5) - 2,
      }))
    }, 5000)

    // 제재 상황별 타이머 업데이트
    const restrictionInterval = setInterval(() => {
      setChatState((prev) => {
        if (prev.restriction && prev.restriction.isActive && prev.restriction.remainingTime > 0) {
          return {
            ...prev,
            restriction: {
              ...prev.restriction,
              remainingTime: prev.restriction.remainingTime - 1,
            },
          }
        }
        return prev
      })
    }, 1000)

    return () => {
      clearInterval(participantInterval)
      clearInterval(restrictionInterval)
    }
  }, [])

  // 제재 상황 데모 설정
  useEffect(() => {
    switch (restrictionDemo) {
      case "cooldown":
        setChatState((prev) => ({
          ...prev,
          status: "restricted",
          restriction: {
            type: "cooldown",
            remainingTime: 60,
            isActive: true,
          },
        }))
        break
      case "blocked":
        setChatState((prev) => ({
          ...prev,
          status: "restricted",
          restriction: {
            type: "blocked",
            remainingTime: 2843, // 47분 23초
            reason: "부적절한 언어 사용",
            isActive: true,
          },
        }))
        break
      case "paused":
        setChatState((prev) => ({
          ...prev,
          status: "paused",
          restriction: {
            type: "paused",
            remainingTime: 512, // 8분 32초
            isActive: true,
          },
        }))
        // 시스템 메시지 추가
        setMessages((prev) => [
          ...prev,
          {
            id: `system-${Date.now()}`,
            userId: "system",
            userName: "시스템",
            userAvatar: "",
            content: "크리에이터에 의해 채팅이 일시 정지되었습니다",
            timestamp: new Date(),
            type: "system",
            membershipLevel: "basic",
          },
        ])
        break
      default:
        setChatState((prev) => ({
          ...prev,
          status: "active",
          restriction: null,
        }))
    }
  }, [restrictionDemo])

  const sendMessage = () => {
    if (!currentMessage.trim() || chatState.restriction?.isActive) return

    const newMessage: GeneralChatMessage = {
      id: `msg-${Date.now()}`,
      userId: "current-user",
      userName: "나",
      userAvatar: "/placeholder.svg?height=40&width=40&text=나",
      content: currentMessage,
      timestamp: new Date(),
      type: "user",
      membershipLevel: "basic",
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")
    scrollToBottom()
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`
    } else {
      return `${secs}초`
    }
  }

  // 이모지 반응 추가/제거 함수
  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || {}
          const currentCount = reactions[emoji] || 0
          const hasReacted = msg.userReaction === emoji

          return {
            ...msg,
            reactions: {
              ...reactions,
              [emoji]: hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1,
            },
            userReaction: hasReacted ? undefined : emoji,
          }
        }
        return msg
      }),
    )
    setSelectedMessageId(null)
  }


  return {
    chatState,
    messages,
    currentMessage,
    setCurrentMessage,
    showEmojiPalette,
    setShowEmojiPalette,
    sendMessage,
    scrollRef,
    scrollToBottom,
    formatTime,
    restrictionDemo,
    setRestrictionDemo,
    selectedMessageId,
    setSelectedMessageId,
    addReaction,
    resetChatHistory,
  }
}