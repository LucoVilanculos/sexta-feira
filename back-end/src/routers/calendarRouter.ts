import { Router } from "express"
import { body } from "express-validator"
import { CalendarController } from "../controllers/CalendarController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Validações
const validateEvent = [
  body("title").trim().notEmpty().withMessage("Título é obrigatório"),
  body("startDate").isISO8601().withMessage("Data de início inválida"),
  body("endDate").isISO8601().withMessage("Data de fim inválida"),
  body("allDay").isBoolean().withMessage("allDay deve ser um booleano"),
  body("location").optional().isString().withMessage("Localização deve ser uma string"),
  body("color").optional().isString().withMessage("Cor deve ser uma string"),
  body("participants").optional().isArray().withMessage("Participantes deve ser um array"),
  body("reminders").optional().isArray().withMessage("Lembretes deve ser um array"),
  body("recurrence").optional().isObject().withMessage("Recorrência deve ser um objeto"),
]

// Rotas protegidas
router.use(authenticateToken)

// Rotas de eventos
router.get("/events", CalendarController.getEvents)
router.post("/events", validateEvent, CalendarController.createEvent)
router.put("/events/:id", validateEvent, CalendarController.updateEvent)
router.delete("/events/:id", CalendarController.deleteEvent)

export default router
