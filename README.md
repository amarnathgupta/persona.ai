# Persona.ai

Character.ai-inspired platform to chat with AI personas. Built to learn prompt engineering in a real product.

## Monorepo Structure

```
persona.ai/
├── apps/
│   ├── backend/     Express + TypeScript API
│   └── frontend/    React + Vite + TailwindCSS
└── packages/
    └── shared/      Zod schemas shared across apps
```

## Tech Stack

|           |                                       |
| --------- | ------------------------------------- |
| Frontend  | React, TailwindCSS, Vite              |
| Backend   | Express, TypeScript, Bun              |
| Databases | Postgres (Prisma), MongoDB (Mongoose) |
| Shared    | Zod validation schemas                |

## Getting Started

```bash
# Install all dependencies from root
bun install

# Run backend
bun dev:backend

# Run frontend
bun dev:frontend
```

Each app has its own `.env` — see `apps/backend/.env.example` to get started.

## Apps

- [`apps/backend`](./apps/backend/README.md) — REST API, AI service, database layer
- `apps/frontend` — React client (in progress)

## Packages

- `packages/shared` — Zod schemas for User, Chat, Persona shared between frontend and backend
