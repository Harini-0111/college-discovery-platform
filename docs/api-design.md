# API Design Specification

This document details the RESTful API endpoints required for the College Discovery Platform. All endpoints will be implemented using Next.js Route Handlers and return JSON responses.

## General Principles
- **Base URL**: `/api/v1` (or simply `/api` for MVP)
- **Authentication**: Secured routes require a valid session (checked via NextAuth).
- **Error Format**: Standardized to `{ "error": "Message", "code": "HTTP_STATUS" }`.

---

## 1. Authentication APIs (Handled by NextAuth.js)

### Register User
- **Purpose**: Creates a new user account.
- **HTTP Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Request Body**:
  ```json
  { "email": "student@example.com", "password": "securepassword", "name": "John Doe" }
  ```
- **Response Structure (201 Created)**:
  ```json
  { "message": "User created successfully", "userId": "cuid..." }
  ```
- **Error Responses**: `400 Bad Request` (Invalid email/password), `409 Conflict` (Email already exists).
- **Validation Rules**: Password min length 8, valid email format.

---

## 2. College APIs

### Get All Colleges
- **Purpose**: Retrieves a paginated list of colleges for the listing page.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/colleges`
- **Query Parameters**:
  - `page` (optional, default: 1)
  - `limit` (optional, default: 20)
- **Response Structure (200 OK)**:
  ```json
  {
    "data": [
      { "id": "1", "name": "MIT", "location": "MA", "baseFees": 50000, "rating": 4.9 }
    ],
    "meta": { "total": 150, "page": 1, "totalPages": 8 }
  }
  ```
- **Error Responses**: `500 Internal Server Error` (Database failure).
- **Validation Rules**: `page` and `limit` must be positive integers.

### Get College Details
- **Purpose**: Retrieves comprehensive data for a single college profile.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/colleges/:id`
- **Query Parameters**: None
- **Response Structure (200 OK)**: Includes nested relations (Courses, Reviews).
- **Error Responses**: `404 Not Found` if the college ID does not exist.
- **Validation Rules**: `id` must be a valid CUID format.

---

## 3. Search APIs

### Search Colleges
- **Purpose**: Dynamic searching and filtering for the discovery portal.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/colleges/search`
- **Query Parameters**:
  - `q` (Search query string, optional)
  - `location` (string, optional)
  - `minFee`, `maxFee` (numbers, optional)
  - `minRating` (number, optional)
- **Response Structure (200 OK)**: Same structure as "Get All Colleges".
- **Error Responses**: `400 Bad Request` for malformed query parameters.
- **Validation Rules**: Ensure `minFee` <= `maxFee`.

---

## 4. Comparison APIs

### Compare Colleges
- **Purpose**: Fetches standardized data to render a side-by-side comparison matrix.
- **HTTP Method**: `POST`
- **Endpoint**: `/api/compare`
- **Request Body**:
  ```json
  { "collegeIds": ["cuid1", "cuid2", "cuid3"] }
  ```
- **Response Structure (200 OK)**:
  ```json
  {
    "data": [
      { "id": "cuid1", "name": "College A", "fees": 10000, "rating": 4.5, "placements": "95%" },
      { "id": "cuid2", "name": "College B", "fees": 12000, "rating": 4.2, "placements": "90%" }
    ]
  }
  ```
- **Error Responses**: `400 Bad Request` if array length > 4 or < 2.
- **Validation Rules**: Max 4 colleges allowed for comparison at once. Array cannot be empty.

---

## 5. Predictor APIs

### Get College Predictions
- **Purpose**: Predicts viable colleges based on student's competitive exam rank.
- **HTTP Method**: `POST`
- **Endpoint**: `/api/predictor`
- **Request Body**:
  ```json
  {
    "examName": "JEE Main",
    "category": "General",
    "rank": 4500
  }
  ```
- **Response Structure (200 OK)**:
  ```json
  {
    "matches": [
      {
        "college": { "id": "cuid1", "name": "College X", "location": "City Y" },
        "closingRank": 5000,
        "probability": "High"
      }
    ]
  }
  ```
- **Error Responses**: `400 Bad Request` if exam name is invalid or rank <= 0.
- **Validation Rules**: `rank` must be a positive integer. `examName` must be provided.

---

## 6. Saved Colleges APIs (Protected Routes)

### Save a College
- **Purpose**: Adds a college to the user's bookmarked list.
- **HTTP Method**: `POST`
- **Endpoint**: `/api/users/saved`
- **Request Body**: `{ "collegeId": "cuid..." }`
- **Response Structure (201 Created)**: `{ "message": "College saved successfully" }`
- **Error Responses**: `401 Unauthorized` (Not logged in), `409 Conflict` (Already saved), `404 Not Found` (College doesn't exist).
- **Validation Rules**: User must be authenticated. `collegeId` must be valid.

### Get Saved Colleges
- **Purpose**: Retrieves the logged-in user's saved colleges.
- **HTTP Method**: `GET`
- **Endpoint**: `/api/users/saved`
- **Query Parameters**: None
- **Response Structure (200 OK)**:
  ```json
  { "data": [ { "id": "cuid1", "name": "College X", "location": "City Y" } ] }
  ```
- **Error Responses**: `401 Unauthorized`.
- **Validation Rules**: User must be authenticated.

### Remove Saved College
- **Purpose**: Removes a college from the user's bookmarked list.
- **HTTP Method**: `DELETE`
- **Endpoint**: `/api/users/saved`
- **Request Body**: `{ "collegeId": "cuid..." }`
- **Response Structure (200 OK)**: `{ "message": "College removed successfully" }`
- **Error Responses**: `401 Unauthorized`, `404 Not Found` (Not in saved list).
- **Validation Rules**: User must be authenticated.
