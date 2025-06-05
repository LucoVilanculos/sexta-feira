export interface Message {
  id: string
  content: string
  timestamp: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  type: 'text' | 'image' | 'file'
  status: 'sent' | 'delivered' | 'read'
  attachments?: {
    url: string
    type: string
    name: string
  }[]
} 