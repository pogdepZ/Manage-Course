# LMS Backend (Fastify + MongoDB + JWT + ABAC)

## Tech Stack
- Node.js + Fastify
- MongoDB + Mongoose
- JWT (access + refresh)
- Clean Architecture style: controllers, services, repositories

## Project Structure

```
src/
  config/
  controllers/
  errors/
  middleware/
  models/
  policies/
  repositories/
  routes/
  services/
  utils/
  app.js
  container.js
  server.js
```

## Run

1. Copy `.env.example` to `.env`
2. Fill in secrets and Mongo URI
3. Install packages

```bash
npm install
npm run dev
```

## REST APIs

### Auth
- `POST /api/register`
- `POST /api/login`
- `POST /api/refresh`

### Courses
- `POST /api/courses`
- `GET /api/courses`
- `GET /api/courses/:courseId`
- `PATCH /api/courses/:courseId`
- `DELETE /api/courses/:courseId`

### Lessons
- `POST /api/lessons`
- `GET /api/lessons`
- `GET /api/lessons/:lessonId`
- `PATCH /api/lessons/:lessonId`
- `DELETE /api/lessons/:lessonId`

### Enrollments
- `POST /api/enrollments/enroll`
- `GET /api/enrollments`

## ABAC + Data Scope

### ABAC policy checks (request-time)
- Implemented in `policies/policyEngine.js`
- Subject attributes: `id`, `role`, `department`
- Resource attributes: `createdBy`, `courseCreatedBy`, `userId`, `courseId`
- Action: `create`, `read`, `update`, `delete`

### Data scope checks (query-time)
- Implemented in `utils/dataScope.js`
- Enforced in repository layer:
  - Admin: no filter
  - Teacher: `{ createdBy: user.id }`
  - Student: `{ _id: { $in: enrolledCourseIds } }`

This combination gives:
- ABAC: can user perform this action on this resource?
- Data scope: even if allowed, which records can be queried/updated/deleted?

## Example payloads

### Register
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "StrongPass123",
  "role": "teacher",
  "department": "Computer Science"
}
```

### Login
```json
{
  "email": "alice@example.com",
  "password": "StrongPass123"
}
```

### Refresh
```json
{
  "refreshToken": "<jwt-refresh-token>"
}
```
