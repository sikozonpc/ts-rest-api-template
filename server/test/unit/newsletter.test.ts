import { ErrorCode } from "../../src/errors/api-error"
import { setupPrisma } from "../../src/orm/setup-test-prisma"
import { confirmSubscriber, createSubscriber } from "../../src/services/newsletter"

describe("newsletter service", () => {
  const prisma = setupPrisma()

  describe("createSubscriber()", () => {
    beforeEach(() => {
      // intercept the prisma client calls
      prisma.$use(async () => {
        return newsletterSubscriber
      })
    })

    const email = "test@mail.com"

    const newsletterSubscriber = {
      email,
      token: "random-token",
      active: false,
      confirmed: false,
      id: "some-id",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it("should fail if not sent an email", async () => {
      const result = await createSubscriber(prisma, email)
      expect(result).toEqual(newsletterSubscriber)
    })

    describe("confirmSubscriber()", () => {
      beforeEach(() => {
        // intercept the prisma client calls
        prisma.$use(async () => {
          return newsletterSubscriber
        })
      })

      const email = "test@mail.com"
      const token = "some-token"

      const newsletterSubscriber = {
        email,
        token: "random-token",
        active: false,
        confirmed: false,
        id: "some-id",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      it("should throw if the subscriber is not found", async () => {
        try {
          await confirmSubscriber(prisma, email, token)
          fail("should throw when the subscriber is not found")
        } catch (error: unknown) {
          if (!(error instanceof ErrorCode)) {
            throw new Error("unexpected error found: " + String(error))
          }

          expect(error.code).toEqual("ERR-001")
        }
      })
    })
  })
})
