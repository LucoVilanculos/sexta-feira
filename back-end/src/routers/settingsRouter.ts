import { Router } from "express"
import { body } from "express-validator"
import { UserSettingsController } from "../controllers/UserSettingsController"
import { authenticateToken } from "../middleware/auth"

const router = Router()

// Validações
const validateDashboardSettings = [
  body("dashboard.layout").optional().isIn(["grade", "lista"]).withMessage("Layout inválido"),
  body("dashboard.defaultView").optional().isIn(["dia", "semana", "mês"]).withMessage("Visualização padrão inválida"),
  body("dashboard.widgets").optional().isArray().withMessage("Lista de widgets deve ser um array"),
]

const validateCalendarSettings = [
  body("calendar.defaultView").optional().isIn(["dia", "semana", "mês"]).withMessage("Visualização padrão inválida"),
  body("calendar.weekStartsOn").optional().isIn([0, 1, 6]).withMessage("Dia inicial da semana inválido"),
  body("calendar.showWeekends").optional().isBoolean().withMessage("Exibição de fins de semana deve ser um booleano"),
  body("calendar.workingHours").optional().isObject().withMessage("Horário de trabalho deve ser um objeto"),
  body("calendar.defaultEventDuration").optional().isInt().withMessage("Duração padrão deve ser um número"),
  body("calendar.defaultReminders").optional().isArray().withMessage("Lista de lembretes padrão deve ser um array"),
]

const validateNotificationSettings = [
  body("notifications.email").optional().isObject().withMessage("Configurações de email devem ser um objeto"),
  body("notifications.push").optional().isObject().withMessage("Configurações de notificações push devem ser um objeto"),
  body("notifications.desktop").optional().isObject().withMessage("Configurações de notificações desktop devem ser um objeto"),
]

const validateThemeSettings = [
  body("theme.mode").optional().isIn(["claro", "escuro", "sistema"]).withMessage("Modo de tema inválido"),
  body("theme.primaryColor").optional().isString().withMessage("Cor primária deve ser uma string"),
  body("theme.accentColor").optional().isString().withMessage("Cor de destaque deve ser uma string"),
  body("theme.fontSize").optional().isIn(["pequeno", "médio", "grande"]).withMessage("Tamanho de fonte inválido"),
  body("theme.fontFamily").optional().isString().withMessage("Família de fonte deve ser uma string"),
]

const validateWidgetUpdate = [
  body("type").optional().isIn(["calendário", "tarefas", "projetos", "clima", "notas", "relógio"]).withMessage("Tipo de widget inválido"),
  body("position").optional().isObject().withMessage("Posição deve ser um objeto"),
  body("settings").optional().isObject().withMessage("Configurações devem ser um objeto"),
]

// Rotas protegidas
router.use(authenticateToken)

// Rotas de configurações
router.get("/", UserSettingsController.getSettings)
router.patch("/", [
  ...validateDashboardSettings,
  ...validateCalendarSettings,
  ...validateNotificationSettings,
  ...validateThemeSettings,
], UserSettingsController.updateSettings)

// Rotas de widgets
router.patch("/widgets/:widgetId", validateWidgetUpdate, UserSettingsController.updateDashboardWidget)

export default router 