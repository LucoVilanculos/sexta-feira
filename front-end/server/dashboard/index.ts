import { DashboardConfig, UpdateDashboardConfig, UpdateWidgetConfig, WidgetConfig } from '@/types/dashboard'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const dashboardApi = {
  async getConfig(): Promise<DashboardConfig> {
    const response = await fetch(`${API_URL}/dashboard/config`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao buscar configuração do dashboard')
    }

    return data.config
  },

  async updateConfig(config: UpdateDashboardConfig): Promise<DashboardConfig> {
    const response = await fetch(`${API_URL}/dashboard/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(config),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar configuração do dashboard')
    }

    return data.config
  },

  async updateWidget(widgetConfig: UpdateWidgetConfig): Promise<WidgetConfig> {
    const response = await fetch(
      `${API_URL}/dashboard/${widgetConfig.dashboardId}/widgets/${widgetConfig.widgetId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(widgetConfig),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao atualizar widget')
    }

    return data.widget
  },

  async addWidget(dashboardId: string, widget: Omit<WidgetConfig, 'id'>): Promise<WidgetConfig> {
    const response = await fetch(`${API_URL}/dashboard/${dashboardId}/widgets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(widget),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao adicionar widget')
    }

    return data.widget
  },

  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    const response = await fetch(`${API_URL}/dashboard/${dashboardId}/widgets/${widgetId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Erro ao remover widget')
    }
  },
} 