import { PrismaClient } from "@prisma/client"
import request from "supertest"
import HttpStatus from "http-status"
import { createServer } from "../../src/server"

describe("signup", () => {
  const prisma = new PrismaClient()
  const server = createServer({ prisma }).listen(80)

  afterAll(async () => {
    server.close()

    // cleanup whole database after it's finished
    await prisma.newsletterSubscriber.deleteMany()

    await prisma.$disconnect()
  })

  beforeEach(async () => {
    // cleanup
    await prisma.newsletterSubscriber.deleteMany()
  })

  it("should return 400 if not sent an email in the body", async () => {
    await request(server)
      .post("/v1/newsletter/signup")
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("should return 400 if the email is invalid", async () => {
    const email = "integration-test@.com"

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.BAD_REQUEST)
  })

  it("should fail if the email is already signed up", async () => {
    const email = "integration-test@mail.com"

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED)

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CONFLICT)
  })

  it("should return 201 if worked", async () => {
    const email = "integration-test@mail.com"

    await request(server)
      .post("/v1/newsletter/signup")
      .send({ email })
      .expect("Content-Type", /json/)
      .expect(HttpStatus.CREATED)
  })
})
