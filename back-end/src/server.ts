import "dotenv/config"
import { createApp } from "./config/app"
import prisma from "./config/database"

async function startServer() {
  try {
    // Teste a conexão com o banco de dados
    await prisma.$connect()
    console.log('✅ Database connected successfully')

const app = createApp()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`
🚀 Servidor rodando na porta ${PORT}
📱 Frontend: ${process.env.FRONTEND_URL || "http://localhost:3000"}
🔧 Ambiente: ${process.env.NODE_ENV || "development"}
🔑 API Version: ${process.env.npm_package_version || "1.0.0"}
🗄️ Database: Connected
  `)
})

    return app
  } catch (error) {
    console.error('❌ Error starting server:', error)
    process.exit(1)
  }
}

const app = startServer()
export default app
