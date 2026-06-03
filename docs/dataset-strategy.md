# Dataset Strategy

For the application to function impressively as an MVP, it needs a realistic and robust dataset. Without data, the APIs and UI are essentially useless.

## Requirements
- 50-100 sample colleges across multiple locations.
- Distinct fees, ratings, and placement statistics.
- Realistic courses.
- Predictor cutoff data for exams like JEE Main.

## 1. Data Model Strategy
We will use Prisma to model the relational data as defined in `database-schema.md`. The core entities are:
- `College`
- `Course`
- `Cutoff`
- `Review` (Sample data only)

## 2. Seed Strategy
Instead of manually entering data through a UI, we will create a robust Prisma seed script (`prisma/seed.ts`).
The script will:
1. Clear existing data to prevent duplicates on re-runs.
2. Read from static JSON files containing mock data.
3. Insert the data into the PostgreSQL database using Prisma's `createMany` or nested `create` methods.

## 3. Prisma Seed Script Approach
```typescript
import { PrismaClient } from '@prisma/client'
import collegesData from './data/colleges.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data (in reverse order of dependencies)
  await prisma.review.deleteMany()
  await prisma.cutoff.deleteMany()
  await prisma.course.deleteMany()
  await prisma.savedCollege.deleteMany()
  await prisma.college.deleteMany()
  await prisma.user.deleteMany()

  // Seed Colleges, Courses, and Cutoffs
  for (const c of collegesData) {
    await prisma.college.create({
      data: {
        name: c.name,
        slug: c.slug,
        location: c.location,
        baseFees: c.baseFees,
        rating: c.rating,
        placements: c.placements,
        courses: {
          create: c.courses
        },
        cutoffs: {
          create: c.cutoffs
        },
        reviews: {
          create: c.reviews
        }
      }
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## 4. Sample JSON Structure
```json
[
  {
    "name": "Indian Institute of Technology Bombay",
    "slug": "iit-bombay",
    "location": "Mumbai, Maharashtra",
    "baseFees": 250000,
    "rating": 4.9,
    "placements": "Highest: 1.5 CPA, Average: 25 LPA",
    "courses": [
      { "name": "B.Tech Computer Science", "durationYears": 4, "totalFees": 1000000 },
      { "name": "B.Tech Electrical Engineering", "durationYears": 4, "totalFees": 1000000 }
    ],
    "cutoffs": [
      { "examName": "JEE Advanced", "category": "General", "closingRank": 61, "year": 2023 }
    ],
    "reviews": [
      { "userId": "seed-user-1", "rating": 5, "comment": "Excellent infrastructure and peer group." }
    ]
  }
]
```
