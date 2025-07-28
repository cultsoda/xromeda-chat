"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { ChatRoom, ChatMessage, User, ChatStats } from "@/types/chat"

interface ChatContextType {
  currentUser: User
  chatRooms: ChatRoom[]
  activeChatRoom: ChatRoom | null
  chatStats: ChatStats
  setActiveChatRoom: (room: ChatRoom | null) => void
  sendMessage: (roomId: string, content: string, type?: "text" | "emoji") => void
  deleteMessage: (roomId: string, messageId: string) => void
  blockUser: (userId: string) => void
  createChatRoom: (name: string, type: "creator-only" | "general") => void
  endChatRoom: (roomId: string) => void
  chatUIState: {
    isActive: boolean
    isMinimized: boolean
    isMiniBar: boolean
    currentRoom: string | null
    joinTime: number | null
  }
  setChatUIState: (state: any) => void
  joinChatRoom: (roomId: string) => void
  leaveChatRoom: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentUser] = useState<User>({
    id: "user-1",
    name: "Alex Kim",
    avatar: "/placeholder.svg?height=40&width=40&text=AK",
    role: "creator",
  })

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: "room-1",
      name: "🎮 게임 토크",
      type: "general",
      status: "active",
      creatorId: "user-1",
      participantCount: 1247,
      messages: [],
      settings: {
        allowEmojis: true,
        autoModeration: true,
        slowMode: 0,
      },
    },
    {
      id: "room-2",
      name: "📢 공지사항",
      type: "creator-only",
      status: "waiting",
      creatorId: "user-1",
      participantCount: 892,
      messages: [],
      settings: {
        allowEmojis: true,
        autoModeration: false,
        slowMode: 0,
      },
    },
  ])

  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null)
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalMessages: 15420,
    activeUsers: 1247,
    blockedUsers: 23,
    deletedMessages: 156,
  })

  const [chatUIState, setChatUIState] = useState({
    isActive: false,
    isMinimized: false,
    isMiniBar: false,
    currentRoom: null,
    joinTime: null,
  })

  const joinChatRoom = (roomId: string) => {
    setChatUIState({
      isActive: true,
      isMinimized: false,
      isMiniBar: false,
      currentRoom: roomId,
      joinTime: Date.now(),
    })
  }

  const leaveChatRoom = () => {
    setChatUIState({
      isActive: false,
      isMinimized: false,
      isMiniBar: false,
      currentRoom: null,
      joinTime: null,
    })
  }

  const sendMessage = (roomId: string, content: string, type: "text" | "emoji" = "text") => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date(),
      type,
    }

    setChatRooms((prev) =>
      prev.map((room) => (room.id === roomId ? { ...room, messages: [...room.messages, newMessage] } : room)),
    )

    setChatStats((prev) => ({ ...prev, totalMessages: prev.totalMessages + 1 }))
  }

  const deleteMessage = (roomId: string, messageId: string) => {
    setChatRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              messages: room.messages.map((msg) => (msg.id === messageId ? { ...msg, isDeleted: true } : msg)),
            }
          : room,
      ),
    )

    setChatStats((prev) => ({ ...prev, deletedMessages: prev.deletedMessages + 1 }))
  }

  const blockUser = (userId: string) => {
    setChatStats((prev) => ({ ...prev, blockedUsers: prev.blockedUsers + 1 }))
  }

  const createChatRoom = (name: string, type: "creator-only" | "general") => {
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name,
      type,
      status: "waiting",
      creatorId: currentUser.id,
      participantCount: 0,
      messages: [],
      settings: {
        allowEmojis: true,
        autoModeration: true,
        slowMode: 0,
      },
    }

    setChatRooms((prev) => [...prev, newRoom])
  }

  const endChatRoom = (roomId: string) => {
    setChatRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, status: "ended" as const } : room)))
  }

  return (
    <ChatContext.Provider
      value={{
        currentUser,
        chatRooms,
        activeChatRoom,
        chatStats,
        setActiveChatRoom,
        sendMessage,
        deleteMessage,
        blockUser,
        createChatRoom,
        endChatRoom,
        chatUIState,
        setChatUIState,
        joinChatRoom,
        leaveChatRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}