# FinLedger Frontend (Next.js 14)

Y2K retro-tech personal finance dashboard UI that connects to the existing VaulTex / FinLedger Express REST API.

## Pages (what you’ll see)

- **`/login`**: Full-screen access terminal card, Orbitron header **“FINLEDGER // ACCESS TERMINAL”**, CRT scanlines overlay.
- **`/register`**: Same terminal aesthetic, new account creation.
- **`/dashboard`**:
  - 3 LCD stat cards with CountUp: **TOTAL INCOME** (mint), **TOTAL EXPENSES** (danger), **NET BALANCE** (gold/danger swap).
  - Charts: **Income vs Expense** bar, **Spend by Category** pie, **12-month Trend** line.
- **`/records`**:
  - Filter bar: income/expense toggle pills, category dropdown, date range, client-side search.
  - Records table with mint/danger amount color and hover left accent.
  - **NEW ENTRY** button (ADMIN only).
- **`/records/new`**:
  - Zod-validated form and **COMMIT ENTRY** action.
  - Custom toast banner on success (no external toast library).
- **`/users`** (ADMIN only):
  - User table, role badges, inline role change dropdown (PATCH on change).

## Design decisions

- **Y2K retro-tech aesthetic is deliberate**: hard-coded palette, electric borders, glow shadows, CRT scanlines, and monospace UI to feel like a 2001 finance terminal.
- **Orbitron + IBM Plex Mono**: display font for headings (all-caps, wide tracking) with monospace body to keep the “terminal” tone consistent.
- **CountUp for dashboard stats**: makes the “data readout” feel alive on mount, like an old-school dashboard boot sequence.

## Environment

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running locally

1. **Start the backend API** (in repo root):

```bash
npm install
npm run dev
```

2. **Start the frontend** (in `frontend/`):

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Then open `http://localhost:3001` (or whatever port Next picks).

## API dependency

This frontend requires the FinLedger/VaulTex backend running locally (default `http://localhost:3000`), and calls:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard/summary`
- `GET /api/dashboard/by-category`
- `GET /api/dashboard/monthly`
- `GET /api/records`
- `POST /api/records` (ADMIN only)
- `DELETE /api/records/:id` (ADMIN only)
- `GET /api/users` (ADMIN only)
- `PATCH /api/users/:id/role` (ADMIN only)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
