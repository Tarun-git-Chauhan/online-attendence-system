# Online Attendance System — Node.js Backend (Local Hosting)

This backend is built to plug into your existing frontend HTML files. Keep the folder structure intact and run locally.

## Quick Start

1) **Create DB** (PostgreSQL) and import the provided SQL dump:
```
createdb online_attendance
psql -d online_attendance -f "/mnt/data/Online Attendance System.sql"
```
(Or import through pgAdmin.)

2) **Setup project**
```
cp .env.sample .env
# edit .env with your DB credentials
npm install
npm run dev
```
Server runs at `http://localhost:4000`.

## Endpoints (minimal set used by the frontend)

### Auth
- `POST /api/auth/login`  
  Body: `{ "email":"", "password":"", "role":"student|faculty|admin" }`  
  Returns: `{ token, user: { id, name, email, role } }`

### Student
- `POST /api/attendance/submit`  
  Body: `{ "course":"INFO2411", "section":"I3", "code":"1234", "userId": 7 }`  
  Validates code window and inserts an attendance record (present/late).

- `GET /api/attendance/history?userId=7&course=INFO2411&section=I3`  
  Returns `{ history: [{date, time, status}] }`

- `GET /api/attendance/summary?userId=7&course=INFO2411&section=I3`  
  Returns `{ present, absent, late }`

### Faculty
- `POST /api/faculty/generate-code`  
  Body: `{ "facultyId":4, "classId":1 }`  
  Returns `{ code, expiresAt }` (window length set by `CODE_WINDOW_SECONDS`).

> Note: The schema dump already includes a `classes` row (id=1). Update IDs to match your data.

## Wiring the Frontend locally

Since your pages are plain HTML files, call these endpoints via `fetch()` from each page as needed. Example snippets are added in comments inside controllers.

If you want me to inject exact `<script>` snippets into your HTML files, send them next and I’ll paste the ready-to-go JS for each page.
