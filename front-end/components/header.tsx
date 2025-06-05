"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useVoice } from "@/components/context/voiceContext"
import { VoiceButton } from "@/components/ui/voicebutton"
import { toast } from "sonner"

export function Header() {
  const { settings, toggleMute, speak, isSupported } = useVoice()
  const [lastMessage, setLastMessage] = useState<string>("")

  const handleVoiceResult = (text: string) => {
    setLastMessage(text)
    // Here you can add logic to process the voice command
    toast.info(`Comando recebido: ${text}`)
  }

  return (
    <header className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500 text-green-400">
            Online
          </Badge>
          <span className="text-sm text-muted-foreground">
            {lastMessage ? `Último comando: ${lastMessage}` : "Sexta-feira está pronta para ajudar"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isSupported && (
          <>
            <VoiceButton onResult={handleVoiceResult} className="relative" />
            <Button
              variant={settings.muted ? "outline" : "default"}
              size="sm"
              onClick={toggleMute}
              className={!settings.muted ? "bg-green-600 hover:bg-green-700" : ""}
              title={settings.muted ? "Ativar voz" : "Desativar voz"}
            >
              {settings.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
