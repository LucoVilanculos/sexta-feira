'use client'
import { useEffect, useState, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from './button'
import { useVoice } from '../context/voiceContext'

interface VoiceButtonProps {
  onResult?: (text: string) => void
  className?: string
}

export const VoiceButton = ({ onResult, className }: VoiceButtonProps) => {
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const { settings } = useVoice()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        try {
          setIsSupported(true)
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.lang = settings.language
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false

          // Event handlers
          recognitionRef.current.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current.onerror = (event: any) => {
            setIsListening(false)
            setError(event.error)
            toast.error(`Error: ${event.error}`)
          }

          recognitionRef.current.onnomatch = () => {
            setIsListening(false)
            toast.error("Couldn't recognize speech")
          }

        } catch (err) {
          console.error("Error initializing speech recognition:", err)
          setIsSupported(false)
        }
      }
    }
  }, [settings.language])

  const handleClick = async () => {
    if (!recognitionRef.current || isListening) return

    try {
      setError(null)
      setIsListening(true)

      recognitionRef.current.start()
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        if (onResult) {
          onResult(text)
          toast.success("Speech recognized!")
        }
        recognitionRef.current.stop()
      }
    } catch (err) {
      console.error("Error starting speech recognition:", err)
      setIsListening(false)
      toast.error("Failed to start speech recognition")
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isListening || !!error}
      className={`relative ${className || ''}`}
      title={error || (isListening ? "Listening..." : "Click to speak")}
    >
      {isListening ? (
        <>
          <Mic className="h-4 w-4 text-primary animate-pulse" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </>
      ) : (
        <MicOff className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  )
}