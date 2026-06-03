# Database Schema Design

This document details the production-grade database schema utilizing PostgreSQL and Prisma ORM.

## Table: Users
**Purpose**: Stores user account information and authentication details.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `email` (String, Unique)
  - `passwordHash` (String, Nullable for OAuth)
  - `name` (String, Nullable)
  - `createdAt` (DateTime, Default: now())
  - `updatedAt` (DateTime, updated on change)
- **Relationships**:
  - 1-to-Many with `SavedColleges`
  - 1-to-Many with `Reviews`
- **Indexing Recommendations**:
  - Index on `email` for fast login lookups.
- **Validation Constraints**:
  - `email` must be a valid email format.

## Table: Colleges
**Purpose**: The core entity storing primary information about educational institutions.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `name` (String)
  - `slug` (String, Unique) - For SEO-friendly URLs
  - `location` (String)
  - `establishedYear` (Int, Nullable)
  - `description` (Text, Nullable)
  - `baseFees` (Float) - Representative fees for filtering
  - `rating` (Float, Default: 0) - Aggregate rating
  - `placements` (Text, Nullable) - Summary of placement stats
- **Relationships**:
  - 1-to-Many with `Courses`
  - 1-to-Many with `Cutoffs`
  - 1-to-Many with `Reviews`
  - 1-to-Many with `SavedColleges`
- **Indexing Recommendations**:
  - Index on `slug` for fast profile page loading.
  - Index on `location` and `baseFees` for search performance.
- **Validation Constraints**:
  - `name` cannot be empty.
  - `rating` must be between 0 and 5.

## Table: Courses
**Purpose**: Represents the specific academic programs offered by a college.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `collegeId` (String, Foreign Key)
  - `name` (String) - e.g., "B.Tech Computer Science"
  - `durationYears` (Int)
  - `totalFees` (Float)
- **Relationships**:
  - Many-to-1 with `Colleges`
- **Indexing Recommendations**:
  - Index on `collegeId` for fast retrieval of a college's courses.
- **Validation Constraints**:
  - `totalFees` must be >= 0.

## Table: Reviews
**Purpose**: User-generated ratings and textual reviews for colleges.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `userId` (String, Foreign Key)
  - `collegeId` (String, Foreign Key)
  - `rating` (Int)
  - `comment` (Text, Nullable)
  - `createdAt` (DateTime, Default: now())
- **Relationships**:
  - Many-to-1 with `Users`
  - Many-to-1 with `Colleges`
- **Indexing Recommendations**:
  - Index on `collegeId` to quickly load reviews for a college profile.
- **Validation Constraints**:
  - `rating` must be an integer between 1 and 5.
  - One user can only leave one review per college (Unique constraint on `userId, collegeId`).

## Table: SavedColleges
**Purpose**: A join table mapping users to their bookmarked/favorite colleges.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `userId` (String, Foreign Key)
  - `collegeId` (String, Foreign Key)
  - `createdAt` (DateTime, Default: now())
- **Relationships**:
  - Many-to-1 with `Users`
  - Many-to-1 with `Colleges`
- **Indexing Recommendations**:
  - Index on `userId` to quickly fetch a user's saved list.
- **Validation Constraints**:
  - A user cannot save the same college twice (Unique constraint on `userId, collegeId`).

## Table: Cutoffs (Predictor Data)
**Purpose**: Stores historical admission cutoffs used by the Predictor Tool.

- **Fields**:
  - `id` (String, Primary Key, CUID)
  - `collegeId` (String, Foreign Key)
  - `examName` (String) - e.g., "JEE Main", "NEET", "SAT"
  - `category` (String) - e.g., "General", "OBC", "SC"
  - `closingRank` (Int) - The maximum rank accepted
  - `year` (Int) - Year of the data
- **Relationships**:
  - Many-to-1 with `Colleges`
- **Indexing Recommendations**:
  - Composite index on `(examName, category, closingRank)` for highly optimized predictor queries.
- **Validation Constraints**:
  - `closingRank` must be > 0.
