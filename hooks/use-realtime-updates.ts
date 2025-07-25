"use client"

import { useState, useEffect } from "react"

export function useRealtimeUpdates() {
  const [participantCounts, setParticipantCounts] = useState({
    "creator-only": 24,
    "live-chat": 324,
    waiting: 0,
  })

  const [latestMessages, setLatestMessages] = useState({
    "creator-only": "안녕하세요! 오늘도 좋은 하루 보내세요 ✨",
    "live-chat": "ㅋㅋㅋ 진짜 재밌다",
    waiting: "마지막 활동: 2시간 전",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setParticipantCounts((prev) => ({
        "creator-only": prev["creator-only"] + Math.floor(Math.random() * 3) - 1,
        "live-chat": prev["live-chat"] + Math.floor(Math.random() * 5) - 2,
        waiting: 0,
      }))

      // 가끔 새로운 메시지 시뮬레이션
      if (Math.random() > 0.7) {
        const messages = [
          "오늘 방송 언제 시작하나요?",
          "ㅋㅋㅋㅋ",
          "안녕하세요!",
          "재밌어요 👍",
          "다음 컨텐츠 기대됩니다",
        ]
        setLatestMessages((prev) => ({
          ...prev,
          "live-chat": messages[Math.floor(Math.random() * messages.length)],
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return { participantCounts, latestMessages }
}
