export const config = {
  port: process.env.PORT || 8080,
  env: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
}
