
## Getting started

### Install depedencies

```bash
npm install typescript -g
npm i
```

### Seed the database

```bash
npm run prisma:seed
```

### Start the service

```bash
npm run dev
```


### Run integration tests
```bash
npm run docker:integration-tests db_url="..."
```

## notes

1. Install test library "npm install --save-dev jest ts-jest @types/jest"