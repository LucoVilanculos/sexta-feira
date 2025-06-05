import { create } from 'zustand'
import { Config } from '../types/Config'
import axios from 'axios'

interface ConfigStore {
  configs: Config[]
  isLoading: boolean
  error: string | null
  fetchConfigs: () => Promise<void>
  createConfig: (config: Omit<Config, 'id'>) => Promise<void>
  updateConfig: (id: string, config: Partial<Config>) => Promise<void>
  deleteConfig: (configId: string) => Promise<void>
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  configs: [],
  isLoading: false,
  error: null,

  fetchConfigs: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get('/api/configs')
      set({ configs: response.data })
    } catch (error) {
      set({ error: 'Failed to fetch configurations' })
    } finally {
      set({ isLoading: false })
    }
  },

  createConfig: async (config) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post('/api/configs', config)
      set(state => ({
        configs: [...state.configs, response.data]
      }))
    } catch (error) {
      set({ error: 'Failed to create configuration' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateConfig: async (id, config) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.patch(`/api/configs/${id}`, config)
      set(state => ({
        configs: state.configs.map(c => c.id === id ? response.data : c)
      }))
    } catch (error) {
      set({ error: 'Failed to update configuration' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteConfig: async (configId) => {
    set({ isLoading: true, error: null })
    try {
      await axios.delete(`/api/configs/${configId}`)
      set(state => ({
        configs: state.configs.filter(config => config.id !== configId)
      }))
    } catch (error) {
      set({ error: 'Failed to delete configuration' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
})) 