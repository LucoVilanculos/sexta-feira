export interface CommandBase {
  type: CommandType
  status: 'pending' | 'executing' | 'completed' | 'failed'
  timestamp: Date
}

export type CommandType =
  | 'system'        // Comandos do sistema (ligar/desligar PC, abrir programas)
  | 'social'        // Redes sociais
  | 'weather'       // Meteorologia
  | 'reminder'      // Lembretes e tarefas
  | 'media'         // YouTube, música, etc
  | 'productivity'  // VS Code, Cursor, etc
  | 'ambient'       // Modo relaxamento
  | 'updates'       // Atualizações do sistema/apps
  | 'analysis'      // Análise de conteúdo (comentários, sugestões)

export interface SystemCommand extends CommandBase {
  type: 'system'
  action: 'shutdown' | 'restart' | 'sleep' | 'open' | 'close'
  target?: string   // Nome do programa/app
}

export interface SocialCommand extends CommandBase {
  type: 'social'
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin'
  action: 'open' | 'read' | 'analyze' | 'respond'
  content?: string
}

export interface WeatherCommand extends CommandBase {
  type: 'weather'
  location?: string
  forecast: 'current' | 'today' | 'week'
}

export interface ReminderCommand extends CommandBase {
  type: 'reminder'
  action: 'create' | 'list' | 'update' | 'delete'
  title: string
  description?: string
  dueDate?: Date
  priority?: 'low' | 'medium' | 'high'
}

export interface MediaCommand extends CommandBase {
  type: 'media'
  platform: 'youtube' | 'spotify' | 'netflix'
  action: 'play' | 'pause' | 'search' | 'open'
  query?: string
}

export interface ProductivityCommand extends CommandBase {
  type: 'productivity'
  app: 'vscode' | 'cursor' | 'browser' | 'terminal'
  action: 'open' | 'close' | 'focus'
  context?: string
}

export interface AmbientCommand extends CommandBase {
  type: 'ambient'
  mode: 'relax' | 'focus' | 'sleep' | 'energize'
  duration?: number // em minutos
  intensity?: 'low' | 'medium' | 'high'
}

export interface UpdateCommand extends CommandBase {
  type: 'updates'
  target: 'system' | 'apps' | 'security'
  action: 'check' | 'install' | 'schedule'
}

export interface AnalysisCommand extends CommandBase {
  type: 'analysis'
  target: 'comments' | 'content' | 'metrics'
  platform?: string
  depth: 'basic' | 'detailed'
  suggestions?: boolean
}

export type CommandResponse = {
  success: boolean
  message?: string
  command?: Command
  data?: any
}

export type Command =
  | SystemCommand
  | SocialCommand
  | WeatherCommand
  | ReminderCommand
  | MediaCommand
  | ProductivityCommand
  | AmbientCommand
  | UpdateCommand
  | AnalysisCommand 