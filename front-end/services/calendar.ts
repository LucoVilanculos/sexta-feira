import { api } from "@/lib/api";
import { CalendarEvent, CreateEventData } from "@/types/calendar";

export const calendarApi = {
  async getEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    const response = await api.get(`/api/events?${params.toString()}`);
    return response.data;
  },

  async createEvent(eventData: CreateEventData): Promise<CalendarEvent> {
    const response = await api.post("/api/events", eventData);
    return response.data;
  },

  async updateEvent(id: string, eventData: Partial<CreateEventData>): Promise<CalendarEvent> {
    const response = await api.patch(`/api/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/api/events/${id}`);
  }
}; 