import { z } from "zod"

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    avatar: z.string().url("Invalid avatar URL").optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    timezone: z.string().optional(),
  }),
})

export const updateSettingsSchema = z.object({
  body: z.object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    language: z.string().min(2, "Invalid language code").optional(),
    notifications: z.object({
      email: z.boolean(),
      push: z.boolean(),
      desktop: z.boolean(),
      calendar: z.boolean(),
      tasks: z.boolean(),
    }).optional(),
    privacy: z.object({
      showProfile: z.boolean(),
      showActivity: z.boolean(),
      showCalendar: z.boolean(),
    }).optional(),
    calendar: z.object({
      defaultView: z.enum(["month", "week", "day"]),
      weekStart: z.number().min(0).max(6),
      workingHours: z.object({
        start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      }),
    }).optional(),
  }),
})

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
  }),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"]
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>["body"]
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"] 