import { z } from "zod"

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
    allDay: z.boolean().default(false),
    location: z.string().optional(),
    color: z.string().optional(),
    participants: z.array(z.string()).optional(),
    reminders: z.array(z.number()).optional(),
    recurrence: z.object({
      type: z.enum(["none", "daily", "weekly", "monthly", "yearly"]),
      interval: z.number().optional(),
      endDate: z.string().datetime().optional(),
      daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    }).optional(),
  }),
})

export const updateEventSchema = createEventSchema.extend({
  params: z.object({
    id: z.string().min(1, "Event ID is required"),
  }),
})

export type CreateEventInput = z.infer<typeof createEventSchema>["body"]
export type UpdateEventInput = z.infer<typeof updateEventSchema>["body"] 