import { Router } from 'express'
import { body } from 'express-validator'
import { CalendarController } from '../controllers/CalendarController'
import { authMiddleware } from '../middleware/authMiddleware'

export const eventRouter = Router()

// Validações
const validateEvent = [
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("startDate").isISO8601().withMessage("Data de início inválida"),
  body("endDate").isISO8601().withMessage("Data de término inválida"),
  body("allDay").isBoolean().withMessage("Evento de dia inteiro deve ser um booleano"),
  body("location").optional().isString().withMessage("Localização deve ser uma string"),
  body("color").optional().isString().withMessage("Cor deve ser uma string"),
  body("participants").optional().isArray().withMessage("Lista de participantes deve ser um array"),
  body("reminders").optional().isArray().withMessage("Lista de lembretes deve ser um array"),
  body("recurrence").optional().isObject().withMessage("Configuração de recorrência deve ser um objeto"),
]

// Rotas protegidas
eventRouter.use(authMiddleware)

// Rotas de eventos
eventRouter.get("/", CalendarController.getEvents)
eventRouter.post("/", validateEvent, CalendarController.createEvent)
eventRouter.put("/:id", validateEvent, CalendarController.updateEvent)
eventRouter.delete("/:id", CalendarController.deleteEvent) 