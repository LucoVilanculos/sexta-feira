import { NextResponse } from "next/server"
import { Command, SystemCommand, SocialCommand, WeatherCommand, ReminderCommand, MediaCommand, ProductivityCommand, AmbientCommand, UpdateCommand, AnalysisCommand } from "@/types/commands"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const command = (await req.json()) as Command

    // Atualiza o status para executing
    command.status = "executing"

    let result: any

    switch (command.type) {
      case "system":
        result = await handleSystemCommand(command as SystemCommand)
        break
      case "social":
        result = await handleSocialCommand(command as SocialCommand)
        break
      case "weather":
        result = await handleWeatherCommand(command as WeatherCommand)
        break
      case "reminder":
        result = await handleReminderCommand(command as ReminderCommand)
        break
      case "media":
        result = await handleMediaCommand(command as MediaCommand)
        break
      case "productivity":
        result = await handleProductivityCommand(command as ProductivityCommand)
        break
      case "ambient":
        result = await handleAmbientCommand(command as AmbientCommand)
        break
      case "updates":
        result = await handleUpdateCommand(command as UpdateCommand)
        break
      case "analysis":
        result = await handleAnalysisCommand(command as AnalysisCommand)
        break
      default:
        throw new Error("Unknown command type")
    }

    command.status = "completed"
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error processing command:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process command" },
      { status: 500 }
    )
  }
}

// Handlers para cada tipo de comando
async function handleSystemCommand(command: SystemCommand) {
  switch (command.action) {
    case "shutdown":
      return execAsync("shutdown /s /t 0")
    case "restart":
      return execAsync("shutdown /r /t 0")
    case "sleep":
      return execAsync("rundll32.exe powrprof.dll,SetSuspendState 0,1,0")
    case "open":
      if (command.target) {
        return execAsync(`start ${command.target}`)
      }
      break
    default:
      throw new Error("Unknown system action")
  }
}

async function handleSocialCommand(command: SocialCommand) {
  const urls: { [key: string]: string } = {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
  }

  if (command.platform && urls[command.platform]) {
    return execAsync(`start ${urls[command.platform]}`)
  }

  throw new Error("Unknown social platform")
}

async function handleWeatherCommand(command: WeatherCommand) {
  // Aqui você pode integrar com uma API de previsão do tempo
  const WEATHER_API_KEY = process.env.WEATHER_API_KEY
  const location = command.location || "auto:ip"
  
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=7`
  )
  
  return response.json()
}

async function handleReminderCommand(command: ReminderCommand) {
  // Implementar integração com sistema de lembretes
  // Pode usar localStorage, banco de dados ou API externa
  return { message: "Reminder functionality to be implemented" }
}

async function handleMediaCommand(command: MediaCommand) {
  if (command.platform === "youtube" && command.query) {
    const searchQuery = encodeURIComponent(command.query)
    return execAsync(`start https://www.youtube.com/results?search_query=${searchQuery}`)
  }
  
  throw new Error("Unsupported media command")
}

async function handleProductivityCommand(command: ProductivityCommand) {
  const apps: { [key: string]: string } = {
    vscode: "code",
    cursor: "cursor",
    terminal: "cmd.exe",
  }

  if (command.app && apps[command.app]) {
    return execAsync(`start ${apps[command.app]}`)
  }

  throw new Error("Unknown productivity app")
}

async function handleAmbientCommand(command: AmbientCommand) {
  // Implementar controle de ambiente (música, luzes, etc)
  return { message: "Ambient control to be implemented" }
}

async function handleUpdateCommand(command: UpdateCommand) {
  // Implementar verificação de atualizações
  return { message: "Update check to be implemented" }
}

async function handleAnalysisCommand(command: AnalysisCommand) {
  // Implementar análise de conteúdo
  return { message: "Content analysis to be implemented" }
} 