# HireSense - AI-Powered Indian Freelancing Platform (Cost-Free Edition)

## Context

Brand new AI-powered freelancing platform for India. Differentiates from Upwork/Fiverr with: semantic AI matchmaking, verified portfolios, multilingual support, and analytics. Built on a **zero-cost / minimal-cost** stack using free tiers and open-source alternatives.

**Key constraint**: No payment gateway integration. The platform generates **invoices** (PDF) instead of processing payments directly. AI features use **OpenRouter free models** instead of paid OpenAI APIs. All infrastructure uses **free tiers**.

**Approach**: Build Phases 1-3 together as one cohesive MVP.

---

## Tech Stack (Free / Minimal Cost)

| Layer | Technology | Cost |
|-------|-----------|------|
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui | Free |
| **Backend API** | Node.js (Express) - business logic, background jobs | Free |
| **AI Services** | Python FastAPI - all ML/AI workloads | Free |
| **Database** | Supabase PostgreSQL (free tier: 500MB, 2 projects) | Free |
| **Auth** | Supabase Auth (free tier: 50K MAUs) | Free |
| **Real-time** | Supabase Realtime (free tier: 200 concurrent connections) | Free |
| **Storage** | Supabase Storage (free tier: 1GB) | Free |
| **Vector DB** | pgvector extension in Supabase (no Pinecone needed!) | Free |
| **AI/LLM** | OpenRouter free models (Llama 3.1, Mistral, Gemma) | Free |
| **Embeddings** | HuggingFace Inference API (free tier) or `nomic-embed-text` via OpenRouter | Free |
| **Invoicing** | @react-pdf/renderer (generate PDF invoices in-app) | Free |
| **i18n** | next-intl (en, hi, ta, te, bn) | Free |
| **Monorepo** | Turborepo + pnpm workspaces | Free |
| **Deploy Frontend** | Vercel (free tier: 100GB bandwidth) | Free |
| **Deploy Backend** | Render.com (free tier: 750 hrs/mo) or Railway ($5 credit) | Free/$5 |
| **Email** | Resend (free tier: 100 emails/day) | Free |
| **Cache** | Supabase (in-DB caching) - skip Redis for MVP | Free |

### Total Monthly Cost: $0 - $5

### Why This Stack Works for Free
- **Supabase pgvector** replaces Pinecone entirely - vector similarity search runs inside your existing Postgres database
- **OpenRouter free models** (Llama 3.1 8B, Mistral 7B, Gemma 2 9B) handle matchmaking, search re-ranking, and text extraction
- **HuggingFace Inference API** free tier provides embeddings (nomic-embed-text or all-MiniLM-L6-v2)
- **Invoice generation** via @react-pdf/renderer is a pure JS library - no payment gateway needed
- **Supabase free tier** covers auth, database, storage, realtime all in one

---

## Monorepo Structure

```
hiresense/
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── PROGRESS.md
├── plan.md
├── .gitignore
├── .env.example
├── README.md
│
├── apps/
│   ├── web/                    # Next.js frontend (Vercel)
│   │   ├── src/app/
│   │   │   ├── [locale]/
│   │   │   │   ├── (marketing)/    # Landing, pricing (public)
│   │   │   │   ├── (auth)/         # Login, signup, onboarding
│   │   │   │   ├── (dashboard)/    # Authenticated dashboards
│   │   │   │   │   ├── freelancer/
│   │   │   │   │   ├── employer/
│   │   │   │   │   └── admin/
│   │   │   │   ├── gigs/           # Browse/search gigs
│   │   │   │   ├── profiles/       # Public freelancer profiles
│   │   │   │   └── messages/       # Chat
│   │   │   └── api/
│   │   │       └── webhooks/       # Supabase webhooks
│   │   ├── src/server/actions/     # Server Actions (mutations)
│   │   ├── src/components/
│   │   ├── src/hooks/
│   │   ├── src/lib/
│   │   │   ├── supabase/           # Supabase client (server + browser)
│   │   │   └── invoice/            # PDF invoice generation
│   │   ├── src/stores/             # Zustand
│   │   ├── messages/               # i18n JSON (en, hi, ta, te, bn)
│   │   └── middleware.ts           # Supabase auth + next-intl
│   │
│   ├── api/                    # Node.js API server (Render.com)
│   │   └── src/
│   │       ├── routes/             # REST endpoints
│   │       ├── services/           # Business logic
│   │       ├── middleware/         # Auth verification, rate limiting
│   │       └── invoice/            # Invoice generation service
│   │
│   └── ai-services/            # Python FastAPI (Render.com)
│       └── app/
│           ├── main.py
│           ├── routers/            # search, matching, pricing, skills
│           ├── services/
│           │   ├── embeddings.py   # HuggingFace free embeddings
│           │   ├── vector_store.py # pgvector via Supabase
│           │   ├── llm.py          # OpenRouter free models
│           │   └── matching.py     # AI matchmaking logic
│           └── models/             # Pydantic schemas
│
├── packages/
│   ├── ui/                     # Shared shadcn/ui components
│   ├── db/                     # Prisma schema + client + migrations
│   ├── shared/                 # Types, Zod validators, constants
│   ├── email/                  # React Email templates
│   └── config/                 # Shared ESLint, TS, Tailwind configs
```

---

## Database Schema (Core Tables)

Using Prisma with Supabase PostgreSQL + pgvector extension.

### Core Models
- **User** - supabaseId, email, phone, role (FREELANCER/EMPLOYER/ADMIN), preferredLang
- **FreelancerProfile** - displayName, headline, bio, hourlyRate, city/state, lat/lng, githubUrl, behanceUrl, aiPersonalityTags[], avgRating, totalEarnings, embedding (vector(384))
- **EmployerProfile** - companyName, displayName, industry, totalSpent
- **Skill** - name, slug, category, embedding (vector(384))
- **FreelancerSkill** - freelancerId, skillId, yearsExp, proficiency
- **PortfolioItem** - freelancerId, title, source (github/behance/manual), metadata (JSON)
- **SkillBadge** - freelancerId, skillName, badgeType, score
- **Gig** - posterId, title, description, category, budgetMin/Max, deadline, status (DRAFT/OPEN/IN_PROGRESS/COMPLETED), aiSuggestedPrice, lat/lng, isRemote, embedding (vector(384))
- **GigSkill** - gigId, skillId
- **Bid** - gigId, freelancerId, amount, deliveryDays, coverLetter, status, matchScore, aiRationale

### Invoice System (replaces Escrow/Payments)
- **Invoice** - id, gigId, employerId, freelancerId, invoiceNumber (auto-generated), items (JSONB), subtotal, platformFee, gst, totalAmount, currency (INR), status (DRAFT/SENT/PAID/CANCELLED), dueDate, paidAt, notes
- **InvoiceItem** - invoiceId, description (milestone name), quantity, rate, amount
- **Milestone** - gigId, title, description, amount, orderIndex, status (PENDING/IN_PROGRESS/SUBMITTED/APPROVED), deliverables

Note: No actual payment processing. The Invoice model tracks what's owed. Employer marks "Paid" manually after offline payment (UPI/bank transfer). Platform generates a professional PDF invoice.

### Other Models
- **Review** - authorId, targetId, gigId, rating, communicationRating, qualityRating, timelinessRating
- **Conversation** / **Message** - real-time chat via Supabase Realtime
- **Notification** - userId, type, title, body, isRead

### AI-specific
- **FreelancerDNA** - hard_skills (JSONB), soft_skills[], quality_score, content_hash
- **SkillDemand** - skill, demand_score, job_count_30d, growth_rate

### pgvector Setup (in Supabase SQL)
```sql
-- Enable pgvector extension (free in Supabase)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding columns (384 dims for all-MiniLM-L6-v2)
ALTER TABLE "FreelancerProfile" ADD COLUMN embedding vector(384);
ALTER TABLE "Gig" ADD COLUMN embedding vector(384);
ALTER TABLE "Skill" ADD COLUMN embedding vector(384);

-- Create HNSW index for fast similarity search
CREATE INDEX ON "FreelancerProfile" USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON "Gig" USING hnsw (embedding vector_cosine_ops);
```

---

## AI Architecture (Free-Tier)

### OpenRouter Free Models
Use OpenRouter API (same API format as OpenAI, but with free model access):

| Use Case | Model | Cost |
|----------|-------|------|
| Match scoring & re-ranking | `meta-llama/llama-3.1-8b-instruct:free` | Free |
| Skill extraction from text | `mistralai/mistral-7b-instruct:free` | Free |
| Job description generation | `google/gemma-2-9b-it:free` | Free |
| Fallback (if free limits hit) | `meta-llama/llama-3.1-8b-instruct` (paid) | ~$0.06/1M tokens |

### Embeddings (Free)
| Option | Model | Dims | Cost |
|--------|-------|------|------|
| **Primary** | HuggingFace Inference API: `all-MiniLM-L6-v2` | 384 | Free (rate limited) |
| **Fallback** | OpenRouter: `nomic-ai/nomic-embed-text` | 768 | Free tier available |

### Vector Search (pgvector in Supabase - Free)
Instead of Pinecone ($25+/mo), use pgvector which is **built into Supabase for free**:
- Store embeddings directly in PostgreSQL
- Use cosine similarity search: `SELECT * FROM gigs ORDER BY embedding <=> $query_embedding LIMIT 10`
- HNSW index for sub-100ms search up to 100K vectors
- No external service needed

### AI Data Flow
```
User searches "minimalist logo designer in Bangalore"
    │
    ▼
FastAPI ai-services:
    1. Generate query embedding (HuggingFace free API)
    2. pgvector similarity search (Supabase Postgres)
       SELECT *, embedding <=> $query_emb AS distance
       FROM "FreelancerProfile"
       WHERE city = 'Bangalore'
       ORDER BY distance
       LIMIT 50
    3. Re-rank top 50 with Llama 3.1 (OpenRouter free)
       - Send profiles + query to LLM
       - Score relevance 0-100
    4. Return top 10 with explanations
```

### AI Endpoints (FastAPI)
```
POST /ai/v1/search/freelancers      # Semantic freelancer search
POST /ai/v1/search/gigs             # Semantic gig search
POST /ai/v1/match/score             # Score a freelancer-gig pair
POST /ai/v1/skills/extract          # Extract skills from text
POST /ai/v1/pricing/suggest         # Rule-based pricing suggestion
```

---

## Invoice System (Replaces Payment Gateway)

### How It Works
1. Employer accepts bid -> system creates **Invoice** with milestones as line items
2. Invoice PDF generated via `@react-pdf/renderer` with:
   - HireSense branding + invoice number
   - Freelancer details (name, contact)
   - Employer details (name, company)
   - Line items (milestones with amounts)
   - Platform fee (10%) + GST (18% on fee)
   - Total in INR
   - Payment instructions (freelancer's UPI ID / bank details)
3. Employer downloads PDF and pays freelancer **directly** (UPI/bank transfer)
4. Employer marks invoice as "Paid" on platform
5. Platform tracks payment status for analytics/reviews

### Invoice PDF Template
```
┌─────────────────────────────────────────┐
│  HIRESENSE                  INVOICE    │
│  ─────────────────────────────────────  │
│  Invoice #: BW-2026-0001               │
│  Date: March 15, 2026                  │
│  Due: March 30, 2026                   │
│                                         │
│  FROM: Employer Name / Company          │
│  TO:   Freelancer Name                  │
│                                         │
│  ┌──────────────┬───────┬──────────┐   │
│  │ Description  │  Qty  │  Amount  │   │
│  ├──────────────┼───────┼──────────┤   │
│  │ Milestone 1  │   1   │ ₹10,000  │   │
│  │ Milestone 2  │   1   │ ₹15,000  │   │
│  ├──────────────┼───────┼──────────┤   │
│  │ Subtotal     │       │ ₹25,000  │   │
│  │ Platform Fee │  10%  │  ₹2,500  │   │
│  │ GST (18%)    │       │    ₹450  │   │
│  │ TOTAL        │       │ ₹27,950  │   │
│  └──────────────┴───────┴──────────┘   │
│                                         │
│  PAYMENT DETAILS:                       │
│  UPI: freelancer@upi                    │
│  Bank: HDFC XXXX1234                    │
│  IFSC: HDFC0001234                      │
└─────────────────────────────────────────┘
```

---

## Combined MVP Build: Phases 1-3 (Weeks 1-8)

### Step 0: Project Setup (Day 1-2)
1. `git init` in project root
2. Create `PROGRESS.md`, `plan.md`, `.gitignore`, `.env.example`, `README.md`
3. Initialize Turborepo monorepo with pnpm workspaces
4. Set up `packages/config` (shared ESLint, TypeScript, Tailwind configs)
5. Set up `packages/shared` (Zod validators, TypeScript types, enums, constants)
6. Create Supabase project (free tier) + get connection strings

**Critical files**:
- `hiresense/turbo.json`
- `hiresense/package.json` + `pnpm-workspace.yaml`
- `hiresense/.env.example`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  OPENROUTER_API_KEY=
  HUGGINGFACE_API_KEY=
  DATABASE_URL=          # Supabase Postgres connection string
  DIRECT_URL=            # Supabase direct connection (for migrations)
  ```

### Step 1: Database & Auth (Day 3-5)
1. Set up `packages/db` with Prisma schema (ALL core models)
2. Enable pgvector extension in Supabase SQL editor
3. Run `prisma migrate` against Supabase Postgres
4. Set up Supabase Auth (phone OTP + email + Google)
5. Create `apps/web/src/lib/supabase/` (server + browser clients)
6. Create `middleware.ts` (Supabase auth session + next-intl locale)
7. Seed database with skills/categories

**Critical files**:
- `packages/db/prisma/schema.prisma`
- `apps/web/src/lib/supabase/server.ts`
- `apps/web/src/lib/supabase/client.ts`
- `apps/web/src/middleware.ts`
- `packages/db/prisma/seed.ts`

### Step 2: UI Foundation (Day 6-8)
1. Set up `apps/web` (Next.js 14, App Router, Tailwind, TypeScript)
2. Set up `packages/ui` with shadcn/ui components: button, card, form, input, select, textarea, table, badge, avatar, sidebar, skeleton, sonner, dialog, sheet, dropdown-menu, tabs, separator, pagination
3. Create dashboard layout with shadcn sidebar
4. Create marketing layout (landing page shell)
5. Set up next-intl (English only initially)

**Critical files**:
- `apps/web/src/app/[locale]/(dashboard)/layout.tsx`
- `apps/web/src/app/[locale]/(marketing)/layout.tsx`

### Step 3: Auth Flow & Profiles (Day 9-13)
1. Auth pages: login (phone OTP + email + Google), signup
2. Onboarding flow: role selection -> profile setup wizard
3. Freelancer profile: edit + public view (name, headline, bio, skills, hourlyRate, city, avatar via Supabase Storage)
4. Employer profile: edit page
5. Skill selector component (searchable multi-select)
6. Avatar upload to Supabase Storage

**Critical files**:
- `apps/web/src/app/[locale]/(auth)/login/page.tsx`
- `apps/web/src/app/[locale]/(auth)/onboarding/page.tsx`
- `apps/web/src/app/[locale]/(dashboard)/freelancer/profile/page.tsx`
- `apps/web/src/app/[locale]/profiles/[id]/page.tsx`

### Step 4: Gig Posting & Browsing (Day 14-18)
1. Post gig form: title, description, category, skills, budget, deadline, remote/local
2. Gig detail page (public)
3. Browse gigs: paginated, filterable by category, skills, budget, location
4. PostgreSQL full-text search + pgvector semantic search
5. Gig status management (DRAFT -> OPEN -> IN_PROGRESS -> COMPLETED)
6. Employer dashboard: "My Gigs" list

**Critical files**:
- `apps/web/src/app/[locale]/(dashboard)/employer/gigs/new/page.tsx`
- `apps/web/src/app/[locale]/gigs/page.tsx`
- `apps/web/src/app/[locale]/gigs/[id]/page.tsx`
- `apps/web/src/server/actions/gig.actions.ts`

### Step 5: Bidding System + AI Matching (Day 19-23)
1. Bid submission form (amount, delivery days, cover letter)
2. Employer view: bids sorted by AI match score
3. Accept/reject bid
4. Freelancer dashboard: "My Bids" list
5. Set up `apps/api` (Express server)
6. Set up `apps/ai-services` (FastAPI)
7. Embedding pipeline: on gig publish -> HuggingFace embed -> store in pgvector
8. AI match scoring: on bid submit -> OpenRouter free LLM scores compatibility
9. In-app notifications (Notification model + Supabase Realtime)

**Critical files**:
- `apps/api/src/routes/bid.routes.ts`
- `apps/ai-services/app/main.py`
- `apps/ai-services/app/services/embeddings.py` (HuggingFace free API)
- `apps/ai-services/app/services/vector_store.py` (pgvector queries)
- `apps/ai-services/app/services/llm.py` (OpenRouter free models)

### Step 6: Invoice & Milestone System (Day 24-30)
1. Accept bid -> create Invoice with milestones as line items
2. Invoice model: auto-generated number (BW-YYYY-NNNN), line items, fees, totals
3. PDF generation with `@react-pdf/renderer` (HireSense branded template)
4. Invoice download endpoint
5. Milestone workflow: Freelancer submits deliverable (Supabase Storage upload) -> Employer reviews -> Approve
6. Employer marks invoice as "Paid" (manual, after offline UPI/bank payment)
7. Invoice history pages (employer + freelancer views)
8. Email notification on invoice creation (Resend free tier)

**Critical files**:
- `apps/web/src/lib/invoice/generate-pdf.tsx` (React PDF template)
- `apps/api/src/routes/invoice.routes.ts`
- `apps/api/src/services/invoice.service.ts`
- `apps/web/src/app/[locale]/(dashboard)/employer/invoices/page.tsx`
- `apps/web/src/app/[locale]/(dashboard)/freelancer/invoices/page.tsx`

### Step 7: Integration & Deploy (Day 31-36)
1. End-to-end test: signup -> post gig -> bid -> accept -> view invoice -> download PDF -> mark paid
2. Fix integration bugs
3. Deploy: Vercel free tier (web) + Render.com free tier (API + AI services)
4. Environment variables configured
5. Update PROGRESS.md

---

## Remaining Phases (Post-MVP)

### Phase 4: Communication & Real-time (Weeks 9-10)
- Supabase Realtime channels for chat (free, no Socket.io)
- Conversation + Message models
- Typing indicators, read receipts
- File sharing in chat (Supabase Storage)

### Phase 5: Verified Portfolios & AI Search (Weeks 11-13)
- GitHub/Behance API sync (free APIs)
- Skill assessment badges
- Full semantic search with pgvector + OpenRouter re-ranking
- "Why this match" explanations

### Phase 6: Vernacular & Voice (Weeks 14-16)
- next-intl: Hindi, Tamil, Telugu, Bengali translations
- Voice-to-task: use browser Web Speech API (free) or OpenRouter Whisper-compatible endpoint
- "Gigs Near Me" map view (Leaflet.js + OpenStreetMap - free)
- Geolocation filtering

### Phase 7: Reviews & Trust (Weeks 17-19)
- Star ratings with breakdown
- Trust score computation
- Basic dispute flag system (no peer-jury for MVP - admin reviews)

### Phase 8: Analytics & Growth (Weeks 20-22)
- Freelancer/employer analytics dashboards
- AI skill gap analysis (OpenRouter free models)
- Admin dashboard
- Referral system

---

## Key Technical Decisions

| Decision | Choice | Cost | Rationale |
|----------|--------|------|-----------|
| Auth + Realtime + Storage + DB | Supabase free tier | $0 | Replaces 4 paid services with one free platform |
| ORM | Prisma | $0 | Type generation, works with Supabase Postgres |
| Vector DB | pgvector (in Supabase) | $0 | Replaces Pinecone ($25+/mo), built into Postgres |
| AI/LLM | OpenRouter free models | $0 | Llama 3.1, Mistral 7B, Gemma 2 - all free |
| Embeddings | HuggingFace Inference API | $0 | all-MiniLM-L6-v2, free tier sufficient for MVP |
| Payments | None - Invoice PDFs only | $0 | @react-pdf/renderer generates branded invoices |
| Maps | Leaflet.js + OpenStreetMap | $0 | Replaces Google Maps ($200/mo credit but still metered) |
| Email | Resend free tier | $0 | 100 emails/day sufficient for MVP |
| Deploy Frontend | Vercel free tier | $0 | 100GB bandwidth, sufficient for MVP |
| Deploy Backend | Render.com free tier | $0 | 750 hrs/mo, auto-sleep on inactivity |

### Total infrastructure cost: $0/month

---

## Verification Plan

### MVP Verification (Phases 1-3)
1. **Auth**: Sign up with phone OTP -> complete onboarding -> verify profile in Supabase
2. **Profile**: Edit freelancer profile -> add skills -> upload avatar -> view public profile
3. **Gig**: Post gig as employer -> browse gigs -> find via search (keyword + semantic)
4. **Bid**: Freelancer submits bid -> employer sees bid with AI match score -> accept bid
5. **Invoice**: View generated invoice -> download PDF -> verify formatting and totals
6. **Milestone**: Submit deliverable -> employer approves -> employer marks invoice paid
7. **Full cycle**: Complete entire gig lifecycle end-to-end

### Run on each commit
- `pnpm lint` (ESLint across all packages)
- `pnpm typecheck` (tsc --noEmit)
- `pnpm test` (Vitest for frontend, Jest for API, pytest for AI services)
- `pnpm build` (Turborepo build pipeline)
