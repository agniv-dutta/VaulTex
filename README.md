<div align="center">

<h1>VaulTex</h1>

<p>
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-DB-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="React Query" src="https://img.shields.io/badge/React_Query-Data%20Fetching-FF4154?style=for-the-badge&logo=tanstack&logoColor=white" />
  <img alt="Zustand" src="https://img.shields.io/badge/Zustand-State-FFB347?style=for-the-badge" />
  <img alt="Vitest" src="https://img.shields.io/badge/Vitest-Testing-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" />
</p>

</div>

VaulTex is a full-stack personal finance platform with a TypeScript/Express/Prisma backend and a Next.js dashboard frontend. It includes JWT authentication, server-side role-based access control, record management, analytics endpoints, seeded demo data, and a polished client UI for login, records, and dashboard workflows.

## Overview

The project is split into two apps:

- Backend API on `http://localhost:3000`
- Frontend app on `http://localhost:3001`

The backend exposes authenticated finance endpoints and the frontend consumes them through Axios, React Query, and Zustand.

## Stack

- Backend: Node.js, TypeScript, Express 5, Prisma, SQLite, JWT, Zod, bcryptjs
- Frontend: Next.js 14, React 18, React Query, Zustand, React Hook Form, Zod, Recharts
- Tooling: Vitest, Supertest, tsx, ts-node, ESLint, Prisma migrations

## Architecture

The backend uses a layered flow:

routes -> middleware -> controllers -> services -> repositories -> database

That separation keeps validation, authorization, business logic, and persistence isolated.

## Features

- Email/password authentication with JWT access tokens
- Role-based access control for `VIEWER`, `ANALYST`, and `ADMIN`
- User administration endpoints for admins
- Financial records with filtering, pagination, updates, and soft delete
- Dashboard analytics by summary, category, and month
- Seeded demo data for immediate local testing
- Frontend route protection and client-side auth persistence

## Demo Accounts

The seed script creates these users:

- Admin: `admin@vaultex.dev` / `Admin@123`
- Analyst: `analyst@vaultex.dev` / `Analyst@123`
- Viewer: `viewer@vaultex.dev` / `Viewer@123`

The seed also inserts 40 financial records spread across the last 12 months.

## Repository Layout

```text
src/
  config/
  lib/
  middleware/
  modules/
    auth/
    dashboard/
    records/
    users/
  schemas/
  types/
  app.ts
  server.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
frontend/
  app/
  components/
  hooks/
  lib/
  store/
  types/
tests/
postman/
```

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer

## Setup

### 1. Install dependencies

```powershell
npm install
cd frontend
npm install
cd ..
```

### 2. Configure environment files

Copy the backend example file if needed:

```powershell
Copy-Item .env.example .env
```

For the frontend, ensure `frontend/.env.local` contains:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Generate and migrate Prisma

```powershell
npm run prisma:generate
npm run db:migrate
```

### 4. Seed demo data

```powershell
npm run seed
```

### 5. Start both apps

Backend:

```powershell
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

### 6. Run tests

```powershell
npm test
```

### 7. Build for production

```powershell
npm run build
cd frontend
npm run build
```

## Environment Variables

Backend `.env` values:

- `NODE_ENV` - `development`, `test`, or `production`
- `PORT` - backend HTTP port, default `3000`
- `DATABASE_URL` - Prisma SQLite URL, for example `file:./dev.db`
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - token lifetime, for example `1h`
- `RATE_LIMIT_WINDOW_MS` - throttle window in milliseconds
- `RATE_LIMIT_MAX` - request limit per window

Frontend `.env.local` values:

- `NEXT_PUBLIC_API_URL` - backend base URL, for example `http://localhost:3000`

## Authentication

Successful login and registration return this shape:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@vaultex.dev",
    "role": "ADMIN",
    "createdAt": "2026-04-06T00:00:00.000Z",
    "updatedAt": "2026-04-06T00:00:00.000Z"
  }
}
```

Protected requests must send:

```http
Authorization: Bearer <token>
```

## Role Model

| Endpoint Group | VIEWER | ANALYST | ADMIN |
| --- | --- | --- | --- |
| `GET /api/records` | Own records | All records | All records |
| `GET /api/records/:id` | Own record | Any record | Any record |
| `POST /api/records` | No | No | Yes |
| `PATCH /api/records/:id` | No | No | Yes |
| `DELETE /api/records/:id` | No | No | Yes |
| `GET /api/dashboard/*` | Own data | Global data | Global data |
| `GET /api/users/*` | No | No | Yes |

## Frontend Routes

- `/` - redirects to `/dashboard` when authenticated, otherwise `/login`
- `/login` - sign in page
- `/register` - sign up page
- `/dashboard` - main analytics view
- `/records` - records table, filters, pagination, delete controls for admins
- `/records/new` - admin-only create record form
- `/users` - admin-only user management view

## API Reference

### Endpoint Index

| Area | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id/role` |
| Records | `POST /api/records`, `GET /api/records`, `GET /api/records/:id`, `PATCH /api/records/:id`, `DELETE /api/records/:id` |
| Dashboard | `GET /api/dashboard/summary`, `GET /api/dashboard/by-category`, `GET /api/dashboard/monthly` |

Base URL:

```text
http://localhost:3000
```

### Health

#### `GET /health`

Public health check.

Response:

```json
{
  "status": "ok",
  "service": "VaulTex"
}
```

### Auth

#### `POST /api/auth/register`

Creates a new `VIEWER` user and returns a token.

Request:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response `201`:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "VIEWER",
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### `POST /api/auth/login`

Authenticates an existing user and returns the same response shape as register.

Request:

```json
{
  "email": "admin@vaultex.dev",
  "password": "Admin@123"
}
```

Response `200`:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@vaultex.dev",
    "role": "ADMIN",
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

### Users

All user routes require `ADMIN`.

#### `GET /api/users`

Lists all users.

Response `200`:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@vaultex.dev",
      "role": "ADMIN",
      "createdAt": "2026-04-06T12:00:00.000Z",
      "updatedAt": "2026-04-06T12:00:00.000Z"
    }
  ]
}
```

#### `GET /api/users/:id`

Returns a single user by id.

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "name": "Analyst User",
    "email": "analyst@vaultex.dev",
    "role": "ANALYST",
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### `PATCH /api/users/:id/role`

Updates a user role.

Request:

```json
{
  "role": "ANALYST"
}
```

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "name": "Viewer User",
    "email": "viewer@vaultex.dev",
    "role": "ANALYST",
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

### Records

All record routes require authentication.

#### `POST /api/records`

Admin-only create endpoint.

Request:

```json
{
  "userId": "uuid",
  "amount": 2500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "April payroll"
}
```

Response `201`:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 2500,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "April payroll",
    "isDeleted": false,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### `GET /api/records`

Returns paginated records.

Query parameters:

- `type=INCOME|EXPENSE`
- `category=Salary`
- `startDate=2026-01-01`
- `endDate=2026-12-31`
- `page=1`
- `limit=20`

Response `200`:

```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "amount": 1200,
      "type": "EXPENSE",
      "category": "Rent",
      "date": "2026-04-01T00:00:00.000Z",
      "notes": "April rent",
      "isDeleted": false,
      "createdAt": "2026-04-06T12:00:00.000Z",
      "updatedAt": "2026-04-06T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 40,
    "totalPages": 2
  }
}
```

#### `GET /api/records/:id`

Returns a single record if the authenticated user is allowed to view it.

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 145.5,
    "type": "EXPENSE",
    "category": "Transport",
    "date": "2026-03-15T00:00:00.000Z",
    "notes": null,
    "isDeleted": false,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### `PATCH /api/records/:id`

Admin-only partial update endpoint.

Request:

```json
{
  "amount": 2750,
  "notes": "Adjusted amount"
}
```

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 2750,
    "type": "INCOME",
    "category": "Salary",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "Adjusted amount",
    "isDeleted": false,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

#### `DELETE /api/records/:id`

Admin-only soft delete. The record is retained and marked deleted.

Response `200`:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 1200,
    "type": "EXPENSE",
    "category": "Rent",
    "date": "2026-04-01T00:00:00.000Z",
    "notes": "April rent",
    "isDeleted": true,
    "createdAt": "2026-04-06T12:00:00.000Z",
    "updatedAt": "2026-04-06T12:00:00.000Z"
  }
}
```

### Dashboard

All dashboard routes require authentication.

#### `GET /api/dashboard/summary`

Returns total income, total expenses, and net balance.

Response `200`:

```json
{
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 1200,
    "netBalance": 3800
  }
}
```

#### `GET /api/dashboard/by-category`

Returns category-level totals.

Response `200`:

```json
{
  "data": [
    {
      "category": "Salary",
      "income": 5000,
      "expense": 0,
      "total": 5000
    }
  ]
}
```

#### `GET /api/dashboard/monthly`

Returns monthly trend data.

Response `200`:

```json
{
  "data": [
    {
      "month": "2026-04",
      "income": 5000,
      "expense": 1200,
      "total": 3800
    }
  ]
}
```

## Postman Collection

The repository includes an importable Postman collection at [postman/VaulTex.postman_collection.json](postman/VaulTex.postman_collection.json).

Collection variables:

- `baseUrl` - defaults to `http://localhost:3000`
- `token` - populated after register or login
- `userId` - populated after register or login
- `recordId` - populated after creating a record
- `seedAdminEmail` - defaults to `admin@vaultex.local`
- `seedAdminPassword` - defaults to `Password123!`

Collection folders:

- Health
- Auth
- Users (Admin)
- Records
- Dashboard

The collection is configured to:

- log in with seeded admin credentials
- store the JWT in `{{token}}`
- reuse `{{token}}` for protected requests
- capture `userId` and `recordId` for chained requests

## Swagger / OpenAPI Note

This repository does not currently ship a generated Swagger UI route.
If you want an OpenAPI document later, the current endpoint structure is already organized so it can be exported cleanly from the route list above.

## Data Model

### User

- `id` - UUID primary key
- `name` - display name
- `email` - unique email address
- `password` - bcrypt hash stored only in the database
- `role` - `VIEWER`, `ANALYST`, or `ADMIN`
- `createdAt`, `updatedAt`

### FinancialRecord

- `id` - UUID primary key
- `userId` - owner of the record
- `amount` - positive numeric amount
- `type` - `INCOME` or `EXPENSE`
- `category` - category label
- `date` - ISO date string
- `notes` - optional notes
- `isDeleted` - soft delete flag
- `createdAt`, `updatedAt`

## Testing

The backend test suite uses SQLite and runs with Vitest + Supertest.

```powershell
npm test
```

For local integration tests, the workspace note is to use a dedicated test database and keep Vitest file parallelism disabled for SQLite stability.

## Notes

- The backend listens on port `3000` by default.
- The frontend listens on port `3001` by default.
- The frontend stores auth state in both Zustand and localStorage using `vaultex_token` and `vaultex_user`.
- Authenticated users are redirected to `/dashboard`.
- Admin-only create/delete flows are enforced by the backend, not the client UI.

## License

No license has been specified for this repository.

Response example:

```json
{
  "data": [
    {
      "category": "Salary",
      "income": 5000,
      "expense": 0,
      "total": 5000
    }
  ]
}
```

#### GET /api/dashboard/monthly

Returns month buckets for the last 12 months.

Response example:

```json
{
  "data": [
    {
      "month": "2025-05",
      "income": 1200,
      "expense": 300,
      "total": 1500
    }
  ]
}
```

## 11) Validation Rules

- Email must be valid format.
- Password must be present; register requires minimum length.
- amount must be positive.
- type must be INCOME or EXPENSE.
- date must be parseable ISO date string.
- UUID parameters must be valid UUIDs.

Validation failures return HTTP 400 with structured details.

## 12) Error Contract

General error format:

```json
{
  "error": "Validation failed",
  "message": "Validation failed",
  "statusCode": 400,
  "details": []
}
```

Common status codes:

- 400: validation failure
- 401: missing/invalid token
- 403: insufficient role
- 404: resource not found
- 409: unique constraint conflict
- 500: unexpected server error (no stack trace leaked in production)

## 13) Testing

- Integration tests run with Vitest + Supertest.
- Test database is initialized via migrations in tests/setup.ts.
- Current suite covers auth, RBAC on records, dashboard summary, and admin CRUD flows.

Run:

```bash
npm test
```

## 14) Seeded Demo Accounts

After seeding development DB:

- admin@vaultex.local
- analyst@vaultex.local
- viewer@vaultex.local

Password for all seeded users:

Password123!

## 15) Production Notes

- Rotate JWT_SECRET and keep it in secure secret storage.
- Replace SQLite with a managed database for high-concurrency production workloads.
- Add refresh token flow and token revocation if required by your threat model.
- Add request ID tracing and structured logs for observability.

## 16) Tradeoffs and Future Enhancements

Current tradeoffs:

- SQLite for simple setup over high write concurrency.
- Stateless JWT without refresh token complexity.
- Soft-delete for auditability over hard-delete simplicity.

Suggested next enhancements:

- OpenAPI/Swagger docs generation
- Refresh token and logout flow
- Export endpoints (CSV/JSON) for analytics
- Background jobs for report generation
