import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import HttpStatus from "http-status"
import { ErrorCode } from "../../../errors/api-error"
import { logger } from "../../../logger"
import { confirmSubscriber } from "../../../services/newsletter"
import { isEmailValid } from "../../../util/email"

interface ConfirmEmailQueryParams {
  token?: string
  email?: string
}

export const confirmEmailHandler = (prisma: PrismaClient) => async (request: Request, response: Response) => {
  try {
    // 1. get the email from the request
    const { email = "", token = "" } = request.query as ConfirmEmailQueryParams;

    // 2. validate the email
    if (!email) {
      return response.status(HttpStatus.BAD_REQUEST)
        .json(new ErrorCode("ERR-003", "email"))
    }
    if (!isEmailValid(email)) {
      return response.status(HttpStatus.BAD_REQUEST)
        .json(new ErrorCode("ERR-004", "email"))
    }

    // 3. Validate the token
    if (!token) {
      return response.status(HttpStatus.BAD_REQUEST)
        .json(new ErrorCode("ERR-003", "token"))
    }

    // 4. Find and Confirm the subscriber
    await confirmSubscriber(prisma, email, token)

    return response.status(HttpStatus.OK).send()
  } catch (error: unknown) {
    if (!(error instanceof ErrorCode)) {
      logger.error("confirmEmailHandler: ", error)
      throw new Error(String(error))
    }

    if (error.code === "ERR-001") {
      return response.status(HttpStatus.NOT_FOUND).json(error.message)
    }
    if (["ERR-003", "ERR-004"].includes(error.code)) {
      return response.status(HttpStatus.BAD_REQUEST).json(error.message)
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json("something went wrong")
  }
}