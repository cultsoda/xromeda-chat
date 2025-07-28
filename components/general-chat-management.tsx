"use client"

import CreatorManagementChat from "./creator-management-chat"

interface GeneralChatManagementProps {
  isOpen: boolean
  onClose: () => void
  isFullPage?: boolean
}

export default function GeneralChatManagement({ 
  isOpen, 
  onClose,
  isFullPage = false 
}: GeneralChatManagementProps) {
  // 임시로 구분하기 위해 props를 수정해서 전달
  // 실제로는 별도의 컴포넌트를 만들어야 하지만, 우선 구분이 되는지 확인용
  
  if (!isOpen && !isFullPage) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-lg flex flex-col">
        {/* 임시 헤더 - 구분용 */}
        <div className="bg-green-100 border-b border-green-200 p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 className="text-lg font-semibold text-green-900">🔥 일반 채팅 관리 (팬들과 소통)</h1>
          </div>
          <button 
            onClick={onClose}
            className="text-green-600 hover:text-green-800 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        {/* 임시 내용 */}
        <div className="flex-1 p-6 flex items-center justify-center bg-green-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">일반 채팅 관리</h2>
            <p className="text-green-600 mb-4">
              여기서는 팬들과의 양방향 소통을 관리할 수 있습니다.
            </p>
            <p className="text-sm text-green-500">
              • 팬 메시지 삭제<br/>
              • 사용자 차단<br/>
              • 채팅 일시정지<br/>
              • 이모지 반응 관리
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}