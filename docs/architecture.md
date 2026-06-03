# System Architecture

## Complete System Architecture
The College Discovery Platform is built as a monolithic, serverless-ready application using the Next.js App Router. It leverages the React Server Components paradigm to push rendering and data fetching to the server, minimizing client-side JavaScript. The backend consists of Next.js Route Handlers (`app/api/...`) that communicate with a PostgreSQL database via Prisma ORM.

### High-Level Diagram
```text
[ Client Browser ]
        |
        | (HTTP/REST)
        v
[ Next.js App Router ]
   ├── Client Components (Interactive UI)
   ├── Server Components (SSR/SSG Data Fetching)
   └── API Route Handlers (Backend Endpoints)
        |
        | (Internal Function Calls)
        v
[ Service Layer ] (Business Logic: User, College, Search Services)
        |
        v
[ Prisma ORM ] (Data Access Layer)
        |
        | (TCP/IP)
        v
[ PostgreSQL ] (Relational Database)
```

## User Flow
1. **Discovery**: User lands on the homepage, searches for colleges using the global search bar or navigates to the College Listing page.
2. **Evaluation**: User views detailed college profiles or adds multiple colleges to the Comparison Tool.
3. **Prediction**: User enters their exam rank into the Predictor Tool to see realistic admission chances.
4. **Action**: User creates an account (Authentication Flow) to save their favorite colleges for future reference.

## Frontend Architecture
- **Framework**: Next.js App Router (`app/`).
- **State Management**: React Context for global state (e.g., authentication state, comparison cart), and URL query parameters for search/filter state.
- **Styling**: TailwindCSS for utility-first styling, ensuring responsive and consistent design.
- **Components**: Separated into `components/ui` (reusable, dumb components like Buttons, Inputs) and `components/features` (domain-specific components like `CollegeCard`).

## Backend Architecture
- **API Routes**: Located in `app/api/...`, providing RESTful endpoints for client-side interactions.
- **Middleware**: Next.js middleware is used for route protection, ensuring unauthenticated users cannot access restricted API endpoints or pages (like saved colleges).

## Service Layer Design
To prevent bloated API route handlers, a dedicated `services/` directory encapsulates business logic:
- `collegeService.ts`: Handles fetching, formatting, and calculating metrics for colleges.
- `userService.ts`: Manages user profiles and saved college logic.
- `predictorService.ts`: Contains the algorithm for matching ranks against historical cutoffs.

## Database Interaction Flow
1. **Request**: API route receives a request.
2. **Validation**: Request data is validated (e.g., using Zod).
3. **Service Call**: API route calls the appropriate function in the Service Layer.
4. **Query**: Service layer utilizes the `prisma` client instance to construct typed SQL queries.
5. **Response**: Data is retrieved from PostgreSQL, transformed by the service layer, and returned to the API route, which sends a JSON response to the client.

## Workflows

### Authentication Flow
Using NextAuth.js:
1. User clicks "Login/Register".
2. NextAuth handles the credentials or OAuth flow.
3. Upon success, a secure JWT session cookie is set.
4. The `User` record is created/verified in the database.

### Search Flow
1. User inputs criteria (name, location, fee range).
2. Frontend debounces input and updates URL query parameters.
3. Server Component or API Route receives parameters.
4. Prisma translates parameters into a `WHERE` clause with `contains`, `gte`, `lte` operators.
5. Paginated results are returned to the client.

### Comparison Flow
1. User selects up to 4 colleges.
2. Selected IDs are stored in local state/context.
3. Frontend requests `POST /api/compare` with the array of IDs.
4. Backend fetches full details for these specific colleges and returns a normalized payload for side-by-side rendering.

### Predictor Workflow
1. User submits Exam Name (e.g., "JEE") and Rank (e.g., "5000").
2. Request is sent to `POST /api/predictor`.
3. `predictorService.ts` queries the `Cutoff` table where `examName === input.examName` and `maxRank >= input.rank`.
4. The service joins the associated `College` data and returns a list of viable options sorted by probability or college rating.

## Deployment Architecture
- **Hosting**: Vercel (optimizes Next.js Serverless Functions and Edge Network).
- **Database**: Neon (Serverless PostgreSQL database, allowing for scale-to-zero and connection pooling).
- **CI/CD**: GitHub Actions integrated with Vercel for automatic preview deployments on pull requests and production deployments on main branch merges.
