export interface Config {
  id: string
  name: string
  description: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  category: 'system' | 'user' | 'notification' | 'appearance'
  isRequired: boolean
  defaultValue?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  metadata?: Record<string, unknown>
} 