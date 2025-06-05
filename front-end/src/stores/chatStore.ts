import { create } from 'zustand'
import { Message } from '../types/Message'
import axios from 'axios'

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  error: string | null
  fetchMessages: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,

  fetchMessages: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get('/api/messages')
      set({ messages: response.data })
    } catch (error) {
      set({ error: 'Failed to fetch messages' })
    } finally {
      set({ isLoading: false })
    }
  },

  sendMessage: async (content: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/messages', { content })
      set(state => ({
        messages: [...state.messages, response.data]
      }))
    } catch (error) {
      set({ error: 'Failed to send message' })
    } finally {
      set({ isLoading: false })
    }
  },

  deleteMessage: async (messageId: string) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/messages/${messageId}`)
      set(state => ({
        messages: state.messages.filter(msg => msg.id !== messageId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete message' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
}))
 