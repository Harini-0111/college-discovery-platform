# Architectural Decisions

This document tracks key architectural and engineering decisions made during the development of the College Discovery Platform.

## 1. Roadmap Resequencing (Data-First)
- **Decision**: Develop Database -> Seed Data -> College APIs -> Search -> Predictor -> Compare -> Auth.
- **Reason**: The core value proposition of the platform relies entirely on data. Features like Search, Comparison, and Prediction cannot be built or tested without realistic data. Authentication is deferred as it is not required for these core flows.

## 2. Deferred Review System
- **Decision**: Omit Review creation UI for the MVP.
- **Reason**: Reduces complexity and state management for a 3-day deadline. We will only support displaying sample/seeded reviews.

## 3. Simplified Authentication
- **Decision**: Use NextAuth Credentials Provider.
- **Reason**: Faster implementation within the 3-day deadline. OAuth is not explicitly required by the assignment constraints and adds unnecessary configuration overhead for an MVP.

## 4. PostgreSQL Database (with SQLite for local dev MVP)
- **Decision**: Use PostgreSQL via Prisma ORM for final deployment (Neon). Utilize SQLite for Day 1 local dev to ensure zero-friction setup without needing an external Neon connection string immediately.
- **Reason**: Highly relational data benefits from relational guarantees. Using SQLite locally allows rapid schema prototyping and seeding, but it will be migrated to Neon Postgres prior to final submission as per assignment requirements.

## 5. Zod for Validation
- **Decision**: Use `zod` for validating all incoming API query parameters and request bodies.
- **Reason**: Provides robust, type-safe validation before data ever reaches the service layer. Guarantees that the service layer only receives valid inputs (e.g., catching negative fees, invalid pagination limits).

## 6. Strict Separation of Concerns (Service Layer)
- **Decision**: Implement a dedicated `src/services` folder. Next.js API Route Handlers will contain NO business logic or Prisma queries.
- **Reason**: Route Handlers should solely be responsible for HTTP specifics (extracting params, returning status codes). Moving database logic to `college.service.ts` and `search.service.ts` makes the logic reusable (e.g., by React Server Components later) and significantly easier to test.
