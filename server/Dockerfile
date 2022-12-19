FROM node:18-slim AS base
  WORKDIR /app
  COPY package*.json ./

# More details on this docker file approach here: https://docs.docker.com/language/nodejs/run-tests/
# Integration tests target build stage
FROM base as test
  RUN npm ci

  COPY . .

  ARG db_url
  ENV DATABASE_URL $db_url

  # Provides precompiled binaries for ARM: https://github.com/prisma/prisma/issues/861
  RUN apt-get update
  RUN apt-get install -y openssl

  RUN npm run test:integration

# Production target build stage
FROM base as prod
  RUN npm ci --production
  COPY . .
  CMD [ "npm", "start" ]