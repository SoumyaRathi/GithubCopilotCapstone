# KAN-143 — Manage ToDo Tasks

A small web app to create, view, edit, delete and complete ToDo tasks. Tasks are saved on the server, so they remain after a page refresh or server restart.

## Prerequisites

- Node.js 24 or newer (uses the built-in `node:sqlite` module, which prints an experimental warning)

## Run

```
npm install
npm start
```

Open http://localhost:3000. Register an account, log in, then manage your tasks.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | HTTP port |
| `DB_FILE` | `data/todo.db` | SQLite database file (the `data/` folder is git-ignored) |
| `NODE_ENV` | — | Set to `production` to mark the session cookie `Secure` (requires HTTPS) |

## Test

```
npm test
```

Tests use `node:test`, each with its own isolated database; the restart test uses a temporary file-backed database.

## Behavior

- Title: required, 1–100 characters. Description: optional, up to 1000 characters.
- New tasks start as pending. Tasks are listed newest first, completed and pending together.
- Editing changes title and description only. On update, the title is required; an omitted `description` keeps the stored value and an empty string clears it.
- Deleting is permanent and asks for confirmation.
- Each user sees only their own tasks. Another user's task returns 404.

## API

| Method & path | Notes |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Session cookie (`HttpOnly`, `SameSite=Strict`, 7 days) |
| `GET /api/tasks`, `POST /api/tasks` | List / create |
| `PUT /api/tasks/:id` | Edit title/description |
| `PATCH /api/tasks/:id/status` | Body `{ "completed": true\|false }` |
| `DELETE /api/tasks/:id` | Permanent delete |

## Operational limits

- Single process with a single local SQLite file; not intended for multiple server instances.
- The authentication rate limiter is in memory and resets when the server restarts.
- `node:sqlite` is experimental in Node 24; database access is isolated in `src/db.js`.
