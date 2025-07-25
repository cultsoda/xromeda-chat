"use client"

import { ChatProvider } from "@/context/chat-context"
import { useState } from "react"
import ChannelHomeChatTab from "@/components/channel-home-chat"
import CreatorDashboard from "@/components/creator-dashboard"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentView, setCurrentView] = useState<"fan" | "creator">("fan")

  return (
    <ChatProvider>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={() => setCurrentView("fan")} variant={currentView === "fan" ? "default" : "outline"} size="sm">
          팬 뷰
        </Button>
        <Button
          onClick={() => setCurrentView("creator")}
          variant={currentView === "creator" ? "default" : "outline"}
          size="sm"
        >
          크리에이터 뷰
        </Button>
      </div>

      {currentView === "fan" ? <ChannelHomeChatTab /> : <CreatorDashboard />}
    </ChatProvider>
  )
}
