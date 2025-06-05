import { Router } from "express"
import { body } from "express-validator"
import { ProjectController } from "../controllers/ProjectController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Validações
const validateProject = [
  body("name").trim().isLength({ min: 1 }).withMessage("Nome é obrigatório"),
  body("priority").isIn(["Baixa", "Média", "Alta"]).withMessage("Prioridade inválida"),
]

const validateProjectUpdate = [
  body("name").optional().trim().isLength({ min: 1 }).withMessage("Nome é obrigatório"),
  body("priority").optional().isIn(["Baixa", "Média", "Alta"]).withMessage("Prioridade inválida"),
  body("status")
    .optional()
    .isIn(["Planejamento", "Em Desenvolvimento", "Concluído", "Pausado"])
    .withMessage("Status inválido"),
]

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.get("/", ProjectController.getProjects)
router.get("/stats", ProjectController.getProjectStats)
router.get("/:id", ProjectController.getProject)
router.post("/", validateProject, ProjectController.createProject)
router.put("/:id", validateProjectUpdate, ProjectController.updateProject)
router.delete("/:id", ProjectController.deleteProject)
router.patch("/:id/progress", ProjectController.updateProgress)

export default router
