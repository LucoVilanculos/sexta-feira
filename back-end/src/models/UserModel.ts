import { Schema, model, Document } from "mongoose"
import { AppError } from "@/utils/AppError"

export interface User extends Document {
  name: string
  email: string
  password: string
  avatar?: string
  bio?: string
  timezone?: string
  settings: {
    theme?: "light" | "dark" | "system"
    language?: string
    notifications?: {
      email: boolean
      push: boolean
      desktop: boolean
      calendar: boolean
      tasks: boolean
    }
    privacy?: {
      showProfile: boolean
      showActivity: boolean
      showCalendar: boolean
    }
    calendar?: {
      defaultView: "month" | "week" | "day"
      weekStart: number
      workingHours: {
        start: string
        end: string
      }
    }
  }
  preferences: {
    theme?: "light" | "dark" | "system"
    language?: string
    notifications?: {
      email: boolean
      push: boolean
      desktop: boolean
      calendar: boolean
      tasks: boolean
    }
  }
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: String,
    bio: String,
    timezone: String,
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
      },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        desktop: { type: Boolean, default: true },
        calendar: { type: Boolean, default: true },
        tasks: { type: Boolean, default: true }
      },
      privacy: {
        showProfile: { type: Boolean, default: true },
        showActivity: { type: Boolean, default: true },
        showCalendar: { type: Boolean, default: false }
      },
      calendar: {
        defaultView: {
          type: String,
          enum: ["month", "week", "day"],
          default: "month"
        },
        weekStart: { type: Number, min: 0, max: 6, default: 0 },
        workingHours: {
          start: { type: String, default: "09:00" },
          end: { type: String, default: "17:00" }
        }
      }
    },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system"
      },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        desktop: { type: Boolean, default: true },
        calendar: { type: Boolean, default: true },
        tasks: { type: Boolean, default: true }
      }
    }
  },
  { timestamps: true }
)

const BaseUserModel = model<User>("User", userSchema)

export class UserModel {
  static async findById(id: string) {
    return BaseUserModel.findById(id).select("-password")
  }

  static async findByEmail(email: string) {
    return BaseUserModel.findOne({ email })
  }

  static async create(data: Partial<User>) {
    return BaseUserModel.create(data)
  }

  static async update(id: string, data: Partial<User>) {
    return BaseUserModel.findByIdAndUpdate(id, data, { new: true }).select("-password")
  }

  static async delete(id: string) {
    return BaseUserModel.findByIdAndDelete(id)
  }
} 