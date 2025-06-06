import {
  createSystemCommand,
  createSocialCommand,
  createWeatherCommand,
  createReminderCommand,
  createMediaCommand,
  createProductivityCommand,
  createAmbientCommand,
  createUpdateCommand,
  createAnalysisCommand,
  executeCommand,
} from "@/services/commands"

interface CommandPattern {
  type: string
  patterns: RegExp[]
  handler: (matches: RegExpMatchArray) => any
}

const commandPatterns: CommandPattern[] = [
  // Sistema
  {
    type: "system",
    patterns: [
      /deslig(ar|a) (o )?computador/i,
      /reinici(ar|a) (o )?computador/i,
      /coloc(ar|a) (em )?modo (de )?sono/i,
      /abr(e|ir) (o )?(.+)/i,
    ],
    handler: (matches) => {
      const actions: { [key: string]: string } = {
        desligar: "shutdown",
        reiniciar: "restart",
        sono: "sleep",
        abrir: "open",
      }

      const action = matches[0].toLowerCase().includes("abr") ? "open" : 
                    matches[0].toLowerCase().includes("deslig") ? "shutdown" :
                    matches[0].toLowerCase().includes("reinic") ? "restart" : "sleep"

      const target = action === "open" ? matches[3] : undefined
      return createSystemCommand(action, target)
    }
  },

  // Redes Sociais
  {
    type: "social",
    patterns: [
      /(abr(e|ir)|ver|checar) (o )?(?<platform>instagram|facebook|twitter|linkedin)/i,
      /l(er|eia) (os )?coment(á|a)rios (do|da) (?<platform>instagram|facebook|twitter|linkedin)/i,
    ],
    handler: (matches) => {
      const platform = matches.groups?.platform.toLowerCase()
      const action = matches[0].toLowerCase().includes("ler") ? "read" : "open"
      return createSocialCommand(platform!, action)
    }
  },

  // Clima
  {
    type: "weather",
    patterns: [
      /como est(á|a) o (tempo|clima)( em (?<location>.+))?/i,
      /previs(ã|a)o do tempo( em (?<location>.+))?/i,
      /vai chover( em (?<location>.+))?/i,
    ],
    handler: (matches) => {
      const location = matches.groups?.location
      return createWeatherCommand(location)
    }
  },

  // Lembretes
  {
    type: "reminder",
    patterns: [
      /lembr(ar|e)(-me)? (de )?(?<task>.+)( em (?<time>.+))?/i,
      /cri(ar|e) (um )?lembrete:? (?<task>.+)/i,
      /(mostrar|ver|listar) (meus )?lembretes/i,
    ],
    handler: (matches) => {
      const action = matches[0].toLowerCase().includes("mostrar") || 
                    matches[0].toLowerCase().includes("ver") || 
                    matches[0].toLowerCase().includes("listar") ? "list" : "create"
      
      const title = matches.groups?.task || ""
      return createReminderCommand(action, title)
    }
  },

  // Mídia
  {
    type: "media",
    patterns: [
      /(tocar|reproduzir|play) (?<query>.+) no youtube/i,
      /abr(e|ir) (o )?youtube( e procurar (?<query>.+))?/i,
    ],
    handler: (matches) => {
      const query = matches.groups?.query
      const action = query ? "search" : "open"
      return createMediaCommand("youtube", action, query)
    }
  },

  // Produtividade
  {
    type: "productivity",
    patterns: [
      /abr(e|ir) (o )?(vs ?code|visual studio code|cursor)/i,
      /abr(e|ir) (um )?terminal/i,
    ],
    handler: (matches) => {
      const app = matches[0].toLowerCase().includes("cursor") ? "cursor" :
                 matches[0].toLowerCase().includes("terminal") ? "terminal" : "vscode"
      return createProductivityCommand(app, "open")
    }
  },

  // Ambiente
  {
    type: "ambient",
    patterns: [
      /modo (de )?(?<mode>relaxamento|foco|sono|energia)/i,
      /ativ(ar|e) modo (?<mode>relaxamento|foco|sono|energia)/i,
    ],
    handler: (matches) => {
      const modeMap: { [key: string]: string } = {
        relaxamento: "relax",
        foco: "focus",
        sono: "sleep",
        energia: "energize",
      }
      const mode = modeMap[matches.groups?.mode.toLowerCase() || "relax"]
      return createAmbientCommand(mode)
    }
  },

  // Atualizações
  {
    type: "updates",
    patterns: [
      /verific(ar|a) (se há )?atualiza(ç|c)(õ|o)es/i,
      /atualiz(ar|e) (o )?sistema/i,
    ],
    handler: (matches) => {
      const action = matches[0].toLowerCase().includes("verificar") ? "check" : "install"
      return createUpdateCommand("system", action)
    }
  },

  // Análise
  {
    type: "analysis",
    patterns: [
      /analis(ar|e) (os )?coment(á|a)rios (do|da) (?<platform>.+)/i,
      /sugest(õ|o)es (para|de) (?<platform>.+)/i,
    ],
    handler: (matches) => {
      const platform = matches.groups?.platform
      return createAnalysisCommand("comments", platform, "detailed", true)
    }
  },
]

export async function processNaturalLanguage(text: string) {
  for (const pattern of commandPatterns) {
    for (const regex of pattern.patterns) {
      const matches = text.match(regex)
      if (matches) {
        const command = pattern.handler(matches)
        return executeCommand(command)
      }
    }
  }

  throw new Error("Comando não reconhecido")
} 