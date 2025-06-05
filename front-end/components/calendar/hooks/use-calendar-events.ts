import { useState, useEffect } from "react"
import { CalendarEvent } from "@/types/calendar"
import { calendarApi } from "@/server/calendar"
import { useToast } from "@/hooks/use-toast"
import { startOfMonth, endOfMonth } from "date-fns"

export function useCalendarEvents(currentDate: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchEvents = async () => {
    try {
      const startDate = startOfMonth(currentDate)
      const endDate = endOfMonth(currentDate)
      const fetchedEvents = await calendarApi.getEvents(startDate, endDate)
      setEvents(fetchedEvents)
    } catch (error) {
      toast({
        title: "Erro ao carregar eventos",
        description: error instanceof Error ? error.message : "Não foi possível carregar os eventos do calendário.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  return {
    events,
    isLoading,
    refetchEvents: fetchEvents
  }
} 