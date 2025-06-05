"use client"

import { useState } from "react"
import { ConfigSection } from "./config-section"
import { ConfigInput } from "./config-input"
import { ConfigSelect } from "./config-select"
import { ConfigCheckbox } from "./config-checkbox"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ConfigFormProps {
  initialData?: {
    assistantName: string
    language: string
    tone: string
    notifications: boolean
    theme: string
  }
}

export function ConfigForm({ initialData }: ConfigFormProps) {
  const [assistantName, setAssistantName] = useState(initialData?.assistantName ?? "Sexta-feira")
  const [language, setLanguage] = useState(initialData?.language ?? "pt-BR")
  const [tone, setTone] = useState(initialData?.tone ?? "informal")
  const [notifications, setNotifications] = useState(initialData?.notifications ?? true)
  const [theme, setTheme] = useState(initialData?.theme ?? "dark")
  const { toast } = useToast()

  const handleResetHistory = () => {
    toast({
      title: "Histórico resetado",
      description: "O histórico de conversas foi limpo com sucesso.",
    })
  }

  const languageOptions = [
    { value: "pt-BR", label: "Português" },
    { value: "en-US", label: "Inglês" },
    { value: "es-ES", label: "Espanhol" },
  ]

  const toneOptions = [
    { value: "informal", label: "Informal" },
    { value: "formal", label: "Formal" },
  ]

  const themeOptions = [
    { value: "dark", label: "Escuro" },
    { value: "light", label: "Claro" },
  ]

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6 max-w-xl space-y-6">
      <ConfigSection>
        <ConfigInput
          id="assistantName"
          label="Nome do assistente"
          value={assistantName}
          onChange={setAssistantName}
        />
      </ConfigSection>

      <ConfigSection>
        <ConfigSelect
          id="language"
          label="Idioma"
          value={language}
          onChange={setLanguage}
          options={languageOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <ConfigSelect
          id="tone"
          label="Tom de resposta"
          value={tone}
          onChange={setTone}
          options={toneOptions}
        />
      </ConfigSection>

      <ConfigSection>
        <ConfigCheckbox
          id="notifications"
          label="Ativar notificações"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </ConfigSection>

      <ConfigSection>
        <ConfigSelect
          id="theme"
          label="Tema"
          value={theme}
          onChange={setTheme}
          options={themeOptions}
        />
      </ConfigSection>

      <Button
        variant="destructive"
        onClick={handleResetHistory}
        className="w-full"
      >
        Resetar histórico de conversa
      </Button>
    </div>
  )
} 