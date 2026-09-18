# TaskForge

TaskForge is a full-stack project and task management application. It provides a focused workspace for creating projects, organizing tasks across workflow stages, tracking deadlines, and monitoring progress from a responsive dashboard.

## Features

- User registration and login with JWT-based authentication
- Project creation and selection
- Kanban-style task board with **To do**, **In progress**, and **Completed** stages
- Task creation, status updates, due-date editing, and deletion
- Overdue-task indicators
- Task search and project progress summaries
- Project membership and role-aware API endpoints
- Responsive layouts for desktop, tablet, and mobile

## Technology stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- JavaScript and JSX

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- JSON Web Tokens and bcrypt
- Zod validation

## Project structure

```text
NewApp/
├── frontend/              # React and Vite client
│   ├── src/
│   │   ├── App.jsx        # Landing page and application entry flow
│   │   ├── AuthScreen.jsx # Login and registration interface
│   │   ├── Dashboard.jsx  # Project dashboard and task board
│   │   ├── api.js         # API request helper
│   │   └── index.css      # Global and component styling
│   └── package.json
├── backend/               # Express API
│   ├── prisma/            # Prisma schema and database migrations
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database

## Environment variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="replace-with-a-secure-random-secret"
PORT=5000
FRONTEND_ORIGIN="http://localhost:8443"
```

The frontend uses `http://localhost:5000` by default. To use another API URL, create `frontend/.env`:

```env
VITE_API_URL="http://localhost:5000"
```

## Installation

Install the frontend and backend dependencies separately:

```bash
cd frontend
npm install

cd ../backend
npm install
```

## Database setup

From the `backend` directory, generate the Prisma client and apply the included migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For local schema development, use `npx prisma migrate dev` instead.

## Running locally

Start the backend API:

```bash
cd backend
npm run dev
```

In another terminal, start the frontend:

```bash
cd frontend
npm run dev
```

The default local addresses are:

- Frontend: `http://localhost:8443`
- Backend API: `http://localhost:5000`

## Available scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run format` | Format frontend source files |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with TypeScript watch mode |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled API server |

## API overview

Authenticated routes expect a bearer token:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Log in and receive a token |
| `GET` | `/auth/me` | Get the authenticated user |
| `GET` | `/projects` | List accessible projects |
| `POST` | `/projects` | Create a project |
| `GET` | `/projects/:id` | Get one project |
| `PATCH` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Delete a project |
| `GET` | `/projects/:id/members` | List project members |
| `POST` | `/projects/:id/members` | Add a project member |
| `DELETE` | `/projects/:id/members/:userId` | Remove a project member |
| `GET` | `/projects/:id/tasks` | List project tasks |
| `POST` | `/projects/:id/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

## Production builds

Build each application independently:

```bash
cd frontend
npm run build

cd ../backend
npm run build
```

Before deploying, configure the production database, JWT secret, allowed frontend origin, and `VITE_API_URL` for the deployed API.
