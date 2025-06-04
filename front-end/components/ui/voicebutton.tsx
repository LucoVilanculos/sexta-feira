'use client'
import { useEffect, useState, useRef } from 'react'

interface VoiceButtonProps {
  onResult?: (text: string) => void
}

export const VoiceButton = ({ onResult }: VoiceButtonProps) => {
  const [isSupported, setIsSupported] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = 'pt-PT'
        recognitionRef.current.onend = () => setIsListening(false)
      } else {
        console.error("Reconhecimento de voz não suportado.")
      }
    }
  }, [])

  const handleClick = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript
        if (onResult) onResult(text)
        recognitionRef.current.stop() // Para o reconhecimento após resultado
      }
    }
  }

  if (!mounted) return null

  if (!isSupported) {
    return <p className="text-red-500 text-sm">Reconhecimento de voz não suportado.</p>
  }

  return (
    <button
      className={`px-4 py-2 rounded ${isListening ? "bg-gray-400" : "bg-blue-500 text-white"}`}
      onClick={handleClick}
      disabled={isListening}
    >
      🎤 {isListening ? "Ouvindo..." : "Falar"}
    </button>
  )
}