# College Discovery Platform

A full-stack web application for discovering, comparing, and evaluating engineering colleges in India. Built as a focused implementation of four core features with emphasis on performance, data modeling, and production readiness.

## Features

| Feature | Description |
|---------|-------------|
| **College Search** | Filter colleges by name, location, rating, and fees with debounced search |
| **College Detail** | View courses, cutoffs, placements, fees, and campus imagery per college |
| **Compare Colleges** | Side-by-side comparison of two colleges (fees, ratings, placements, courses) |
| **Admission Predictor** | Rank-based admission probability (Safe / Reach / Ambitious) using historical cutoffs |

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4
- **Backend:** Next.js API Routes, Zod validation
- **Database:** PostgreSQL (Neon) with Prisma ORM
- **Deployment:** Vercel

## Architecture

```
Next.js App Router
├── Server Components (homepage data fetching)
├── Client Components (search, compare, predictor)
├── API Routes
│   ├── GET /api/colleges
│   ├── GET /api/colleges/search
│   ├── GET /api/colleges/[id]
│   ├── GET /api/colleges/compare
│   └── GET /api/predictor
├── Service Layer (college, search, predictor)
├── Prisma ORM
└── PostgreSQL (Neon)
```

### Database Models

- **College** — name, location, fees, rating, placements
- **Course** — linked to College (duration, fees)
- **Cutoff** — exam rank data linked to College (indexed for predictor queries)
- **User / SavedCollege** — schema present for future auth (not implemented)

## Local Setup

### Prerequisites

- Node.js 20+
- A Neon PostgreSQL database (or any PostgreSQL instance)

### Installation

```bash
git clone https://github.com/Harini-0111/college-discovery-platform.git
cd college-discovery-platform
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### Database Setup

```bash
npx prisma migrate deploy
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel + Neon)

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set `DATABASE_URL` in Vercel environment variables (use Neon's pooled connection string).
4. Deploy — `postinstall` runs `prisma generate` automatically.
5. After first deploy, run migrations and seed against the production database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for additional deployment details.

## Performance Notes

- Dedicated `/api/colleges/compare` endpoint with selective field fetching
- Database indexes on `rating`, `baseFees`, `location`, and cutoff search fields
- Reduced payload sizes via Prisma `select` instead of full `include`
- Homepage rendered dynamically to avoid build-time database dependency

## Future Improvements

- User authentication and saved colleges
- Pagination on college listing
- Preset popular comparisons on homepage
- Rate limiting on API routes
- Expanded college dataset

## License

Private — internship assignment project.
