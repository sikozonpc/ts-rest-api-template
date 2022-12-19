import express, { Express, Response, Request } from "express"
import { createNewsletterRouter } from "./routes/v1"
import { PrismaClient } from "@prisma/client"

const errorHandler = (err: any, req: Request, res: Response) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message
  })
}
interface CreateServerParams {
  prisma: PrismaClient
}

// the server singleton
let server: Express | null = null

export const createServer = ({ prisma }: CreateServerParams): Express => {
  if (server) return server

  server = express()

  // middleware setup
  server.use(express.json())
  server.use(express.urlencoded({ extended: true }))

  server.use("/v1", createNewsletterRouter(prisma))

  server.use((req, res, next) => {
    next(new Error("Not found"))
  })

  server.use(errorHandler)

  return server
}