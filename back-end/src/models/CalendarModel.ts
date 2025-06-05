import { Schema, model, Document } from "mongoose"

export interface Event extends Document {
  userId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  allDay: boolean
  location?: string
  color?: string
  participants?: string[]
  reminders?: number[]
  recurrence?: {
    type: "none" | "daily" | "weekly" | "monthly" | "yearly"
    interval?: number
    endDate?: Date
    daysOfWeek?: number[]
  }
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<Event>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    allDay: { type: Boolean, default: false },
    location: String,
    color: String,
    participants: [String],
    reminders: [Number],
    recurrence: {
      type: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly", "yearly"],
        default: "none"
      },
      interval: Number,
      endDate: Date,
      daysOfWeek: [Number]
    }
  },
  { timestamps: true }
)

const EventModel = model<Event>("Event", eventSchema)

export class CalendarModel {
  static async findEventsByDateRange(userId: string, startDate?: string, endDate?: string) {
    const query: any = { userId }

    if (startDate || endDate) {
      query.startDate = {}
      if (startDate) query.startDate.$gte = new Date(startDate)
      if (endDate) query.startDate.$lte = new Date(endDate)
    }

    return EventModel.find(query).sort({ startDate: 1 })
  }

  static async findEventById(id: string) {
    return EventModel.findById(id)
  }

  static async createEvent(data: Partial<Event>) {
    return EventModel.create(data)
  }

  static async updateEvent(id: string, data: Partial<Event>) {
    return EventModel.findByIdAndUpdate(id, data, { new: true })
  }

  static async deleteEvent(id: string) {
    return EventModel.findByIdAndDelete(id)
  }
} 