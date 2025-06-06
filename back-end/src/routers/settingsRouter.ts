import { Router } from "express"
import { UserSettingsController } from "../controllers/UserSettingsController"
import { authenticateToken } from "../middleware/auth"
import { settingsSchema } from "../schemas/validation"
import { validateRequest } from "../schemas/validation"

const router = Router()

// Todas as rotas requerem autenticação
router.use(authenticateToken)

// Rotas
router.get("/", UserSettingsController.getSettings)
router.get("/:key", UserSettingsController.getSetting)
router.post("/", validateRequest(settingsSchema), UserSettingsController.createSetting)
router.put("/:key", validateRequest(settingsSchema.partial()), UserSettingsController.updateSetting)
router.delete("/:key", UserSettingsController.deleteSetting)

export default router 