"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { calendarApi } from "@/services/calendar"
import { CreateEventData } from "@/types/calendar"

const createEventSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  start: z.string().min(1, "Data de início é obrigatória"),
  end: z.string().min(1, "Data de término é obrigatória"),
  location: z.string().optional(),
})

type CreateEventFormData = z.infer<typeof createEventSchema>

interface CreateEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateEventDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
  })

  const onSubmit = async (data: CreateEventFormData) => {
    setIsLoading(true)

    try {
      const eventData: CreateEventData = {
        title: data.title,
        description: data.description,
        start: new Date(data.start),
        end: new Date(data.end),
        location: data.location,
      }

      await calendarApi.createEvent(eventData)

      toast({
        title: "Evento criado!",
        description: "O evento foi adicionado ao seu calendário.",
      })

      reset()
      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao criar evento",
        description: error instanceof Error ? error.message : "Não foi possível criar o evento.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Crie um novo evento no seu calendário. Preencha os detalhes abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Nome do evento"
              {...register("title")}
              className="border-purple-500/20 bg-black/40"
            />
            {errors.title && (
              <p className="text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Detalhes do evento"
              {...register("description")}
              className="border-purple-500/20 bg-black/40"
            />
            {errors.description && (
              <p className="text-sm text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Início</Label>
              <Input
                id="start"
                type="datetime-local"
                {...register("start")}
                className="border-purple-500/20 bg-black/40"
              />
              {errors.start && (
                <p className="text-sm text-red-400">{errors.start.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">Término</Label>
              <Input
                id="end"
                type="datetime-local"
                {...register("end")}
                className="border-purple-500/20 bg-black/40"
              />
              {errors.end && (
                <p className="text-sm text-red-400">{errors.end.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              placeholder="Local do evento (opcional)"
              {...register("location")}
              className="border-purple-500/20 bg-black/40"
            />
            {errors.location && (
              <p className="text-sm text-red-400">{errors.location.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Evento"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 