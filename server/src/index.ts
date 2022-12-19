import { createServer } from "./server"
import { config } from "./config"
import { logger } from "./logger"
import { PrismaClient } from "@prisma/client"

const { port } = config

const prisma = new PrismaClient()

const server = createServer({ prisma })
  .listen(config.port, () => {
    logger.info(`🚀 Server ready at: http://localhost:${port}`)
    logger.info(`${config.databaseUrl}`)
  })

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed")
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: Error) => {
  logger.error(error)
  exitHandler()
}

process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

process.on("SIGTERM", () => {
  logger.info("SIGTERM received")
  if (server) {
    server.close()
  }
})