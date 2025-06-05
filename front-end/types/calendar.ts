export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  location?: string
  color?: string
  participants?: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateEventData {
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  location?: string
  color?: string
  participants?: string[]
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string
}

export interface CalendarView {
  type: 'day' | 'week' | 'month'
  date: Date
} 