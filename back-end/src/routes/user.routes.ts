import { Router } from "express"
import { authenticateToken } from "@/middleware/authenticateToken"
import { validateRequest } from "@/middleware/validateRequest"
import { UserController } from "@/controllers/UserController"
import { updateProfileSchema, updateSettingsSchema } from "@/schemas/user.schema"

const router = Router()
const userController = new UserController()

// Protected routes
router.use(authenticateToken)

// Profile routes
router.get("/profile", userController.getProfile)
router.put("/profile", validateRequest(updateProfileSchema), userController.updateProfile)
router.delete("/profile", userController.deleteProfile)

// Settings routes
router.get("/settings", userController.getSettings)
router.put("/settings", validateRequest(updateSettingsSchema), userController.updateSettings)

// Preferences routes
router.get("/preferences", userController.getPreferences)
router.put("/preferences/theme", userController.updateTheme)
router.put("/preferences/notifications", userController.updateNotifications)
router.put("/preferences/language", userController.updateLanguage)

// Security routes
router.put("/security/password", userController.changePassword)
router.get("/security/sessions", userController.listSessions)
router.delete("/security/sessions/:id", userController.revokeSession)
router.get("/security/activity", userController.getActivityLog)

export const userRouter = router 