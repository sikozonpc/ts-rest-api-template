import { Request, Response } from "express"
import HttpStatus from "http-status"
import { isEmailValid } from "../../../util/email"
import { logger } from "../../../logger";
import { createSubscriber } from "../../../services/newsletter";
import { PrismaClient } from "@prisma/client";
import { ErrorCode } from "../../../errors/api-error";


interface SignupPayload {
  email?: string;
}

export const signupHandler = (prisma: PrismaClient) => async (request: Request, response: Response) => {
  try {
    // 1. get the email from the request
    const { email = "" } = request.body as SignupPayload;

    // 2. validate the email
    if (!email) {
      return response.status(HttpStatus.BAD_REQUEST)
        .json(new ErrorCode("ERR-003", "email"))
    }
    if (!isEmailValid(email)) {
      return response.status(HttpStatus.BAD_REQUEST)
        .json(new ErrorCode("ERR-004", "email"))
    }

    // 3. create user newsletter_subscriber document
    const newsletterSubscriber = await createSubscriber(prisma, email)

    // 4. publish notification to pub/sub
    logger.info("Published to topic signup")

    return response.status(HttpStatus.CREATED)
      .json(newsletterSubscriber)
  } catch (error: unknown) {
    if (!(error instanceof ErrorCode)) {
      logger.error("signupHandler: ", error)
      throw new Error(String(error))
    }

    if (error.code === "ERR-002") {
      return response.status(HttpStatus.CONFLICT).json(error.message)
    }
    if (["ERR-003", "ERR-004"].includes(error.code)) {
      return response.status(HttpStatus.BAD_REQUEST).json(error.message)
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json("something went wrong")
  }
}