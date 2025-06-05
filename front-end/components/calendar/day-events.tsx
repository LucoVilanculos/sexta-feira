"use client"

import { CalendarEvent } from "@/types/calendar"
import { format, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { MapPin, Clock, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface DayEventsProps {
  events: CalendarEvent[]
  date: Date
}

export function DayEvents({ events, date }: DayEventsProps) {
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  const getEventTimeStatus = (event: CalendarEvent) => {
    const now = new Date()
    const isToday = isSameDay(date, now)
    
    if (!isToday) return "upcoming"
    if (event.end < now) return "past"
    if (event.start <= now && event.end >= now) return "ongoing"
    return "upcoming"
  }

  if (events.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
        <CalendarIcon className="h-8 w-8" />
        <p>Nenhum evento para {format(date, "dd 'de' MMMM", { locale: ptBR })}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <CalendarIcon className="h-5 w-5" />
        Eventos para {format(date, "dd 'de' MMMM", { locale: ptBR })}
      </h3>
      <div className="space-y-3">
        {sortedEvents.map((event) => {
          const status = getEventTimeStatus(event)
          
          return (
            <div
              key={event.id}
              className={cn(
                "rounded-lg border border-purple-500/20 bg-black/40 p-4 transition-colors",
                status === "ongoing" && "border-green-500/40 bg-green-500/10",
                status === "past" && "opacity-60"
              )}
            >
              <h4 className={cn(
                "font-medium",
                status === "ongoing" ? "text-green-400" : "text-purple-400"
              )}>
                {event.title}
              </h4>
              {event.description && (
                <p className="mt-1 text-sm text-gray-400">{event.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className={cn(
                    "h-4 w-4",
                    status === "ongoing" && "text-green-400"
                  )} />
                  <span>
                    {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 