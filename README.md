# HireSense

AI-powered freelancing platform built for India. Connects employers with skilled freelancers using semantic AI matchmaking, verified portfolios, and multilingual support.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js (Express), Python (FastAPI)
- **Database**: Supabase (PostgreSQL + pgvector + Auth + Realtime + Storage)
- **AI**: OpenRouter (free LLMs), HuggingFace (free embeddings)
- **Monorepo**: Turborepo + pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your Supabase, OpenRouter, HuggingFace keys

# Run database migrations
pnpm db:migrate

# Start development
pnpm dev
```

## Project Structure

```
hiresense/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Node.js API server
│   └── ai-services/  # Python FastAPI AI services
├── packages/
│   ├── db/           # Prisma schema & client
│   ├── ui/           # Shared shadcn/ui components
│   ├── shared/       # Types, validators, constants
│   └── config/       # Shared ESLint, TS, Tailwind configs
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:seed` | Seed the database |
