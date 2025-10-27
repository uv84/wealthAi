## Wealth AI (Next.js + Prisma)

An opinionated personal finance app built with Next.js 15, React 19, Prisma, Clerk, Tailwind CSS, and Inngest. It supports accounts, transactions, budgets, recurring transactions, background jobs, and email notifications.

### Features

- Next.js App Router with Turbopack
- TypeScript (strict), ESLint (Next core-web-vitals)
- Prisma ORM (PostgreSQL) with connection pooling-friendly client reuse
- Clerk authentication and protected routes via middleware
- Arcjet rate limiting and bot protection
- Email via Resend and React Email components
- Background jobs and cron with Inngest
- Tailwind CSS v4 UI with Radix primitives

## Getting started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (local or managed)

### 1) Configure environment variables

Create an `.env` file at the project root (use `.env.example` as a reference):

- DATABASE_URL: PostgreSQL connection string
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY: Clerk keys
- ARCJET_KEY: Arcjet project key
- RESEND_API_KEY: Resend email API key
- GEMINI_API_KEY: Google Generative AI API key

Example (see `.env.example` for a template):

```
DATABASE_URL=postgresql://user:password@localhost:5432/wealth?schema=public
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
ARCJET_KEY=aj_live_...
RESEND_API_KEY=re_...
GEMINI_API_KEY=AIza...
```

### 2) Install dependencies

```
npm install
```

### 3) Prisma setup

- Generate Prisma Client:
	- `npx prisma generate`
- Run migrations to create schema:
	- `npx prisma migrate dev --name init`

Optional: open studio to inspect data
- `npx prisma studio`

### 4) Start the dev server

```
npm run dev
```

The app will be available at http://localhost:3000

## Data seeding

There’s a convenience endpoint to generate sample transactions:

- Start the dev server, then hit: `GET /api/seed`
- It uses hard-coded IDs for a sample `ACCOUNT_ID` and `USER_ID` in `src/actions/seed.ts`.
	- Update those constants to match records in your database if you haven’t created them yet.

## Background jobs (Inngest)

- Inngest functions are defined in `src/lib/inngest/function.js` and served via `src/app/api/inngest/route.ts`.
- Scheduled jobs (cron) include:
	- Recurring transactions processing (daily)
	- Monthly report generation (monthly)
	- Budget alerts (every 6 hours)
- Locally, these run when the API route is invoked; in production, configure Inngest to call your `/api/inngest` endpoint or run an Inngest dev server.

## Auth and middleware

- Clerk is used for auth. Protected routes are matched in `src/middleware.ts` for `/dashboard`, `/account`, `/transaction`.
- Arcjet middleware provides bot protection and shielding ahead of Clerk checks.

## Scripts

- `npm run dev` — start the dev server (Turbopack)
- `npm run build` — production build
- `npm start` — start the production server
- `npm run lint` — run ESLint





## Tech stack

- Next.js 15, React 19, TypeScript 5
- Prisma and PostgreSQL
- Clerk, Arcjet
- Resend + React Email
- Tailwind CSS 4, Radix UI

## Quality gates

The project is configured for strict type checking and linting.

- TypeScript: `npx tsc --noEmit` → PASS
- ESLint: `npm run lint` (flat config, Next core-web-vitals) → PASS
- Production build: `npm run build` → PASS

If you see environment-related errors, ensure your `.env` is complete and that the database is reachable.

## Troubleshooting

- Prisma: If migrations fail, verify `DATABASE_URL` and PostgreSQL permissions. Re-run `npx prisma migrate dev`.
- Clerk: Ensure both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set. Log in is required for protected pages.
- Emails: Set `RESEND_API_KEY`; messages are sent from `onboarding@resend.dev` during development.
- Inngest: Cron jobs are registered in code; to run on a schedule, configure an external trigger or Inngest dev tooling to call `/api/inngest`.
- Arcjet: Use a valid `ARCJET_KEY` or comment out Arcjet usage during local testing if needed.

## License

Proprietary. All rights reserved.

