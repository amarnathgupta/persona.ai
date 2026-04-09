# Persona.ai — Backend

Express + TypeScript backend for Persona.ai. Handles auth, persona management, and AI-powered chat.

## Tech Stack

| Layer        | Tool                 |
| ------------ | -------------------- |
| Runtime      | Bun                  |
| Framework    | Express + TypeScript |
| Postgres ORM | Prisma               |
| Mongo ODM    | Mongoose             |
| AI           | OpenRouter           |

## Project Structure

```
src/
├── config/         env vars
├── controllers/    route handlers (auth, chat, persona)
├── db/             database connection setup
├── lib/            prisma client instance
├── middlewares/    auth, creatorOnly, error handler
├── models/         Mongoose Persona model
├── routes/         Express routers
├── services/       ai.service, llm.service
├── types/          express augmentations
└── utils/          asyncHandler, sendResponse
prisma/
└── schema.prisma   User, Chat, Message models
```

## Getting Started

```bash
# Install dependencies
bun install

# Setup env
cp .env.example .env

# Run migrations
bunx prisma migrate dev

# Start dev server
bun dev
```

## Environment Variables

```env
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...
REDIS_URL=redis://...
JWT_SECRET=...
OPENROUTER_API_KEY=...
PORT=8000
```

## API Endpoints

### Auth — `/api/auth`

| Method | Route     | Description              |
| ------ | --------- | ------------------------ |
| POST   | `/signup` | Register — returns JWT   |
| POST   | `/login`  | Login — returns JWT      |
| GET    | `/me`     | Current user (protected) |

### Personas — `/api/personas`

All routes protected. `PATCH` / `DELETE` require creator ownership.

| Method | Route  | Description                               |
| ------ | ------ | ----------------------------------------- |
| GET    | `/`    | List public personas (search, tag filter) |
| GET    | `/:id` | Single persona — Redis → Mongo            |
| POST   | `/`    | Create persona                            |
| PATCH  | `/:id` | Update persona                            |
| DELETE | `/:id` | Delete persona                            |

### Chats — `/api/chats`

All routes protected.

| Method | Route                          | Description                         |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/`                            | Create chat session with a persona  |
| GET    | `/`                            | List user's chats                   |
| GET    | `/:chatId/messages`            | Paginated message history           |
| POST   | `/:chatId/messages`            | Send message → AI reply → save both |
| DELETE | `/:chatId`                     | Delete chat                         |
| DELETE | `/:chatId/messages/:messageId` | Delete single message               |

## Data Flow — Chat Message

```
POST /:chatId/messages
  → verify chat belongs to user (Postgres)
  → fetch persona via Redis → Mongo fallback
  → save user message (Postgres)
  → buildSystemPrompt(persona)
  → fetch last 20 messages for context
  → generateReply(systemPrompt, history)
  → save AI message (Postgres)
  → return AI response
```

## Database Design

**Postgres** — Users, Chats, Messages (relational, ordered)

**MongoDB** — Personas (flexible schema: systemPrompt, tone, personality traits, example dialogues)
