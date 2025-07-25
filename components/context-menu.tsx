"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Ban } from "lucide-react"
import type { ContextMenuPosition } from "@/types/creator-management"

interface ContextMenuProps {
  position: ContextMenuPosition | null
  onClose: () => void
  onDelete: (messageId: string) => void
  onBlock: (userId: string, userName: string) => void
}

export default function ContextMenu({ position, onClose, onDelete, onBlock }: ContextMenuProps) {
  if (!position) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Context Menu */}
      <Card
        className="fixed z-50 border-0 shadow-lg"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -100%)",
        }}
      >
        <CardContent className="p-2 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(position.messageId)
              onClose()
            }}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            메시지 삭제
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onBlock(position.userId, position.userName)
              onClose()
            }}
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Ban className="w-4 h-4 mr-2" />
            사용자 차단 (1시간)
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
