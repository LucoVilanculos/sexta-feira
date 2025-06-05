import { Router } from "express"
import { authenticateToken } from "@/middleware/authenticateToken"
import { validateRequest } from "@/middleware/validateRequest"
import { DashboardController } from "@/controllers/DashboardController"
import { updateWidgetSchema } from "@/schemas/dashboard.schema"

const router = Router()
const dashboardController = new DashboardController()

// Protected routes
router.use(authenticateToken)

// Analytics routes
router.get("/analytics/overview", dashboardController.getOverview)
router.get("/analytics/tasks", dashboardController.getTasksAnalytics)
router.get("/analytics/calendar", dashboardController.getCalendarAnalytics)
router.get("/analytics/activity", dashboardController.getActivityAnalytics)

// Widget routes
router.get("/widgets", dashboardController.listWidgets)
router.get("/widgets/:id", dashboardController.getWidget)
router.put("/widgets/:id", validateRequest(updateWidgetSchema), dashboardController.updateWidget)
router.post("/widgets/:id/position", dashboardController.updateWidgetPosition)

// Dashboard layout routes
router.get("/layout", dashboardController.getLayout)
router.put("/layout", dashboardController.updateLayout)

// Quick actions
router.get("/quick-actions", dashboardController.getQuickActions)
router.post("/quick-actions/execute", dashboardController.executeQuickAction)

export const dashboardRouter = router 