import { PrismaClient } from "@prisma/client"
import request from "supertest"
import HttpStatus from "http-status"
import { createServer } from "../../src/server"

describe("confirm-email", () => {
  const prisma = new PrismaClient()
  const server = createServer({ prisma }).listen(80)

  afterAll(async () => {
    server.close()

    // cleanup whole database after it's finished
    await prisma.newsletterSubscriber.deleteMany()

    await prisma.$disconnect()
  })

  beforeEach(async () => {
    const all = await prisma.newsletterSubscriber.findMany();
    console.log({ all });
    // cleanup
    await prisma.newsletterSubscriber.deleteMany()
  })

  it("should return 400 if not sent an email in the query params", async () => {
    await request(server)
      .post("/v1/newsletter/confirm-email")
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("should return 400 if not sent a token in the query params", async () => {
    await request(server)
      .post("/v1/newsletter/confirm-email?email=valid@mail.com")
      .send()
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("should return 404 if the email and token don't belong to one another", async () => {
    const email = "valid@mail.com"
    const token = "valid-token-123"
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        active: false,
        confirmed: false,
        token,
      },
    })

    await request(server)
      .post(`/v1/newsletter/confirm-email?email=${email}&token=invalid-token`)
      .send()
      .expect("Content-Type", /json/)
      .expect(HttpStatus.NOT_FOUND)
  })

  it("should return 200 and update the `confirm` status of the subscriber", async () => {
    const email = "valid@mail.com"
    const token = "valid-token-123"
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        active: false,
        confirmed: false,
        token,
      },
    })

    await request(server)
      .post(`/v1/newsletter/confirm-email?email=${email}&token=${token}`)
      .send()
      .expect(HttpStatus.OK)

    const udpatedSubscriber = await prisma.newsletterSubscriber.findFirst({
      where: {
        email,
      },
    })

    if (!udpatedSubscriber) {
      throw new Error("Subscriber was not found after it was confirmed")
    }

    expect(udpatedSubscriber?.confirmed).toEqual(true)
    expect(udpatedSubscriber?.token).toEqual("")
  })
})
