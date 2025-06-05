import { z } from "zod"

export const updateWidgetSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    type: z.enum([
      "calendar",
      "tasks",
      "weather",
      "notes",
      "analytics",
      "quick_actions"
    ]),
    settings: z.record(z.any()).optional(),
    refreshInterval: z.number().min(0).optional(),
    position: z.object({
      x: z.number().min(0),
      y: z.number().min(0),
      width: z.number().min(1),
      height: z.number().min(1),
    }).optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Widget ID is required"),
  }),
})

export const updateLayoutSchema = z.object({
  body: z.object({
    layout: z.array(z.object({
      widgetId: z.string(),
      position: z.object({
        x: z.number().min(0),
        y: z.number().min(0),
        width: z.number().min(1),
        height: z.number().min(1),
      }),
    })),
  }),
})

export type UpdateWidgetInput = z.infer<typeof updateWidgetSchema>["body"]
export type UpdateLayoutInput = z.infer<typeof updateLayoutSchema>["body"] 