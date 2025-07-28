"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Users,
  MessageCircle,
  Shield,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Send,
  Settings,
  Download,
  X,
  Crown,
  Square,
  Smile,
} from "lucide-react"
import { useCreatorDashboard } from "@/hooks/use-creator-dashboard"
import CreateChatModal from "./create-chat-modal"
import { useState } from "react"
import CreatorChatManagement from "./creator-chat-management"
import GeneralChatManagement from "./general-chat-management"

export default function CreatorDashboard() {
  const [showCreatorChatManagement, setShowCreatorChatManagement] = useState(false)
  const [showGeneralChatManagement, setShowGeneralChatManagement] = useState(false)
  const {
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
    setIsEditingAnnouncement,
    setChatRooms,
  } = useCreatorDashboard()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const tabs = ["채팅 관리", "게시판 관리"]

  const handleCreateRoom = (data: any) => {
    console.log("Creating room:", data)
    // 실제로는 새 채팅방을 chatRooms 상태에 추가
    const newRoom = {
      id: `room-${Date.now()}`,
      name: data.title,
      type: data.type,
      status: "active" as const,
      participantCount: 0,
      messageCount: 0,
      createdAt: new Date(),
    }
    setChatRooms((prev) => [...prev, newRoom])
  }

  const handleChatManagement = (roomType: string) => {
    const isMobile = window.innerWidth < 1024
    
    // roomType에 따라 적절한 URL 파라미터 설정
    let urlParam = roomType
    if (roomType === 'general') {
      urlParam = 'general-chat'  // 일반 채팅
    } else if (roomType === 'creator-only') {
      urlParam = 'creator-only'  // 크리에이터 전용
    }
    
    console.log('Opening chat management for:', roomType, '-> URL param:', urlParam) // 디버깅용
    
    const url = `/admin/chat-live?room=${urlParam}`

    if (isMobile) {
      // 모바일: 새 탭
      window.open(url, "_blank")
    } else {
      // PC: 새 창
      window.open(url, "_blank", "width=800,height=600,resizable=yes,scrollbars=yes")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">채팅 관리 대시보드</h1>
            <p className="text-gray-600">실시간 채팅 현황을 확인하고 관리하세요</p>
          </div>
        </div>

        {/* --- 통계 카드 영역 주석 처리 --- */}
        {/*
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">오늘의 통계</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전체 참여자</span>
                  <span className="font-semibold">{chatStats.totalParticipants}명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전체 메시지</span>
                  <span className="font-semibold">{chatStats.totalMessages.toLocaleString()}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">활성 채팅방</span>
                  <span className="font-semibold">{chatStats.activeRooms}개</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">인기 키워드 TOP5</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {popularKeywords.map((keyword) => (
                  <div key={keyword.rank} className="flex justify-between items-center">
                    <span className="text-sm">
                      {keyword.rank}. {keyword.keyword}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {keyword.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">자동 차단</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">스팸</span>
                  <span className="font-semibold text-red-600">{autoBlockStats.spam}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">욕설</span>
                  <span className="font-semibold text-red-600">{autoBlockStats.profanity}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">도배</span>
                  <span className="font-semibold text-red-600">{autoBlockStats.flooding}건</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        */}

        {/* Announcement Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              공지사항 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            {announcement || isEditingAnnouncement ? (
              <div className="space-y-3">
                {isEditingAnnouncement ? (
                  <div className="space-y-3">
                    <Textarea
                      value={tempAnnouncement}
                      onChange={(e) => setTempAnnouncement(e.target.value)}
                      placeholder="공지사항을 입력하세요..."
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAnnouncementSave} size="sm">
                        저장
                      </Button>
                      <Button onClick={handleAnnouncementCancel} variant="outline" size="sm">
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-blue-800">{announcement}</p>
                      <div className="flex gap-1 ml-2">
                        <Button onClick={handleAnnouncementEdit} size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button onClick={handleAnnouncementDelete} size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={() => setIsEditingAnnouncement(true)} variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                공지사항 작성
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Chat Room Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              채팅방 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {chatRooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {room.type === "creator-only" && <Crown className="w-4 h-4 text-yellow-500" />}
                    <h3 className="font-semibold">{room.name}</h3>
                    <Badge
                      className={
                        room.status === "active"
                          ? "bg-green-100 text-green-700"
                          : room.status === "paused"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }
                    >
                      {room.status === "active" ? "활성" : room.status === "paused" ? "일시정지" : "종료"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleChatManagement(room.type)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      채팅 관리하기
                    </Button>
                    <Button size="sm" variant="outline">
                      <Square className="w-4 h-4 mr-1" />
                      채팅방 종료
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>참여자: {room.participantCount}명</div>
                  <div>메시지: {room.messageCount}개</div>
                </div>

                {/* --- 크리에이터 전용 채팅 영역 주석 처리 --- */}
                {/*
                {room.type === "creator-only" && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">크리에이터 전용 메시지 입력</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={creatorMessage}
                        onChange={(e) => setCreatorMessage(e.target.value)}
                        placeholder="팬들에게 메시지를 보내세요..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && sendCreatorMessage()}
                      />
                      <Button size="sm" onClick={sendCreatorMessage} disabled={!creatorMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Smile className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                */}
              </div>
            ))}

            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              채팅방 만들기
            </Button>
          </CardContent>
        </Card>

        {/* Settings Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Auto Moderation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">자동 관리 설정</CardTitle>
              <CardDescription className="text-sm text-gray-500 pt-1">
                각 기능을 설정할 수 있는 기능은 추후 제공 예정입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold">스팸 필터</Label>
                <p className="text-sm text-gray-600 mt-1">과도한 홍보, 광고성 메시지를 자동으로 필터링합니다.</p>
              </div>
              <div>
                <Label className="font-semibold">욕설 필터</Label>
                <p className="text-sm text-gray-600 mt-1">부적절한 언어, 욕설을 자동으로 필터링합니다.</p>
              </div>
              <div>
                <Label className="font-semibold">도배 방지</Label>
                <p className="text-sm text-gray-600 mt-1">
                  단시간 내에 동일하거나 유사한 메시지를 반복적으로 보내는 행위를 방지합니다.
                </p>
              </div>
              <div>
                <Label className="font-semibold">슬로우 모드</Label>
                <p className="text-sm text-gray-600 mt-1">
                  채팅 입력 간격을 조절하여 과열된 채팅 분위기를 진정시킬 수 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Banned Words */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">추가 금칙어 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newBannedWord}
                  onChange={(e) => setNewBannedWord(e.target.value)}
                  placeholder="금칙어 추가..."
                  onKeyPress={(e) => e.key === "Enter" && addBannedWord()}
                />
                <Button onClick={addBannedWord} disabled={!newBannedWord.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {bannedWords.map((word) => (
                  <Badge key={word} variant="secondary" className="flex items-center gap-1">
                    {word}
                    <button onClick={() => removeBannedWord(word)} className="ml-1 hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">채팅 로그 다운로드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">채팅방</th>
                    <th className="text-left py-2">날짜</th>
                    <th className="text-left py-2">메시지 수</th>
                    <th className="text-left py-2">참여자 수</th>
                    <th className="text-left py-2">다운로드</th>
                  </tr>
                </thead>
                <tbody>
                  {chatLogs.map((log) => (
                    <tr key={log.id} className="border-b">
                      <td className="py-2">{log.roomName}</td>
                      <td className="py-2">{log.date}</td>
                      <td className="py-2">{log.messageCount.toLocaleString()}개</td>
                      <td className="py-2">{log.participantCount}명</td>
                      <td className="py-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            채팅 기록
                          </Button>
                          {/* --- 제재 기록 버튼 제거 --- */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateRoom={handleCreateRoom}
        existingRooms={{
          hasCreatorOnly: chatRooms.some((room) => room.type === "creator-only"),
          hasActiveGeneral: chatRooms.some((room) => room.type === "general" && room.status === "active"),
        }}
        channelName="모모리나"
      />

      {/* Creator Chat Management Modal */}
      <CreatorChatManagement isOpen={showCreatorChatManagement} onClose={() => setShowCreatorChatManagement(false)} />

      {/* General Chat Management Modal */}
      <GeneralChatManagement isOpen={showGeneralChatManagement} onClose={() => setShowGeneralChatManagement(false)} />
    </div>
  )
}