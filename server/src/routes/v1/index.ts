import { PrismaClient } from "@prisma/client";
import express from "express";
import { confirmEmailHandler } from "./newsletter/confirm-email";
import { sendConfirmEmailHandler } from "./newsletter/send-confirm-email";
import { signupHandler } from "./newsletter/signup";

export const createNewsletterRouter = (
  prisma: PrismaClient,
) => {
  const newsletterRouter = express.Router()

  newsletterRouter.post("/newsletter/signup", signupHandler(prisma))
  newsletterRouter.post("/newsletter/send-confirm-email", sendConfirmEmailHandler(prisma))
  newsletterRouter.post("/newsletter/confirm-email", confirmEmailHandler(prisma))

  return newsletterRouter
}
