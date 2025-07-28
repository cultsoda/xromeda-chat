"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Crown, Volume2, Bell, Megaphone, ChevronUp, X, Minus } from "lucide-react"
import { useChatContext } from "@/context/chat-context"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { useState, useEffect } from "react"
import CreatorOnlyChat from "./creator-only-chat"
import GeneralChat from "./general-chat"

export default function ChannelHomeChatTab() {
  const { setActiveChatRoom, chatUIState, setChatUIState, joinChatRoom, leaveChatRoom } = useChatContext()
  const { participantCounts, latestMessages } = useRealtimeUpdates()
  const [activeTab, setActiveTab] = useState("채팅")
  const [showCreatorChat, setShowCreatorChat] = useState(false)
  const [showGeneralChat, setShowGeneralChat] = useState(false)
  
  // 화면 크기 감지
  const [windowWidth, setWindowWidth] = useState(0)
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const isMobile = windowWidth < 1024

  const handleJoinChat = (chatType: string) => {
    if (isMobile) {
      // 모바일: 채팅 상태 설정하고 바로 풀스크린 열기
      setChatUIState({
        isActive: true,  
        isMinimized: false,
        isMiniBar: false, // 처음에는 풀스크린으로 시작
        currentRoom: chatType,
        joinTime: Date.now(),
      })
      
      // 바로 풀스크린 채팅 열기
      if (chatType === "creator-only") {
        setShowCreatorChat(true)
      } else if (chatType === "live-chat") {
        setShowGeneralChat(true)
      }
    } else {
      // PC: 사이드바 채팅창 활성화
      joinChatRoom(chatType)
    }
  }

  // 탭 변경 핸들러
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const tabs = ["홈", "멤버십", "채팅", "게시판", "소개"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        <div className={`flex ${!isMobile && chatUIState.isActive ? 'gap-6' : 'justify-center'}`}>
          {/* Left Content */}
          <div className={`p-4 space-y-4 transition-all duration-300 ${
            !isMobile && chatUIState.isActive 
              ? 'flex-1 max-w-3xl' 
              : 'w-full max-w-md'
          }`}>
          {/* Creator Profile Header */}
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl text-white font-bold">모</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">모모리나</h1>
            <p className="text-gray-600 text-sm">게임 & 토크 스트리머</p>
          </div>

          {/* Popular Content Section (PC Only when Chat Active) */}
          {!isMobile && chatUIState.isActive && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">🔥 인기 콘텐츠</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <p className="text-sm font-medium">Revenge Room [2]</p>
                      <p className="text-xs text-gray-500">조회수 1.2M</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                    <div className="w-12 h-8 bg-gray-200 rounded"></div>
                    <div>
                      <p className="text-sm font-medium">2nd Anniversary</p>
                      <p className="text-xs text-gray-500">조회수 856K</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcement Section */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-900">📢 공지사항</span>
              </div>
              <p className="text-sm text-blue-800">오늘 오후 8시에 라이브 채팅을 진행할 예정입니다!</p>
            </CardContent>
          </Card>

          {/* Chat Rooms - Always show, but hide on PC when chat is active */}
          {!((!isMobile && chatUIState.isActive)) && (
            <div className="space-y-4">
              {/* Creator Only Chat */}
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-semibold text-gray-900">크리에이터 전용 채팅</h3>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-xs">🔴 LIVE</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">크리에이터의 일상과 소식을 실시간으로 확인하세요</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 italic">"{latestMessages["creator-only"]}"</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="font-medium">{participantCounts["creator-only"]}</span>명이 보고 있음
                    </span>
                  </div>

                  <Button
                    onClick={() => handleJoinChat("creator-only")}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    입장하기
                  </Button>
                </CardContent>
              </Card>

              {/* Live General Chat */}
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <h3 className="font-semibold text-gray-900">모모리나의 라이브 채팅</h3>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">🟢 활성</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">팬들과 함께 자유롭게 대화해보세요</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700">"{latestMessages["live-chat"]}"</p>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="font-medium text-green-600">{participantCounts["live-chat"]}</span>명 참여 중
                    </span>
                  </div>

                  <Button
                    onClick={() => handleJoinChat("live-chat")}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    참여하기
                  </Button>
                </CardContent>
              </Card>

              {/* Waiting Chat */}
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      <h3 className="font-semibold text-gray-700">채팅 대기 중</h3>
                    </div>
                    <Badge className="bg-gray-100 text-gray-600 text-xs">⚪ 대기</Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">크리에이터가 채팅방을 열면 알림을 드릴게요</p>

                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-500">{latestMessages["waiting"]}</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent"
                    onClick={() => alert("채팅이 시작할 때 알림 발송할게요. 그 때까지 기다려주세요")}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    알림받기
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* PC Right Sidebar Chat */}
        {!isMobile && chatUIState.isActive && (
          <div className="w-96 sticky top-16 h-[calc(100vh-4rem)]">
            <SidebarChat 
              roomType={chatUIState.currentRoom || ""}
              isMinimized={chatUIState.isMinimized}
              onMinimize={() => setChatUIState(prev => ({...prev, isMinimized: !prev.isMinimized}))}
              onClose={() => leaveChatRoom()}
            />
          </div>
        )}
      </div>

      {/* Mobile Mini Chat Bar - 채팅이 활성화되어 있으면 항상 표시 */}
      {isMobile && chatUIState.isActive && chatUIState.isMiniBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => {
                // 미니바 클릭 시 풀스크린 채팅 열기
                setChatUIState(prev => ({...prev, isMiniBar: false}))
                if (chatUIState.currentRoom === "creator-only") {
                  setShowCreatorChat(true)
                } else if (chatUIState.currentRoom === "live-chat") {
                  setShowGeneralChat(true)
                }
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">채팅 중 • {participantCounts[chatUIState.currentRoom] || 0}명 참여</span>
                <ChevronUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-600 truncate">
                최신: "{latestMessages[chatUIState.currentRoom] || ""}"
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => leaveChatRoom()} className="ml-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Chat Modals */}
      <CreatorOnlyChat 
        isOpen={showCreatorChat} 
        onClose={() => {
          setShowCreatorChat(false)
          // 풀스크린 채팅 종료 시 미니바로 전환
          if (isMobile && chatUIState.isActive) {
            setChatUIState(prev => ({...prev, isMiniBar: true}))
          }
        }} 
      />
      <GeneralChat 
        isOpen={showGeneralChat} 
        onClose={() => {
          setShowGeneralChat(false)
          // 풀스크린 채팅 종료 시 미니바로 전환
          if (isMobile && chatUIState.isActive) {
            setChatUIState(prev => ({...prev, isMiniBar: true}))
          }
        }} 
      />
    </div>
  )
}

// PC Sidebar Chat Component
function SidebarChat({ roomType, isMinimized, onMinimize, onClose }: {
  roomType: string
  isMinimized: boolean
  onMinimize: () => void
  onClose: () => void
}) {
  return (
    <div className={`h-full bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        {!isMinimized && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-gray-900 text-sm">
              {roomType === "creator-only" ? "크리에이터 전용" : "라이브 채팅"}
            </h3>
          </div>
        )}
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onMinimize} className="h-8 w-8 p-0">
            <Minus className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat Content */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 bg-gray-50">
            <div className="text-center text-gray-500 text-sm">
              <p>채팅이 연결되었습니다</p>
              <p className="text-xs mt-1">새로운 메시지부터 표시됩니다</p>
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
              onClick={() => {/* 채팅 입력 로직 */}}
            >
              채팅 입력하기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}