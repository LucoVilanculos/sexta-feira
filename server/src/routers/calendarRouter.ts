import { Router } from "express"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Placeholder para funcionalidades de calendário
router.get("/events", (req, res) => {
  res.json({
    events: [],
    message: "Funcionalidade de calendário será implementada em breve",
  })
})

router.post("/events", (req, res) => {
  res.json({
    message: "Evento criado com sucesso (placeholder)",
  })
})

export default router
