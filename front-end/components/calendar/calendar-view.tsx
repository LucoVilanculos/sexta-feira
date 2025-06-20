"use client"

import { useState } from "react"
import { CalendarView as ICalendarView } from "@/types/calendar"
import { Calendar } from "@/components/ui/calendar"
import { addMonths, subMonths, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Loader2 } from "lucide-react"
import { CreateEventDialog } from "./create-event-dialog"
import { DayEvents } from "./day-events"
import { CalendarHeader } from "./calendar-header"
import { useCalendarEvents } from "./hooks/use-calendar-events"



export function CalendarView() {
  const [view, setView] = useState<ICalendarView>({
    type: "month",
    date: new Date(),
  })
  const [showCreateEvent, setShowCreateEvent] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  const { events, isLoading, refetchEvents } = useCalendarEvents(view.date)

  const handlePreviousMonth = () => {
    setView((prev) => ({
      ...prev,
      date: subMonths(prev.date, 1),
    }))
  }

  const handleNextMonth = () => {
    setView((prev) => ({
      ...prev,
      date: addMonths(prev.date, 1),
    }))
  }

  const handleCreateEventSuccess = () => {
    setShowCreateEvent(false)
    refetchEvents()
  }

  const selectedDayEvents = events.filter((event) =>
    isSameDay(new Date(event.start), selectedDate)
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <CalendarHeader
          currentDate={view.date}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onCreateEvent={() => setShowCreateEvent(true)}
        />

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: any) => date && setSelectedDate(date)}
            className="rounded-md border"
            locale={ptBR}
            modifiers={{
              hasEvent: (date: any) =>
                events.some((event) => isSameDay(new Date(event.start), date)),
            }}
            modifiersClassNames={{
              hasEvent: "bg-purple-500/20 font-semibold text-purple-400",
            }}
          />
        )}
      </div>

      <div className="h-[500px] rounded-lg border border-purple-500/20 bg-black/20 p-4 overflow-auto">
        <DayEvents events={selectedDayEvents} date={selectedDate} />
      </div>

      <CreateEventDialog
        open={showCreateEvent}
        onOpenChange={setShowCreateEvent}
        onSuccess={handleCreateEventSuccess}
      />
    </div>
  )
} 