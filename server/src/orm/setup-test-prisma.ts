import { PrismaClient } from "@prisma/client"

export const setupPrisma = () => {
  const prisma = new PrismaClient()

  afterAll(async () => {
    await prisma.$disconnect()
  })

  return prisma
}