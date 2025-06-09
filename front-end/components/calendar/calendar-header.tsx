import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptMZ } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarHeaderProps {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onCreateEvent: () => void
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onCreateEvent,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={onNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={onCreateEvent}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        Novo Evento
      </Button>
    </div>
  )
} 