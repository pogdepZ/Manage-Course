# LMS UI Sketch (Role-based)

## 1) UX Direction
- App type: Web dashboard (desktop-first, responsive mobile)
- Navigation style:
  - Left sidebar (desktop)
  - Bottom tab bar (mobile)
- Global areas:
  - Top bar: search, notifications placeholder, profile menu
  - Content area: list/detail forms
  - Toast area: success/error feedback

## 2) Information Architecture

### Public
- Login
- Register

### Private (after login)
- Dashboard
- Courses
- Lessons
- Enrollments
- Profile

## 3) Role-based menu visibility

### Admin
- Dashboard
- Courses (view/create/edit/delete all)
- Lessons (view/create/edit/delete all)
- Enrollments (view/create all)
- Profile

### Teacher
- Dashboard
- Courses (only own courses)
- Lessons (only lessons in own courses)
- Enrollments (for own courses)
- Profile

### Student
- Dashboard
- Courses (only enrolled courses)
- Lessons (only lessons in enrolled courses)
- Enrollments (only own)
- Profile

## 4) Screen Wireframes

## 4.1 Login

```
+---------------------------------------------------+
|                     LMS Portal                    |
|---------------------------------------------------|
| Email [________________________]                  |
| Password [____________________] (show)            |
| [ Login ]                                         |
| Don't have an account? [Register]                 |
+---------------------------------------------------+
```

API:
- POST /api/login

Success:
- Save accessToken in memory
- Save refreshToken in secure storage strategy for your client
- Redirect to Dashboard

## 4.2 Register

```
+---------------------------------------------------+
|                   Create Account                  |
|---------------------------------------------------|
| Name [_________________________]                  |
| Email [________________________]                  |
| Password [_____________________]                  |
| Role [admin | teacher | student]                 |
| Department [___________________]                  |
| [ Register ]                                      |
+---------------------------------------------------+
```

API:
- POST /api/register

## 4.3 Dashboard

```
+--------------------------------------------------------------+
| Topbar: [Search]                            [Avatar v]       |
|--------------------------------------------------------------|
| KPI Cards:  Courses | Lessons | Enrollments                 |
|--------------------------------------------------------------|
| Recent Courses Table                                        |
| - title - owner - created date - quick actions             |
+--------------------------------------------------------------+
```

Behavior:
- Admin sees global totals
- Teacher sees only own totals
- Student sees only enrolled totals

## 4.4 Courses List + Actions

```
+----------------------------------------------------------------+
| Courses                                        [ + New Course ] |
|----------------------------------------------------------------|
| Filter: [Search title____] [Owner] [Reset]                     |
|----------------------------------------------------------------|
| Table/List                                                        |
| Title                 | Created By | Updated At | Actions       |
| Intro to Node         | teacherA   | ...        | View Edit Del |
| ...                                                          ...|
+----------------------------------------------------------------+
```

APIs:
- GET /api/courses
- POST /api/courses
- GET /api/courses/:courseId
- PATCH /api/courses/:courseId
- DELETE /api/courses/:courseId

UI rule:
- Do not hide by hardcoded role only. Also handle 403 from backend ABAC.

## 4.5 Course Detail

```
+---------------------------------------------------------------+
| Course: Intro to Node                     [Edit] [Delete]     |
|---------------------------------------------------------------|
| Metadata: owner, createdAt, updatedAt                        |
|---------------------------------------------------------------|
| Lessons in this course                        [ + New Lesson ] |
| - lesson card/list                                              |
|---------------------------------------------------------------|
| Enrollment quick panel                        [Enroll User]    |
+---------------------------------------------------------------+
```

## 4.6 Lessons List + CRUD

```
+----------------------------------------------------------------+
| Lessons                                         [ + New Lesson ]|
|----------------------------------------------------------------|
| Filter: [Course] [Keyword] [Reset]                             |
|----------------------------------------------------------------|
| Lesson List                                                      |
| Course         | Preview content             | Actions          |
| Node Intro     | This lesson covers ...      | View Edit Del    |
+----------------------------------------------------------------+
```

APIs:
- GET /api/lessons
- POST /api/lessons
- GET /api/lessons/:lessonId
- PATCH /api/lessons/:lessonId
- DELETE /api/lessons/:lessonId

## 4.7 Enrollment Screen

```
+----------------------------------------------------------------+
| Enrollments                                     [ + Enroll ]    |
|----------------------------------------------------------------|
| Form: UserId [________] CourseId [________] [Submit]           |
|----------------------------------------------------------------|
| Enrollment list                                                   |
| userId              | courseId            | createdAt           |
+----------------------------------------------------------------+
```

APIs:
- POST /api/enrollments/enroll
- GET /api/enrollments

## 4.8 Profile + Session

```
+---------------------------------------------------+
| Profile                                           |
|---------------------------------------------------|
| Name, Email, Role, Department                     |
| [Logout]                                          |
+---------------------------------------------------+
```

Session behavior:
- Attach Authorization: Bearer <accessToken> for private APIs
- On 401 token expired:
  - call POST /api/refresh
  - retry original request once

## 5) Suggested Frontend Component Tree

- AppLayout
- Sidebar
- Topbar
- AuthGuard
- RoleGate (optional UI-level helper)
- pages/
  - LoginPage
  - RegisterPage
  - DashboardPage
  - CoursesPage
  - CourseDetailPage
  - LessonsPage
  - EnrollmentsPage
  - ProfilePage
- features/
  - auth/
  - courses/
  - lessons/
  - enrollments/

## 6) UI State Model (minimal)

- authStore
  - user
  - accessToken
  - refreshToken
  - isAuthenticated
- courseStore
  - items
  - selectedCourse
  - loading
- lessonStore
  - items
  - selectedLesson
  - loading
- enrollmentStore
  - items
  - loading

## 7) Practical UX Notes

- Show disabled actions while request is pending to avoid duplicate submit.
- Always render backend error messages (403/404/409) in toast or inline alert.
- Keep optimistic update only for low-risk actions; otherwise refetch list after mutation.
- Add empty state for each list page.
- Add confirmation modal before delete.

## 8) Why this UI fits your backend

- ABAC in backend decides final permission; UI only improves discoverability.
- Data scope in backend already filters list endpoints, so list pages naturally adapt per role.
- Shared CRUD shells for Admin/Teacher/Student reduce frontend complexity.
