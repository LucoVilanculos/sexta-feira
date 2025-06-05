"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

interface VoiceSettings {
  muted: boolean
  language: string
  volume: number
  rate: number
  pitch: number
}

interface VoiceContextProps {
  settings: VoiceSettings
  toggleMute: () => void
  setLanguage: (lang: string) => void
  setVolume: (volume: number) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  speak: (text: string) => void
  isSupported: boolean
}

const defaultSettings: VoiceSettings = {
  muted: false,
  language: "pt-BR",
  volume: 1,
  rate: 1,
  pitch: 1,
}

const VoiceContext = createContext<VoiceContextProps | null>(null)

export const VoiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<VoiceSettings>(defaultSettings)
  const [isSupported, setIsSupported] = useState(false)

  // Check if speech synthesis is supported
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("speechSynthesis" in window)
    }
  }, [])

  const toggleMute = useCallback(() => {
    setSettings(prev => ({ ...prev, muted: !prev.muted }))
  }, [])

  const setLanguage = useCallback((language: string) => {
    setSettings(prev => ({ ...prev, language }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    setSettings(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }))
  }, [])

  const setRate = useCallback((rate: number) => {
    setSettings(prev => ({ ...prev, rate: Math.max(0.1, Math.min(10, rate)) }))
  }, [])

  const setPitch = useCallback((pitch: number) => {
    setSettings(prev => ({ ...prev, pitch: Math.max(0, Math.min(2, pitch)) }))
  }, [])

  const speak = useCallback((text: string) => {
    if (!isSupported || settings.muted) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = settings.language
    utterance.volume = settings.volume
    utterance.rate = settings.rate
    utterance.pitch = settings.pitch

    window.speechSynthesis.speak(utterance)
  }, [settings, isSupported])

  const value = {
    settings,
    toggleMute,
    setLanguage,
    setVolume,
    setRate,
    setPitch,
    speak,
    isSupported,
  }

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  )
}

export const useVoice = () => {
  const context = useContext(VoiceContext)
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider")
  }
  return context
}