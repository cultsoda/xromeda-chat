"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Crown, MessageCircle, AlertCircle } from "lucide-react"
import type { ChatRoomCreationData, ExistingChatRooms } from "@/types/chat-creation"

interface CreateChatModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateRoom: (data: ChatRoomCreationData) => void
  existingRooms: ExistingChatRooms
  channelName?: string
}

export default function CreateChatModal({
  isOpen,
  onClose,
  onCreateRoom,
  existingRooms,
  channelName = "모모리나",
}: CreateChatModalProps) {
  const [selectedType, setSelectedType] = useState<"creator-only" | "general">("general")
  const [title, setTitle] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedType(existingRooms.hasCreatorOnly ? "general" : "general")
      setTitle("")
      setIsCreating(false)
    }
  }, [isOpen, existingRooms.hasCreatorOnly])

  const handleCreate = async () => {
    setIsCreating(true)

    const finalTitle = title.trim() || `${channelName}의 라이브 채팅`

    const chatData: ChatRoomCreationData = {
      type: selectedType,
      title: finalTitle,
      description:
        selectedType === "creator-only"
          ? "크리에이터만 메시지 발송 / 팬은 이모지 반응만 가능"
          : "크리에이터와 팬 양방향 소통 / 실시간 텍스트 채팅",
    }

    // 시뮬레이션을 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onCreateRoom(chatData)
    setIsCreating(false)
    onClose()
  }

  const isCreatorOnlyDisabled = existingRooms.hasCreatorOnly
  const isGeneralDisabled = existingRooms.hasActiveGeneral

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">채팅방 만들기</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chat Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">채팅방 유형 선택</Label>

            <RadioGroup
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as "creator-only" | "general")}
              className="space-y-4"
            >
              {/* --- 크리에이터 전용 채팅 카드 주석 처리 --- */}
              {/*
              <div className={`relative ${isCreatorOnlyDisabled ? "opacity-50" : ""}`}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem
                    value="creator-only"
                    id="creator-only"
                    disabled={isCreatorOnlyDisabled}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <Label htmlFor="creator-only" className="font-medium cursor-pointer">
                        크리에이터 전용 채팅
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">크리에이터만 메시지 발송 / 팬은 이모지 반응만 가능</p>
                    <p className="text-xs text-gray-500">상시 운영(수동 종료시까지)</p>
                    {isCreatorOnlyDisabled && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        이미 크리에이터 전용 채팅이 운영 중입니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
              */}

              {/* General Chat */}
              <div className={`relative ${isGeneralDisabled ? "opacity-50" : ""}`}>
                <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="general" id="general" disabled={isGeneralDisabled} className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <Label htmlFor="general" className="font-medium cursor-pointer">
                        일반 채팅
                      </Label>
                    </div>
                    <p className="text-sm text-gray-600">크리에이터와 팬 양방향 소통 / 실시간 텍스트 채팅</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>크리에이터가 직접 열고 닫을 수 있음</p>
                      <p>종료 시 채팅 로그에서 기록 확인 가능</p>
                    </div>
                    {isGeneralDisabled && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        이미 일반 채팅이 진행 중입니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Chat Room Title */}
          <div className="space-y-3">
            <Label htmlFor="chat-title" className="text-base font-medium">
              채팅방 제목
            </Label>
            <div className="space-y-2">
              <Input
                id="chat-title"
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                placeholder={`미 입력시 '${channelName}의 라이브 채팅'으로 만들어집니다`}
                className="w-full"
              />
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{title.trim() ? `제목: "${title}"` : `기본 제목: "${channelName}의 라이브 채팅"`}</span>
                <span>({title.length}/50)</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-gray-700">미리보기</h4>
            <div className="flex items-center gap-2">
              {selectedType === "creator-only" ? (
                <Crown className="w-4 h-4 text-yellow-500" />
              ) : (
                <MessageCircle className="w-4 h-4 text-green-500" />
              )}
              <span className="font-medium">{title.trim() || `${channelName}의 라이브 채팅`}</span>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                {selectedType === "creator-only" ? "크리에이터 전용" : "일반 채팅"}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {selectedType === "creator-only"
                ? "크리에이터만 메시지 발송 / 팬은 이모지 반응만 가능"
                : "크리에이터와 팬 양방향 소통 / 실시간 텍스트 채팅"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={isCreating}>
              취소
            </Button>
            <Button
              onClick={handleCreate}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={
                isCreating ||
                (isCreatorOnlyDisabled && selectedType === "creator-only") ||
                (isGeneralDisabled && selectedType === "general")
              }
            >
              {isCreating ? "만드는 중..." : "만들기"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}