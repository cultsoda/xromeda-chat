"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Crown, Volume2, Bell, Megaphone, ChevronUp, X, Minus, Clock } from "lucide-react"
import { useChatContext } from "@/context/chat-context"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { useState, useEffect } from "react"
import CreatorOnlyChat from "./creator-only-chat"
import GeneralChat from "./general-chat"
import ConfirmationModal from "./confirmation-modal"

export default function ChannelHomeChatTab() {
  const { setActiveChatRoom, chatUIState, setChatUIState, joinChatRoom, leaveChatRoom } = useChatContext()
  const { participantCounts, latestMessages } = useRealtimeUpdates()
  const [activeTab, setActiveTab] = useState("채팅")
  const [showCreatorChat, setShowCreatorChat] = useState(false)
  const [showGeneralChat, setShowGeneralChat] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  
  // 화면 크기 감지
  const [windowWidth, setWindowWidth] = useState(0)
  
  // 방송 시작 시간 (실제로는 서버에서 받아와야 함)
  const [broadcastStartTime] = useState(new Date(Date.now() - 6 * 60 * 60 * 1000)) // 6시간 전
  const [creatorChatStartTime] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000)) // 2시간 전
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const isMobile = windowWidth < 1024

  // 시간 경과 계산 함수
  const getTimeElapsed = (startTime: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전 시작`
    } else {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours}시간 전 시작`
    }
  }

  const handleJoinChat = (chatType: string) => {
    if (isMobile) {
      // 모바일: 풀스크린 채팅으로 바로 이동
      setChatUIState({
        isActive: true,  
        isMinimized: false,
        isMiniBar: false,
        currentRoom: chatType,
        joinTime: Date.now(),
      })
      
      if (chatType === "creator-only") {
        setShowCreatorChat(true)
      } else if (chatType === "live-chat") {
        setShowGeneralChat(true)
      }
    } else {
      // PC: 2분할 화면으로 채팅 활성화
      joinChatRoom(chatType)
    }
  }

  // 모바일 채팅 종료 핸들러 (X 버튼)
  const handleMobileChatClose = () => {
    setShowCreatorChat(false)
    setShowGeneralChat(false)
    // 풀스크린 종료 → 최소화로 전환
    setChatUIState(prev => ({...prev, isMiniBar: true}))
  }

  // 최소화 상태에서 나가기 핸들러
  const handleMiniBarExit = () => {
    setShowExitConfirm(true)
  }

  // 컨펌 후 나가기
  const handleConfirmExit = () => {
    leaveChatRoom()
    setShowExitConfirm(false)
  }

  // 최소화 영역 클릭으로 풀스크린 복귀
  const handleMiniBarExpand = () => {
    setChatUIState(prev => ({...prev, isMiniBar: false}))
    if (chatUIState.currentRoom === "creator-only") {
      setShowCreatorChat(true)
    } else if (chatUIState.currentRoom === "live-chat") {
      setShowGeneralChat(true)
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

            {/* Popular Content Section - 삭제됨 */}

            {/* Announcement Section - 2분할시 맨 위로 */}
            {(!isMobile && chatUIState.isActive) && (
              <Card className="border-l-4 border-l-blue-500 bg-blue-50 mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">📢 공지사항</span>
                  </div>
                  <p className="text-sm text-blue-800">오늘 오후 8시에 라이브 채팅을 진행할 예정입니다!</p>
                </CardContent>
              </Card>
            )}

            {/* 2분할시 라이브 채팅 카드만 표시 */}
            {(!isMobile && chatUIState.isActive) && (
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
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="font-medium text-green-600">{participantCounts["live-chat"]}</span>명 참여 중
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeElapsed(broadcastStartTime)}
                      </span>
                    </div>
                  </div>

                  <div className="text-center text-gray-500 text-sm">
                    <p>우측 채팅창에서 실시간으로 대화하세요</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Announcement Section - 일반 상태 */}
            {!(!isMobile && chatUIState.isActive) && (
              <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">📢 공지사항</span>
                  </div>
                  <p className="text-sm text-blue-800">오늘 오후 8시에 라이브 채팅을 진행할 예정입니다!</p>
                </CardContent>
              </Card>
            )}

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
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="font-medium">{participantCounts["creator-only"]}</span>명이 보고 있음
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeElapsed(creatorChatStartTime)}
                        </span>
                      </div>
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
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span className="font-medium text-green-600">{participantCounts["live-chat"]}</span>명 참여 중
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeElapsed(broadcastStartTime)}
                        </span>
                      </div>
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
          {!isMobile && chatUIState.isActive && !chatUIState.isMinimized && (
            <div className="w-96 sticky top-16 h-[calc(100vh-4rem)]">
              <SidebarChat 
                roomType={chatUIState.currentRoom || ""}
                onClose={() => {
                  // PC에서 끄기 누르면 2분할 복구하고 최소화로 전환
                  setChatUIState(prev => ({...prev, isMinimized: true}))
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* PC Minimized Chat (우하단) */}
      {!isMobile && chatUIState.isActive && chatUIState.isMinimized && (
        <div className="fixed bottom-4 right-4 z-50">
          <PCMinimizedChat
            roomType={chatUIState.currentRoom || ""}
            participantCount={participantCounts[chatUIState.currentRoom] || 0}
            latestMessage={latestMessages[chatUIState.currentRoom] || ""}
            onExpand={() => setChatUIState(prev => ({...prev, isMinimized: false}))}
            onClose={() => setShowExitConfirm(true)}
          />
        </div>
      )}

      {/* Mobile Mini Chat Bar - 채팅이 활성화되어 있으면 항상 표시 */}
      {isMobile && chatUIState.isActive && chatUIState.isMiniBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between">
            <div 
              className="flex-1 cursor-pointer" 
              onClick={handleMiniBarExpand}
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
            <Button size="sm" variant="ghost" onClick={handleMiniBarExit} className="ml-2">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Chat Modals */}
      <CreatorOnlyChat 
        isOpen={showCreatorChat} 
        onClose={handleMobileChatClose}
      />
      <GeneralChat 
        isOpen={showGeneralChat} 
        onClose={handleMobileChatClose}
      />

      {/* Exit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={handleConfirmExit}
        title="채팅 나가기"
        message="채팅을 나가시겠어요? 이전 대화를 다시 보실 수 없어요."
        confirmText="나가기"
        confirmVariant="destructive"
      />
    </div>
  )
}

// PC Sidebar Chat Component
function SidebarChat({ roomType, onClose }: {
  roomType: string
  onClose: () => void
}) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [restrictionDemo, setRestrictionDemo] = useState<"none" | "cooldown" | "blocked" | "paused">("none")
  const [messages] = useState([
    {
      id: "1",
      userName: "모모리나",
      userType: "creator",
      membershipLevel: "크리에이터",
      content: "안녕하세요! 오늘도 함께해주셔서 감사합니다 ✨",
      timestamp: "오후 10:29",
      reactions: { "❤": 45, "👍": 23, "🔥": 67 }
    },
    {
      id: "2", 
      userName: "게임러버123",
      userType: "user",
      membershipLevel: "기본멤버십",
      content: "안녕하세요! 오늘 방송 재밌어요",
      timestamp: "오후 10:30",
      reactions: { "👍": 12, "😊": 8 }
    },
    {
      id: "3",
      userName: "후원왕", 
      userType: "user",
      membershipLevel: "후원멤버십",
      content: "오늘도 화이팅하세요! 응원합니다 💪",
      timestamp: "오후 10:31", 
      reactions: { "💪": 34, "❤": 19, "👏": 15 }
    },
    {
      id: "4",
      userName: "익명팬",
      userType: "user", 
      membershipLevel: "기본멤버십",
      content: "이 ***** 정말 재밌네요! (필터링됨)",
      timestamp: "오후 10:32",
      reactions: { "😂": 5, "👍": 3 }
    }
  ])

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return
    // 실제로는 메시지 전송 로직 구현
    console.log("Sending message:", currentMessage)
    setCurrentMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const isInputDisabled = () => {
    return restrictionDemo === "cooldown" || restrictionDemo === "blocked" || restrictionDemo === "paused"
  }

  const getPlaceholderText = () => {
    switch (restrictionDemo) {
      case "cooldown":
        return "1분 쿨타임 중입니다 (45초 남음)"
      case "blocked":
        return "1시간 차단됨 - 부적절한 언어 사용"
      case "paused":
        return "전체 채팅이 일시정지되었습니다"
      default:
        return "메시지를 입력하세요......(500자 제한)"
    }
  }

  return (
    <div className="h-full bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold text-gray-900 text-sm">모모리나의 라이브 채팅</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 text-xs">🟢 활성</Badge>
          <span className="text-xs text-gray-500">👥 317명</span>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Demo Controls - PC 버전 */}
      <div className="bg-gray-100 p-2 flex gap-2 text-xs border-b">
        <Button
          size="sm"
          variant={restrictionDemo === "none" ? "default" : "outline"}
          onClick={() => setRestrictionDemo("none")}
          className="h-6 text-xs px-2"
        >
          정상
        </Button>
        <Button
          size="sm"
          variant={restrictionDemo === "cooldown" ? "default" : "outline"}
          onClick={() => setRestrictionDemo("cooldown")}
          className="h-6 text-xs px-2"
        >
          쿨타임
        </Button>
        <Button
          size="sm"
          variant={restrictionDemo === "blocked" ? "default" : "outline"}
          onClick={() => setRestrictionDemo("blocked")}
          className="h-6 text-xs px-2"
        >
          차단
        </Button>
        <Button
          size="sm"
          variant={restrictionDemo === "paused" ? "default" : "outline"}
          onClick={() => setRestrictionDemo("paused")}
          className="h-6 text-xs px-2"
        >
          일시정지
        </Button>
      </div>

      {/* Restriction Warning */}
      {restrictionDemo !== "none" && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          {restrictionDemo === "cooldown" && (
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-sm font-medium">
                ⚠️ 1분 쿨타임이 적용되었습니다. (45초 남음)
              </span>
            </div>
          )}
          {restrictionDemo === "blocked" && (
            <div className="text-red-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">🚫 채팅이 제한되었습니다</span>
              </div>
              <div className="text-sm space-y-1">
                <p>1시간 차단 - 남은 시간: 47분 23초</p>
                <p>사유: 부적절한 언어 사용</p>
                <p>문의사항이 있으시면 고객센터로 연락해주세요</p>
              </div>
            </div>
          )}
          {restrictionDemo === "paused" && (
            <div className="flex items-center gap-2 text-yellow-700">
              <span className="text-sm font-medium">
                🟡 전체 채팅 일시정지 - 남은 시간: 8분 32초
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                message.userType === "creator" 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500" 
                  : "bg-gray-400"
              }`}>
                {message.userName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${
                    message.userType === "creator" ? "text-purple-700" : "text-gray-900"
                  }`}>
                    {message.userName}
                  </span>
                  <Badge className={`text-xs ${
                    message.userType === "creator" 
                      ? "bg-purple-100 text-purple-700"
                      : message.membershipLevel === "후원멤버십"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                  }`}>
                    {message.membershipLevel}
                  </Badge>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>

                {/* Message Content */}
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <p className="text-sm text-gray-900">{message.content}</p>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {Object.entries(message.reactions).map(([emoji, count]) => (
                    <button
                      key={emoji}
                      className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <span>{emoji}</span>
                      <span className="font-medium">{count}</span>
                    </button>
                  ))}
                  <button className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    <span className="text-xs">😊</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getPlaceholderText()}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isInputDisabled() 
                  ? "border-red-300 bg-red-50 text-red-500 placeholder-red-400 cursor-not-allowed" 
                  : "border-gray-300"
              }`}
              maxLength={500}
              disabled={isInputDisabled()}
            />
            {!isInputDisabled() && (
              <span className="absolute right-3 top-2 text-xs text-gray-400">
                {currentMessage.length}/500
              </span>
            )}
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isInputDisabled()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  )
}

// PC Minimized Chat Component (우하단)
function PCMinimizedChat({ roomType, participantCount, latestMessage, onExpand, onClose }: {
  roomType: string
  participantCount: number
  latestMessage: string
  onExpand: () => void
  onClose: () => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-80 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">
            {roomType === "creator-only" ? "크리에이터 전용" : "라이브 채팅"}
          </span>
          <span className="text-xs text-gray-500">{participantCount}명</span>
        </div>
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onExpand} 
            className="h-6 w-6 p-0"
            title="채팅창 복구"
          >
            <ChevronUp className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onClose} 
            className="h-6 w-6 p-0"
            title="채팅 나가기"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      <div className="cursor-pointer" onClick={onExpand}>
        <p className="text-xs text-gray-600 truncate">
          최신: "{latestMessage}"
        </p>
      </div>
    </div>
  )
}