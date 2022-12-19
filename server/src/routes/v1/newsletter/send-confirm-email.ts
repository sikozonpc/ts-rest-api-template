import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import HttpStatus from "http-status"
import { logger } from "../../../logger"

export const sendConfirmEmailHandler = (prisma: PrismaClient) => async (request: Request, response: Response) => {
  try {
    console.log(prisma)
    return response.status(HttpStatus.NOT_IMPLEMENTED).send()
  } catch (error: unknown) {
    logger.error(error)

    throw new Error(String(error))
  }
}