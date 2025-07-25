"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MessageCircle, Crown, Volume2, Bell, Megaphone } from "lucide-react"
import { useChatContext } from "@/context/chat-context"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { useState } from "react"
import CreatorOnlyChat from "./creator-only-chat"
import GeneralChat from "./general-chat"

export default function ChannelHomeChatTab() {
  const { setActiveChatRoom } = useChatContext()
  const { participantCounts, latestMessages } = useRealtimeUpdates()
  const [activeTab, setActiveTab] = useState("채팅")
  const [showCreatorChat, setShowCreatorChat] = useState(false)
  const [showGeneralChat, setShowGeneralChat] = useState(false)

  const handleJoinChat = (chatType: string) => {
    if (chatType === "creator-only") {
      setShowCreatorChat(true)
    } else if (chatType === "live-chat") {
      setShowGeneralChat(true)
    } else {
      console.log(`Joining ${chatType} chat`)
    }
  }

  const tabs = ["홈", "멤버십", "채팅", "게시판", "소개"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Creator Profile Header */}
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xl text-white font-bold">모</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">모모리나</h1>
          <p className="text-gray-600 text-sm">게임 & 토크 스트리머</p>
        </div>

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

        {/* Chat Rooms */}
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

        {/* Quick Stats */}
        {/*}
        <Card className="border-0 shadow-md bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">실시간 채팅 현황</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold">{participantCounts["live-chat"]}</div>
                <div className="opacity-90 text-xs">활성 사용자</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">15.4K</div>
                <div className="opacity-90 text-xs">총 메시지</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold">{participantCounts["creator-only"]}</div>
                <div className="opacity-90 text-xs">라이브 시청</div>
              </div>
            </div>
          </CardContent>
        </Card>
        */}
      </div>
      {/* Creator Only Chat Modal */}
      <CreatorOnlyChat isOpen={showCreatorChat} onClose={() => setShowCreatorChat(false)} />
      {/* General Chat Modal */}
      <GeneralChat isOpen={showGeneralChat} onClose={() => setShowGeneralChat(false)} />
    </div>
  )
}
