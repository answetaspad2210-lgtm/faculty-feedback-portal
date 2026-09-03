# Faculty Feedback & Course Evaluation Portal

A full-stack web application where students submit structured course/faculty feedback, and administrators manage data and view analytics.

## 1. Project Overview

Students log in, see their assigned courses, and submit ratings (stars, numeric scale, slider, yes/no, multiple choice, text) — optionally anonymously. Admins manage students, faculty, courses, and feedback questions, and view dashboards/reports with charts.

## 2. Features

**Student side**
- Secure login (JWT)
- Dashboard with pending/completed feedback counts
- Multi-section feedback form (Course Content, Faculty Teaching, Interaction, Assessment, Overall)
- Star / numeric / slider / yes-no / multiple-choice / text question types
- Optional anonymous submission
- Backend-enforced duplicate submission prevention

**Admin side**
- Separate admin login and dashboard
- Manage students, faculty, courses, course-faculty mapping, feedback questions
- 5 analytics charts: faculty ratings, course ratings, rating distribution, completion %, category performance
- Filterable reports (department, semester, academic year, course, faculty) + CSV export

## 3. Technology Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, React Router, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js (REST API) |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt password hashing, role-based access control |

## 4. Folder Structure

```
faculty-feedback-portal/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI pieces (StarRating, QuestionInput, banners...)
│   │   ├── pages/         # One file per screen (Login, StudentDashboard, AdminDashboard...)
│   │   ├── layouts/       # StudentLayout (navbar), AdminLayout (sidebar)
│   │   ├── services/      # axios calls to the backend, grouped by feature
│   │   ├── hooks/         # useAuth
│   │   ├── context/       # AuthContext (login state)
│   │   ├── utils/         # small helpers (error message extraction)
│   │   ├── App.jsx        # route definitions
│   │   └── main.jsx       # app entry point
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── controllers/       # request/response handling per feature
│   ├── models/            # Mongoose schemas (Student, Admin, Faculty, Course, FeedbackQuestion, Feedback)
│   ├── routes/             # REST route definitions
│   ├── middleware/        # authMiddleware (JWT + roles), errorHandler
│   ├── services/           # business logic (authService, feedbackService, reportService)
│   ├── utils/               # ApiError, asyncHandler, generateToken, seed.js
│   ├── config/               # db.js (Mongo connection), constants.js
│   └── server.js             # app entry point
│
├── .env.example
└── README.md
```

## 5. Installation

**Requirements:** Node.js 18+, MongoDB running locally or a MongoDB Atlas connection string.

```bash
# From the project root
npm run install:all
```

This installs dependencies for both `server/` and `client/`.

## 6. Environment Variables

Copy the example env files and fill in real values:

```bash
cp .env.example server/.env
```

`server/.env` fields:

| Variable | Description |
|---|---|
| `PORT` | Port the backend runs on (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens — **change this** |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLIENT_ORIGIN` | Frontend URL, for CORS (default `http://localhost:5173`) |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost factor (default 10) |

The client doesn't need its own `.env` for local development — Vite's dev server proxies `/api` calls to the backend automatically (see `client/vite.config.js`).

## 7. Database Setup

Make sure MongoDB is running locally (`mongod`), or set `MONGO_URI` in `server/.env` to a MongoDB Atlas connection string. No manual schema setup is needed — Mongoose creates collections automatically.

## 8. How to Run the Backend

```bash
cd server
npm run dev
```

Runs on `http://localhost:5000` (via nodemon, auto-restarts on changes).

## 9. How to Run the Frontend

```bash
cd client
npm run dev
```

Runs on `http://localhost:5173`.

## 10. How to Seed Sample Data

```bash
cd server
npm run seed
```

This wipes and repopulates the database with demo admin, students, faculty, courses, and feedback questions. **Do not run this against a real/production database.**

## 11. Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `Admin@123` |
| Student | `aarav.patel@example.edu` (or `diya.kapoor@…`, `kabir.singh@…`, `meera.joshi@…`, `rehan.ali@…`) | `Student@123` |

⚠️ These are **development/demo credentials only**. Change them (or delete the seeded accounts and create real ones) before deploying anywhere real.

## 12. API Overview

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login as student or admin |
| GET | `/api/auth/me` | Logged in | Get current user info |
| GET | `/api/students/dashboard` | Student | Dashboard + course/feedback status |
| GET | `/api/courses` | Logged in | List courses (filterable) |
| GET | `/api/faculty` | Logged in | List faculty |
| GET | `/api/feedback/questions` | Logged in | Active feedback question set |
| POST | `/api/feedback` | Student | Submit feedback (validated, duplicate-safe) |
| GET | `/api/admin/dashboard` | Admin | Summary cards + all 5 charts |
| GET | `/api/admin/reports` | Admin | Filtered report (department/semester/course/faculty/year) |
| GET/POST/PUT/DELETE | `/api/admin/students` | Admin | Student management |
| GET/POST/PUT/DELETE | `/api/admin/faculty` | Admin | Faculty management |
| POST/PUT/DELETE | `/api/admin/courses` | Admin | Course management + faculty mapping |
| GET/POST/PUT/DELETE | `/api/admin/questions` | Admin | Feedback question management |

## 13. Future Improvements

- PDF export for reports (currently CSV only)
- Password reset flow (currently a placeholder message)
- Pagination for large student/faculty/course lists
- Server-side search/sort on management tables
- Automated tests (Jest/Vitest) for controllers and components
- Bulk student/faculty import via CSV

---

## Where to edit things (for beginners)

- Change the **student dashboard UI** → `client/src/pages/StudentDashboard.jsx`
- Change the **feedback form UI/flow** → `client/src/pages/FeedbackForm.jsx`
- Change the **feedback database structure** → `server/models/Feedback.js`
- Change **duplicate-submission rules** → `server/services/feedbackService.js` and the unique index in `server/models/Feedback.js`
- Change the **admin dashboard charts** → `client/src/pages/AdminDashboard.jsx` (data comes from `server/services/reportService.js`)
- Change **login behavior** → `client/src/pages/Login.jsx` (frontend) and `server/services/authService.js` (backend)
- Add a **new admin page** → create a file in `client/src/pages/`, add a route in `client/src/App.jsx`, add a nav link in `client/src/layouts/AdminLayout.jsx`
