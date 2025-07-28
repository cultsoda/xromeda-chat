"use client"

import { useState, useEffect } from "react"
import type {
  ChatStats,
  PopularKeyword,
  AutoBlockStats,
  ChatRoom,
  AutoModerationSettings,
  ChatLog,
} from "@/types/creator-dashboard"

export function useCreatorDashboard() {
  const [activeTab, setActiveTab] = useState("채팅 관리")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreatorChatManagement, setShowCreatorChatManagement] = useState(false)
  const [showGeneralChatManagement, setShowGeneralChatManagement] = useState(false)

  const [chatStats, setChatStats] = useState<ChatStats>({
    totalParticipants: 348,
    totalMessages: 1247,
    activeRooms: 2,
    blockedUsers: 23,
  })

  const [popularKeywords] = useState<PopularKeyword[]>([
    { rank: 1, keyword: "VR", count: 156 },
    { rank: 2, keyword: "VROOK", count: 134 },
    { rank: 3, keyword: "콘텐츠", count: 98 },
    { rank: 4, keyword: "9월", count: 87 },
    { rank: 5, keyword: "엑스로메다", count: 76 },
  ])

  const [autoBlockStats, setAutoBlockStats] = useState<AutoBlockStats>({
    spam: 12,
    profanity: 3,
    flooding: 7,
  })

  const [announcement, setAnnouncement] = useState("오늘 오후 8시에 라이브 채팅을 진행할 예정입니다!")
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false)
  const [tempAnnouncement, setTempAnnouncement] = useState("")

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "room-1",
      name: "크리에이터 전용 채팅",
      type: "creator-only",
      status: "active",
      participantCount: 24,
      messageCount: 156,
      createdAt: new Date(),
    },
    {
      id: "room-2",
      name: "모모리나의 라이브 채팅",
      type: "general",
      status: "active",
      participantCount: 324,
      messageCount: 1091,
      createdAt: new Date(),
    },
  ])

  const [creatorMessage, setCreatorMessage] = useState("")

  const [autoModerationSettings, setAutoModerationSettings] = useState<AutoModerationSettings>({
    enableSpamFilter: true,
    enableProfanityFilter: true,
    enableFloodProtection: true,
    slowModeEnabled: false,
    slowModeSeconds: 30,
  })

  const [bannedWords, setBannedWords] = useState<string[]>(["스팸", "광고", "홍보", "도배", "욕설"])

  const [newBannedWord, setNewBannedWord] = useState("")

  const [chatLogs] = useState<ChatLog[]>([
    {
      id: "log-1",
      roomName: "모모리나의 라이브 채팅",
      date: "2025-07-25",
      messageCount: 1247,
      participantCount: 348,
      downloadUrl: "#",
    },
    {
      id: "log-2",
      roomName: "크리에이터 전용 채팅",
      date: "2025-07-25",
      messageCount: 156,
      participantCount: 24,
      downloadUrl: "#",
    },
    {
      id: "log-3",
      roomName: "모모리나의 라이브 채팅",
      date: "2025-07-24",
      messageCount: 892,
      participantCount: 267,
      downloadUrl: "#",
    },
  ])

  // 실시간 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setChatStats((prev) => ({
        ...prev,
        totalParticipants: prev.totalParticipants + Math.floor(Math.random() * 5) - 2,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 10),
      }))

      setAutoBlockStats((prev) => ({
        ...prev,
        spam: prev.spam + (Math.random() > 0.9 ? 1 : 0),
        profanity: prev.profanity + (Math.random() > 0.95 ? 1 : 0),
        flooding: prev.flooding + (Math.random() > 0.92 ? 1 : 0),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleAnnouncementEdit = () => {
    setTempAnnouncement(announcement)
    setIsEditingAnnouncement(true)
  }

  const handleAnnouncementSave = () => {
    setAnnouncement(tempAnnouncement)
    setIsEditingAnnouncement(false)
  }

  const handleAnnouncementCancel = () => {
    setTempAnnouncement("")
    setIsEditingAnnouncement(false)
  }

  const handleAnnouncementDelete = () => {
    setAnnouncement("")
    setIsEditingAnnouncement(false)
  }

  const sendCreatorMessage = () => {
    if (!creatorMessage.trim()) return

    // 실제로는 채팅방에 메시지 전송
    console.log("Sending creator message:", creatorMessage)
    setCreatorMessage("")
  }

  const addBannedWord = () => {
    if (!newBannedWord.trim() || bannedWords.includes(newBannedWord.trim())) return

    setBannedWords((prev) => [...prev, newBannedWord.trim()])
    setNewBannedWord("")
  }

  const removeBannedWord = (word: string) => {
    setBannedWords((prev) => prev.filter((w) => w !== word))
  }

  const updateAutoModeration = (key: keyof AutoModerationSettings, value: boolean | number) => {
    setAutoModerationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCreateRoom = (data: any) => {
    console.log("Creating room:", data)
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name: data.title,
      type: data.type,
      status: "active",
      participantCount: 0,
      messageCount: 0,
      createdAt: new Date(),
    }
    setChatRooms((prev) => [...prev, newRoom])
  }

  return {
    activeTab,
    setActiveTab,
    chatStats,
    popularKeywords,
    autoBlockStats,
    announcement,
    isEditingAnnouncement,
    tempAnnouncement,
    setTempAnnouncement,
    handleAnnouncementEdit,
    handleAnnouncementSave,
    handleAnnouncementCancel,
    handleAnnouncementDelete,
    chatRooms,
    creatorMessage,
    setCreatorMessage,
    sendCreatorMessage,
    autoModerationSettings,
    updateAutoModeration,
    bannedWords,
    newBannedWord,
    setNewBannedWord,
    addBannedWord,
    removeBannedWord,
    chatLogs,
    showCreateModal,
    setShowCreateModal,
    showCreatorChatManagement,
    setShowCreatorChatManagement,
    showGeneralChatManagement,
    setShowGeneralChatManagement,
    handleCreateRoom,
    setIsEditingAnnouncement,
    setChatRooms,
  }
}
