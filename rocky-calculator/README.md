# 🧮 Rocky Calculator

A social media-inspired calculator app built with Next.js, TypeScript, TypeORM, and SQLite.

## Features

- ✅ Basic arithmetic operations (addition, subtraction, multiplication, division)
- ✅ Calculation history saved to SQLite database
- ✅ Dark/Light theme toggle
- ✅ Share calculations to clipboard
- ✅ Keyboard support
- ✅ Responsive design
- ✅ Modern social media-inspired UI

## Getting Started

### Local Development

```bash
cd rocky-calculator
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# From the root directory (where docker-compose.yml is)
docker-compose up --build
```

## API Routes

- `GET /api/calculations` — Get all calculations (ordered by most recent)
- `POST /api/calculations` — Save a new calculation
- `DELETE /api/calculations` — Clear all calculations

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_PATH` | `./data/rocky-calculator.sqlite` | Path to SQLite database |
| `NEXT_PUBLIC_APP_NAME` | `Rocky Calculator` | App display name |

## Tech Stack

- **Next.js 14** — React framework
- **TypeScript** — Type safety
- **TypeORM** — Database ORM
- **better-sqlite3** — SQLite driver
- **CSS Custom Properties** — Theming
