import { create } from 'zustand'
import { Event } from '../types/Event'
import axios from 'axios'

interface EventsStore {
  events: Event[]
  isLoading: boolean
  error: string | null
  fetchEvents: () => Promise<void>
  createEvent: (event: Omit<Event, 'id'>) => Promise<void>
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>
  deleteEvent: (eventId: string) => Promise<void>
}

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get('/api/events')
      set({ events: response.data })
    } catch (error) {
      set({ error: 'Failed to fetch events' })
    } finally {
      set({ isLoading: false })
    }
  },

  createEvent: async (event) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/events', event)
      set(state => ({
        events: [...state.events, response.data]
      }))
    } catch (error) {
      set({ error: 'Failed to create event' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateEvent: async (id, event) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.patch(`/api/events/${id}`, event)
      set(state => ({
        events: state.events.map(e => e.id === id ? response.data : e)
      }))
    } catch (error) {
      set({ error: 'Failed to update event' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteEvent: async (eventId) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/events/${eventId}`)
      set(state => ({
        events: state.events.filter(event => event.id !== eventId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete event' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
})) 