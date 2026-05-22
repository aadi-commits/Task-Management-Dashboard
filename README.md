# Task Management Dashboard

A role-based task management dashboard built with **Angular 21** on the frontend and a **Node.js + Express + MongoDB** REST API on the backend. Users can create, edit, delete and triage tasks across three statuses (Todo / In Progress / Completed); admins can see every task in the workspace.

---

## Tech stack

**Frontend**
- Angular 21 (standalone components, signals, new control flow `@if` / `@for` / `@switch`)
- Tailwind CSS 3
- `ngx-toastr` for notifications
- HTTP interceptors for JWT auth and global error handling
- Route guards (`authGuard`, `guestGuard`)

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JWT auth (`jsonwebtoken`) + bcrypt password hashing
- CORS enabled

---

## Features

### Mandatory
- Login with reactive-form validation and toast feedback
- Protected routes via auth guards (login redirects when unauthenticated)
- Two sample users (admin + regular user) seeded via script
- Full task CRUD: create, edit, delete, inline status change
- Kanban board with three status columns and click-to-open detail modal
- Form validation with inline error messages
- Toast notifications for every success and error path
- Search by title or description, plus priority filter (Low / Medium / High)
- Skeleton loaders during fetch + refresh button with spinner
- API integration via Angular services and centralized HTTP interceptors
- Responsive layout for desktop, tablet and mobile
- Dark mode toggle (persists via `localStorage`, respects system preference on first load)

### Role-based access
- Backend enforces RBAC: users only see their own tasks; admins see every task
- Admin UI highlights: `ADMIN` pill on the sidebar user card, owner avatar on each card, subtle "Admin view" subtitle in the topbar

### Not implemented (bonus features from the spec)
- Drag-and-drop between status columns
- UI animations beyond fade/scale on modal mount

---

## Getting started

### Prerequisites
- Node.js 20+
- npm 10+
- A running MongoDB instance (local or MongoDB Atlas)

### 1. Clone and install

```bash
git clone https://github.com/aadi-commits/Task-Management-Dashboard.git
cd Task-Management-Dashboard
```

### 2. Backend

```bash
cd backend
cp .env.example .env       # then edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run seed               # seeds two sample users plus a few tasks
npm run dev                # starts on http://localhost:5000
```

### 3. Frontend (in a separate terminal)

```bash
cd frontend
npm install
npm start                  # starts on http://localhost:4200
```

Open `http://localhost:4200` in your browser and you should be redirected to `/login`.

---

## Sample credentials

The `npm run seed` script creates these two users. The login page also has dev-shortcut chips that fill them in automatically.

| Role  | Email           | Password   |
|-------|-----------------|------------|
| Admin | admin@tmd.dev   | admin@123  |
| User  | user@tmd.dev    | user@123   |

Log in as **admin** to see every task in the workspace (with owner avatars); log in as **user** to see only that user's tasks.

---

## Project structure

```
.
├── backend/
│   ├── controllers/        # auth + task controllers
│   ├── middleware/         # JWT protect middleware
│   ├── models/             # User and Task Mongoose schemas
│   ├── routes/             # /api/auth and /api/tasks
│   ├── scripts/seed.js     # idempotent seeder
│   ├── app.js              # Express app wiring
│   ├── server.js           # entry point
│   └── .env.example
└── frontend/
    └── src/app/
        ├── core/
        │   ├── guards/         # authGuard, guestGuard
        │   ├── interceptors/   # auth + error interceptors
        │   ├── models/         # User, Task type definitions
        │   └── services/       # AuthService, TaskService, ThemeService
        ├── features/
        │   ├── auth/login/         # login page (reactive form)
        │   └── tasks/
        │       ├── dashboard/      # main page wiring everything together
        │       ├── task-card/      # single task card
        │       ├── task-column/    # status column with header + empty state
        │       ├── task-detail/    # read-only detail modal
        │       ├── task-form/      # create + edit modal
        │       └── task-filters/   # search + priority + refresh
        └── shared/
            ├── components/         # app-shell, confirm-dialog, spinner, skeletons
            └── pipes/              # timeAgo pipe
```

---

## API reference

All endpoints are JSON. Protected routes require an `Authorization: Bearer <token>` header.

| Method | Path                | Auth     | Description                             |
|--------|---------------------|----------|-----------------------------------------|
| POST   | `/api/auth/register`| public   | Register a new user                     |
| POST   | `/api/auth/login`   | public   | Log in and receive a JWT                |
| GET    | `/api/auth/me`      | required | Get the current user                    |
| GET    | `/api/tasks`        | required | List tasks (admin sees all, user sees own) |
| POST   | `/api/tasks`        | required | Create a task                           |
| GET    | `/api/tasks/:id`    | required | Get a single task (owner only)          |
| PUT    | `/api/tasks/:id`    | required | Update a task (owner or admin)          |
| DELETE | `/api/tasks/:id`    | required | Delete a task (owner or admin)          |

---

## Available scripts

### Backend
| Script        | What it does                                         |
|---------------|------------------------------------------------------|
| `npm start`   | Start the API server                                 |
| `npm run dev` | Start with nodemon (auto-reload)                     |
| `npm run seed`| Seed two sample users plus a handful of sample tasks |

### Frontend
| Script         | What it does                            |
|----------------|-----------------------------------------|
| `npm start`    | Run the dev server on port 4200         |
| `npm run build`| Build for production (runs `set-env.js` first to bake the API URL into the bundle) |
| `npm run watch`| Build in watch mode (development)       |
| `npm test`     | Run the unit tests                      |

---

## Deployment

The repo is wired for a split deploy: **Netlify** for the static Angular bundle, **Render / Railway / Fly** for the Node API, and **MongoDB Atlas** for the database.

### Backend (Render / Railway / Fly)

Set these environment variables on your backend host:

| Variable      | Example value                                              |
|---------------|------------------------------------------------------------|
| `PORT`        | `5000` (or whatever the host expects)                      |
| `MONGO_URI`   | `mongodb+srv://user:pass@cluster.mongodb.net/task_management` |
| `JWT_SECRET`  | A long random string (use `openssl rand -hex 32`)          |
| `FRONTEND_URL`| `https://your-app.netlify.app`                             |

After the first deploy, run the seeder once against the production DB:

```bash
# locally, with the prod MONGO_URI exported
MONGO_URI="..." JWT_SECRET="..." npm run seed
```

### Frontend (Netlify)

The repo ships with a `netlify.toml` at the root so Netlify auto-detects everything:

1. Push the repo to GitHub (already done).
2. In Netlify dashboard → **Add new site → Import from Git** → pick this repo.
3. Settings → **Environment variables** → add:
   - `API_URL` = `https://your-backend-host/api`
4. **Deploy**.

How it works: Netlify runs `npm run build` which triggers `scripts/set-env.js` → that script reads `API_URL` and writes `src/environments/environment.prod.ts` → `ng build` then bakes that URL into the bundle. The file isn't committed (it's in `.gitignore`), so changing the backend URL is just an env-var edit + redeploy — no code change.

> Note: the backend URL is **not** a secret. Like every SPA, the API endpoint is visible in the browser's Network tab. The reason for using an env var is workflow flexibility (staging vs prod, easy URL changes), not concealment. Real secrets — `MONGO_URI`, `JWT_SECRET` — only ever live on the backend host.

---

## Notes for reviewers

- The repo uses a feature-branch workflow with `--no-ff` merge commits, so `git log --graph --oneline` shows every feature as its own branch coming back into `main`.
- Backend errors from any endpoint surface to the user as a toast via the global HTTP error interceptor.
- The auth interceptor automatically attaches the JWT to every request; the error interceptor logs the user out on `401` so an expired token can't leave the app in a half-authenticated state.
- All Angular components use `ChangeDetectionStrategy.OnPush` and signal-based state, which keeps the bundle responsive even with the modals stacked on top of the dashboard.
