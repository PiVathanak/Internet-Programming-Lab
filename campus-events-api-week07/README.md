# Week 7 practice: a database with Prisma and PostgreSQL

The week 6 API, moving its data from memory into PostgreSQL.

Requires Node 24 LTS (npm 11) and PostgreSQL (Docker is the easy way).

```bash
cp .env.example .env         # then edit DATABASE_URL if needed
docker compose up -d         # PostgreSQL on localhost:5432 (skip if you run it yourself)
npm install
```

Without Docker, create the two databases yourself:
`CREATE DATABASE campus_events;` and `CREATE DATABASE campus_events_test;`

- **A** `prisma/schema.prisma`: add the Booking model, then
  `npx prisma migrate dev --name init` and `npx prisma db seed`
- **B** `src/events/events.service.ts`: create, update, delete with Prisma
- **C** `src/bookings/bookings.service.ts`: bookings in a transaction, safe when two students book the last seat

```bash
npm run start:dev            # http://localhost:3000
npm run test:e2e             # 17 HTTP tests against the campus_events_test database
npx prisma studio            # browse the data in the browser
```

You are done when `npm run test:e2e` passes and `npm run build` shows no errors.
