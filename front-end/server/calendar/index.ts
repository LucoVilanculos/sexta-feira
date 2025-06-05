import { CalendarEvent, CreateEventData, UpdateEventData } from '@/types/calendar'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const calendarApi = {
  async getEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const response = await fetch(
      `${API_URL}/calendar/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar eventos')
    }

    return data.events
  },

  async createEvent(eventData: CreateEventData): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/calendar/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(eventData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao criar evento')
    }

    return data.event
  },

  async updateEvent(eventData: UpdateEventData): Promise<CalendarEvent> {
    const response = await fetch(`${API_URL}/calendar/events/${eventData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(eventData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar evento')
    }

    return data.event
  },

  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_URL}/calendar/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Erro ao deletar evento')
    }
  },
} 