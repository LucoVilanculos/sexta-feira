import "dotenv/config"
import { createApp } from "./config/app"

const app = createApp()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}
🔧 Ambiente: ${process.env.NODE_ENV || "development"}
🔑 API Version: ${process.env.npm_package_version || "1.0.0"}
  `)
})

export default app
