# VaulTex

VaulTex is a finance data processing and access-control API built with Node.js, Express, TypeScript, Prisma, and SQLite.

## Assumptions

- SQLite is used for simplicity and local portability.
- JWT access tokens are stateless; there is no refresh-token flow yet.
- Soft delete is used for financial records so deleted data can still be audited later.
- Passwords are hashed with bcryptjs before storage.
- The API returns JSON only.

## Tech Stack

- Node.js + TypeScript
- Express.js
- Prisma ORM
- SQLite
- JWT via jsonwebtoken
- Validation via Zod
- Testing via Vitest and Supertest

## Setup

1. Install dependencies.

```bash
npm install
```

2. Create your local environment file.

```bash
copy .env.example .env
```

3. Apply the Prisma schema and generate the client.

```bash
npx prisma migrate deploy
npm run prisma:generate
```

For a fresh development database, you can also use:

```bash
npx prisma migrate dev --name init
```

4. Seed sample data.

```bash
npm run db:seed
```

5. Start the API.

```bash
npm run dev
```

## Environment Variables

- `NODE_ENV` - `development`, `test`, or `production`
- `PORT` - HTTP port for the API
- `DATABASE_URL` - SQLite connection string
- `JWT_SECRET` - signing secret for access tokens
- `JWT_EXPIRES_IN` - JWT expiry, for example `1h`
- `RATE_LIMIT_WINDOW_MS` - rate-limit window in milliseconds
- `RATE_LIMIT_MAX` - max requests per window per IP

## Role Permissions

| Role | Permissions |
| --- | --- |
| VIEWER | Read own records, read own dashboard summary |
| ANALYST | VIEWER permissions plus read all records and system-wide dashboard data |
| ADMIN | Full access, including create/update/delete records and manage users |

## API Endpoints

### Auth

`POST /api/auth/register`

Request:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response:

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

`POST /api/auth/login`

Request:

```json
{
  "email": "alice@example.com",
  "password": "Password123!"
}
```

Response: same shape as register.

### Users  
ADMIN only.

`GET /api/users`

`GET /api/users/:id`

`PATCH /api/users/:id/role`

Request:

```json
{
  "role": "ANALYST"
}
```

### Records

`POST /api/records`  
ADMIN only.

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

`GET /api/records`

Query params:

- `type=INCOME|EXPENSE`
- `category=Salary`
- `startDate=2024-01-01`
- `endDate=2024-12-31`
- `page=1`
- `limit=20`

`GET /api/records/:id`

`PATCH /api/records/:id`  
ADMIN only.

`DELETE /api/records/:id`  
ADMIN only, soft delete only.

### Dashboard

`GET /api/dashboard/summary`

Response:

```json
{
  "data": {
    "totalIncome": 5000,
    "totalExpenses": 1200,
    "netBalance": 3800
  }
}
```

`GET /api/dashboard/by-category`

`GET /api/dashboard/monthly`

## Error Handling

The API returns a consistent error shape:

```json
{
  "error": "Validation failed",
  "message": "Validation failed",
  "statusCode": 400,
  "details": []
}
```

Common status codes:

- `400` validation failure
- `401` missing or invalid token
- `403` insufficient role
- `404` resource not found
- `409` duplicate unique value
- `500` unexpected server error

## Tradeoffs

- SQLite keeps the system easy to run locally, but it is not a substitute for a higher-throughput production database.
- JWT access tokens are stateless and simple, but there is no refresh-token or revocation model yet.
- Soft delete improves auditability, but it adds an extra predicate to every record query.

## Notes

- Use `Authorization: Bearer <token>` on protected routes.
- Seed users are created with the password `Password123!`.
- A health check is available at `GET /health`.
