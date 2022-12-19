import crypto from "crypto"

export const createRandomToken = (): string => crypto.randomBytes(64).toString("hex")