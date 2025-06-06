import { Router } from 'express'
import { CalendarController } from '../controllers/CalendarController'
import { authMiddleware } from '../middleware/authMiddleware'
import { eventSchema } from '../schemas/validation'
import { validateRequest } from '../schemas/validation'

export const eventRouter = Router()
const calendarController = new CalendarController()

// Todas as rotas requerem autenticação
eventRouter.use(authMiddleware)

// Rotas
eventRouter.get("/", calendarController.listEvents)
eventRouter.get("/:id", calendarController.getEvent)
eventRouter.post("/", validateRequest(eventSchema), calendarController.createEvent)
eventRouter.put("/:id", validateRequest(eventSchema.partial()), calendarController.updateEvent)
eventRouter.delete("/:id", calendarController.deleteEvent) 