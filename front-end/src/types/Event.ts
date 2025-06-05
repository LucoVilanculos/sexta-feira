export interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  allDay: boolean
  location?: string
  color?: string
  recurring?: boolean
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
    count?: number
  }
  reminders?: {
    time: number
    unit: 'minutes' | 'hours' | 'days'
  }[]
  attendees?: {
    id: string
    name: string
    email: string
    status: 'pending' | 'accepted' | 'declined'
  }[]
  metadata?: Record<string, unknown>
}
