"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"


export function Header() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  return (
    <header className="flex items-center justify-between p-4 border-b border-purple-500/20 bg-black/20 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500 text-green-400">
            Online
          </Badge>
          <span className="text-sm text-muted-foreground">Sexta-feira está pronta para ajudar</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={isListening ? "default" : "outline"}
          size="sm"
          onClick={() => setIsListening(!isListening)}
          className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
        >
          {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          {isListening ? "Ouvindo..." : "Ativar Voz"}
        </Button>

        <Button variant={isSpeaking ? "default" : "outline"} size="sm" onClick={() => setIsSpeaking(!isSpeaking)}>
          {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}
