"use client"

import { useState, useEffect, useRef } from "react"
import type { CreatorMessage } from "@/types/creator-chat"

export function useCreatorChat() {
  const [participantCount, setParticipantCount] = useState(24)
  const [messages, setMessages] = useState<CreatorMessage[]>([
    {
      id: "msg-1",
      content: "안녕하세요! 오늘도 함께해주셔서 감사합니다 ✨",
      timestamp: new Date("2025-07-21T23:00:00"),
      reactions: { "❤": 127, "👍": 204, "🔥": 356 },
    },
    {
      id: "msg-2",
      content: "내일 새로운 컨텐츠로 찾아뵐게요! 기대해주세요 🎮",
      timestamp: new Date("2025-07-21T23:15:00"),
      reactions: { "❤": 89, "🎉": 156, "👏": 234 },
    },
    {
      id: "msg-3",
      content: "좋은 아침입니다! 오늘 하루도 화이팅하세요 💪",
      timestamp: new Date("2025-07-22T10:00:00"),
      reactions: { "❤": 45, "😍": 67, "👍": 123 },
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  const resetChatHistory = () => {
    setMessages([])
  }

  useEffect(() => {
    // 실시간 참여자 수 업데이트
    const participantInterval = setInterval(() => {
      setParticipantCount((prev) => prev + Math.floor(Math.random() * 3) - 1)
    }, 5000)

    // 실시간 이모지 반응 업데이트
    const reactionInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (Math.random() > 0.8) {
              const emojis = Object.keys(msg.reactions)
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
              return {
                ...msg,
                reactions: {
                  ...msg.reactions,
                  [randomEmoji]: msg.reactions[randomEmoji] + 1,
                },
              }
            }
            return msg
          }),
        )
      }
    }, 3000)

    return () => {
      clearInterval(participantInterval)
      clearInterval(reactionInterval)
    }
  }, [])

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const currentCount = msg.reactions[emoji] || 0
          const hasReacted = msg.userReaction === emoji

          return {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: hasReacted ? currentCount - 1 : currentCount + 1,
            },
            userReaction: hasReacted ? undefined : emoji,
          }
        }
        return msg
      }),
    )
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }


  return {
    participantCount,
    messages,
    addReaction,
    scrollRef,
    scrollToBottom,
    resetChatHistory,
  }
}