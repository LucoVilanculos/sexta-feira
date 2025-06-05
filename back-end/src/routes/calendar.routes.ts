import { Router } from "express"
import { authenticateToken } from "@/middleware/authenticateToken"
import { validateRequest } from "@/middleware/validateRequest"
import { CalendarController } from "@/controllers/CalendarController"
import { createEventSchema, updateEventSchema } from "@/schemas/calendar.schema"

const router = Router()
const calendarController = new CalendarController()

// Protected routes
router.use(authenticateToken)

// Event routes
router.get("/events", calendarController.listEvents)
router.get("/events/:id", calendarController.getEvent)
router.post("/events", validateRequest(createEventSchema), calendarController.createEvent)
router.put("/events/:id", validateRequest(updateEventSchema), calendarController.updateEvent)
router.delete("/events/:id", calendarController.deleteEvent)

// Calendar view routes
router.get("/view/month/:year/:month", calendarController.getMonthView)
router.get("/view/week/:year/:week", calendarController.getWeekView)
router.get("/view/day/:year/:month/:day", calendarController.getDayView)

export const calendarRouter = router 