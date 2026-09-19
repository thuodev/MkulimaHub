# MkulimaHub

A multi-farm management system for tracking farms, land, inputs, stock, and livestock — built as a full-stack portfolio project.

"Mkulima" is Swahili for "farmer."

🔗 **Live demo:** https://mkulimahub-frontend.onrender.com
*(free-tier hosting — the first load after inactivity can take 30–60 seconds to wake up)*

---

## What it does

- Manage multiple farms under one account, each with its own team
- Add team members two ways: invite a brand-new employee (an account and login details are created and emailed to them automatically), or add someone who already has an account
- Three roles per farm — **owner**, **manager**, **worker** — each with different permissions
- Track fields/plots, their size, and current crop
- Log inputs (seed, fertilizer, pesticide, feed) as purchases and usage, with a running balance
- Track general stock/inventory the same way, with in/out movements
- Record livestock as individually tagged animals or batches, with an event log (births, deaths, sales, purchases, vet visits, weight checks)
- A live dashboard summarizing everything above, per farm
- Forgot your password? Reset it by email, no admin needed

---

## Tech stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, PostgreSQL (Neon) |
| Auth | JWT, bcrypt |
| Caching | Redis (Upstash) |
| Email | Resend |
| Frontend | React (Vite), React Router, Axios |
| Hosting | Render (backend + frontend) |

---

## A few design choices worth knowing

- **Every ID is a UUID**, not an auto-increment number — safer to expose in URLs, and avoids ID-guessing.
- **Balances are never stored as a single number.** Every input/stock movement is logged as its own row; the current balance is calculated by summing the log — like a bank ledger, so it can't silently drift out of sync.
- **Livestock supports two shapes at once**: individually tagged animals (with a tag ID, birth date, sex) and untagged batches (with just a quantity) — enforced at the database level so the two can't mix incorrectly.
- **Access is scoped per farm, not globally.** One person can be an owner of one farm and a worker on another; every request checks their role on *that specific farm*.

---

## Project structure

```
MkulimaHub/
├── backend/
│   ├── config/          # PostgreSQL + Redis connections
│   ├── controllers/     # request handlers
│   ├── models/          # SQL queries
│   ├── routes/          # Express routers, nested by resource
│   ├── middleware/      # auth, role checks, error handler
│   ├── validators/      # Joi schemas
│   ├── utils/           # pagination, caching, email
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # one file per resource
        ├── context/      # auth + selected-farm state
        ├── components/   # route guards
        └── pages/        # Login, Register, Dashboard, Team, Fields, Inputs, Stock, Livestock, etc.
```

---

## Running it locally

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/mkulimahub
JWT_SECRET=replace_with_a_long_random_string
REDIS_URL=your_upstash_redis_url
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

Create the database and load the schema:
```bash
createdb mkulimahub
psql mkulimahub < schema.sql
```

Start it:
```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`, expecting the backend at `http://localhost:3000/api`.

---

## Status

Core product complete and live: authentication, multi-farm role-based access, team invites with automated email, password recovery, all four resource types (fields, inputs, stock, livestock) with full CRUD, a live dashboard, and Redis caching. Not yet done: automated tests.
