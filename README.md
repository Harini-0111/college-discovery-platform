# College Discovery Platform

A production-grade MVP for helping students discover, compare, and evaluate colleges based on fees, ratings, location, placements, and eligibility criteria.

## Features

### Authentication
- User registration
- User login
- Protected routes
- Save favorite colleges

### College Search
- Search colleges by name
- Filter by location
- Filter by fees
- Filter by ratings
- Pagination support

### College Comparison
- Compare multiple colleges side-by-side
- Compare fees, ratings, placements, and location

### Predictor Tool
- Recommend colleges based on exam and rank
- Dataset-driven recommendations

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- TypeScript

### Database
- PostgreSQL
- Prisma ORM

### Deployment
- Vercel
- Neon PostgreSQL

## Architecture

The application follows a layered architecture:

Frontend
↓
API Routes
↓
Service Layer
↓
Prisma ORM
↓
PostgreSQL

## Database Schema

Entities:
- Users
- Colleges
- Courses
- Reviews
- Saved Colleges

## API Endpoints

### Authentication
POST /api/auth/register

POST /api/auth/login

### Colleges
GET /api/colleges

GET /api/colleges/:id

### Search
GET /api/colleges/search

### Comparison
POST /api/compare

### Predictor
POST /api/predictor

## Installation

```bash
git clone <repo-url>

npm install

npm run dev
```

## Environment Variables

```env
DATABASE_URL=

NEXTAUTH_SECRET=
```

## Future Enhancements

- Advanced recommendation engine
- College reviews moderation
- AI-powered college suggestions
- Analytics dashboard

## Author

Harini Patsa
