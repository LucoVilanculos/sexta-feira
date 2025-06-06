import "dotenv/config"
import { createApp } from "./config/app"
import prisma from "./config/database"

// Garantir que temos a URL do banco de dados
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL não está definida no arquivo .env')
  process.exit(1)
}

async function connectDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Base de dados conectada com sucesso')
  } catch (error) {
    console.error('❌ Erro ao conectar com a base de dados:', error)
    process.exit(1)
  }
}

async function startServer() {
  try {
    await connectDatabase()

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

    // Gerenciamento de desligamento gracioso
    process.on('SIGTERM', async () => {
      console.log('Recebido SIGTERM. Encerrando...')
      await prisma.$disconnect()
      process.exit(0)
    })

    process.on('SIGINT', async () => {
      console.log('Recebido SIGINT. Encerrando...')
      await prisma.$disconnect()
      process.exit(0)
    })

    return app
  } catch (error) {
    console.error('❌ Error starting server:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

startServer().catch(async (error) => {
  console.error('❌ Fatal error:', error)
  await prisma.$disconnect()
  process.exit(1)
})
