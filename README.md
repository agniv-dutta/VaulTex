# VaulTex

VaulTex is a production-ready REST API backend for finance data processing with role-based access control.

It is built with Node.js, Express, TypeScript, Prisma, and SQLite, with a layered architecture:

routes -> controllers -> services -> repositories -> database

## 1) What This Service Does

- Manages users and role assignments (VIEWER, ANALYST, ADMIN).
- Stores financial records (income and expenses) with soft delete.
- Provides analytics dashboards (summary, category totals, monthly trends).
- Uses JWT auth and server-side RBAC checks on protected endpoints.

## 2) Architecture and Design Choices

### Layering

- Routes: endpoint definitions and middleware chains.
- Controllers: thin request/response handlers.
- Services: business logic and authorization-aware behavior.
- Repositories: Prisma data-access implementation.
- Database: SQLite via Prisma schema and migrations.

### Why SQLite

SQLite keeps local setup friction low and removes external database dependencies.
It is great for local development, demos, and low-throughput environments.

### Why JWT Access Tokens

JWT allows stateless API authentication and simple horizontal scaling.
This implementation intentionally avoids refresh tokens for simplicity.

### Why Soft Delete

Records are never physically removed by default delete operations.
Instead, isDeleted=true is used for auditability and safer data handling.

## 3) Tech Stack

- Runtime: Node.js + TypeScript (strict mode)
- Framework: Express.js
- ORM: Prisma
- Database: SQLite
- Auth: jsonwebtoken
- Validation: Zod
- Security and Ops: helmet, cors, express-rate-limit, morgan
- Testing: Vitest + Supertest

## 4) Project Structure

src/
  config/
  middleware/
  modules/
    auth/
    users/
    records/
    dashboard/
  lib/
  types/
  schemas/
  app.ts
  server.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/

## 5) Prerequisites

- Node.js 20+
- npm 10+

## 6) Quick Start Commands

### Windows PowerShell

1. Install dependencies

```powershell
npm install
```

2. Create env file

```powershell
Copy-Item .env.example .env
```

3. Generate Prisma client

```powershell
npm run prisma:generate
```

4. Apply migrations (development DB)

```powershell
$env:DATABASE_URL='file:./dev.db'; npx prisma migrate deploy
```

5. Seed data

```powershell
$env:DATABASE_URL='file:./dev.db'; npm run db:seed
```

6. Start dev server

```powershell
$env:DATABASE_URL='file:./dev.db'; $env:JWT_SECRET='replace-with-a-long-random-secret-for-local-dev-12345'; npm run dev
```

7. Run tests

```powershell
npm test
```

8. Build for production

```powershell
npm run build
```

## 7) Environment Variables

Defined in .env.example:

- NODE_ENV: development | test | production
- PORT: HTTP server port
- DATABASE_URL: SQLite URL, for example file:./dev.db
- JWT_SECRET: signing secret (must be long and random)
- JWT_EXPIRES_IN: token expiry, for example 1h
- RATE_LIMIT_WINDOW_MS: throttling window in ms
- RATE_LIMIT_MAX: max requests per IP per window

## 8) Data Model

### User

- id: uuid
- name: string
- email: string, unique
- password: bcrypt hash
- role: VIEWER | ANALYST | ADMIN
- createdAt, updatedAt

### FinancialRecord

- id: uuid
- userId: foreign key to User
- amount: positive decimal value
- type: INCOME | EXPENSE
- category: string
- date: ISO date
- notes: optional string
- isDeleted: boolean soft-delete marker
- createdAt, updatedAt

## 9) Authentication and RBAC

### JWT

- Register and login return an access token.
- Payload includes: userId, email, role.
- Protected routes require Authorization: Bearer <token>.

### Role Permissions

| Endpoint Group | VIEWER | ANALYST | ADMIN |
| --- | --- | --- | --- |
| GET /api/records | Own records only | All records | All records |
| GET /api/records/:id | Own records only | Any record | Any record |
| POST/PATCH/DELETE /api/records | No | No | Yes |
| GET /api/dashboard/* | Own data | Global data | Global data |
| /api/users/* | No | No | Yes |

RBAC is enforced on the server using middleware. The server never trusts client-side role claims outside the signed token.

## 10) API Reference

Base URL for local dev:

http://localhost:3000

### Health

GET /health

Response:

```json
{
  "status": "ok",
  "service": "VaulTex"
}
```

### Auth

#### POST /api/auth/register

Creates a new user (default role: VIEWER) and returns JWT.

Request:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response 201:

```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "VIEWER",
    "createdAt": "2026-04-02T12:00:00.000Z",
    "updatedAt": "2026-04-02T12:00:00.000Z"
  }
}
```

#### POST /api/auth/login

Validates credentials and returns JWT.

Request:

```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response 200: same shape as register.

### Users (ADMIN only)

#### GET /api/users

Lists all users.

Response 200:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@vaultex.local",
      "role": "ADMIN",
      "createdAt": "2026-04-02T12:00:00.000Z",
      "updatedAt": "2026-04-02T12:00:00.000Z"
    }
  ]
}
```

#### GET /api/users/:id

Returns one user by id.

#### PATCH /api/users/:id/role

Changes a user role.

Request:

```json
{
  "role": "ANALYST"
}
```

### Financial Records

#### POST /api/records (ADMIN only)

Creates a financial record for any user.

Request:

```json
{
  "userId": "uuid",
  "amount": 2500,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-01-01",
  "notes": "January payroll"
}
```

Response 201:

```json
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "amount": 2500,
    "type": "INCOME",
    "category": "Salary",
    "date": "2024-01-01T00:00:00.000Z",
    "notes": "January payroll",
    "isDeleted": false,
    "createdAt": "2026-04-02T12:00:00.000Z",
    "updatedAt": "2026-04-02T12:00:00.000Z"
  }
}
```

#### GET /api/records

- VIEWER: only own records
- ANALYST and ADMIN: all records

Supported query params:

- type=INCOME|EXPENSE
- category=Salary
- startDate=2024-01-01
- endDate=2024-12-31
- page=1
- limit=20

Response 200:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 1
  }
}
```

#### GET /api/records/:id

Gets a single record if caller is allowed to view it.

#### PATCH /api/records/:id (ADMIN only)

Updates one record. Partial updates are allowed.

Example request:

```json
{
  "amount": 2750,
  "notes": "Adjusted amount"
}
```

#### DELETE /api/records/:id (ADMIN only)

Soft deletes the record by setting isDeleted=true.

### Dashboard / Analytics

#### GET /api/dashboard/summary

Returns totalIncome, totalExpenses, and netBalance.

VIEWER gets own data only. ANALYST and ADMIN get system-wide data.

Response 200:

```json
{
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 1200,
    "netBalance": 3800
  }
}
```

#### GET /api/dashboard/by-category

Returns category-level aggregation.

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
