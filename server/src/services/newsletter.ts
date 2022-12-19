import { PrismaClient } from "@prisma/client"
import { ErrorCode } from "../errors/api-error"
import { createRandomToken } from "../util/random"

export const createSubscriber = async (prisma: PrismaClient, email: string) => {
  try {
    const newsletterSubscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        active: false,
        confirmed: false,
        token: createRandomToken(),
      },
    })
    console.log({ newsletterSubscriber })
    return newsletterSubscriber
  } catch (error) {
    throw new ErrorCode("ERR-002", "email")
  }
}

export const confirmSubscriber = async (prisma: PrismaClient, email: string, token: string) => {
  const newsletterSubscriber = await prisma.newsletterSubscriber.findFirst({
    where: {
      email,
      token
    },
  })

  if (!newsletterSubscriber) {
    throw new ErrorCode("ERR-001", "token")
  }

  const updatedSubscriber = await prisma.newsletterSubscriber.update({
    where: { email },
    data: {
      confirmed: true,
      token: "",
    }
  })

  return updatedSubscriber
}
