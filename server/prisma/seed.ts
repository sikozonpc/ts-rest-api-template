import { PrismaClient, Prisma } from "@prisma/client"

function makeRandomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890"
  let string = ""
  for (let ii = 0; ii < 15; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)]
  }
  return string + "@mail.com"
}

const prisma = new PrismaClient()

const newsletterSubscribersData: Prisma.NewsletterSubscriberCreateInput[] = [
  {
    active: true,
    confirmed: false,
    email: makeRandomEmail(),
    token: "",
  },
  {
    active: true,
    confirmed: false,
    email: makeRandomEmail(),
    token: "",
  },
  {
    active: true,
    confirmed: false,
    email: makeRandomEmail(),
    token: "",
  },
  {
    active: true,
    confirmed: true,
    email: makeRandomEmail(),
    token: "some-token-123",
  },
]

async function init() {
  console.log("Start seeding...")
  for (const data of newsletterSubscribersData) {
    const subscriber = await prisma.newsletterSubscriber.create({ data })
    console.log(`Created "newsletterSubscriber" with id: ${subscriber.id}`)
  }
  console.log("Seeding has finished successfully!")
}

init()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
