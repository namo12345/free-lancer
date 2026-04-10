# Security, Performance, Dark Mode & Milestones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the platform with rate limiting and auth consistency, add pagination/skeletons/caching for performance, wire up dark mode toggle, and build milestone management UI.

**Architecture:** In-memory sliding window rate limiter applied via middleware-level helper to API routes. `withAuth` HOF wraps API handlers for consistent auth + role checks. `next-themes` for dark mode with localStorage persistence. Milestone pages use server/client split pattern matching existing codebase conventions.

**Tech Stack:** Next.js 14, next-themes, Prisma, Supabase Auth, Tailwind CSS (class-based dark mode)

---

## File Structure

### Security
- Create: `apps/web/src/app/api/_lib/rate-limit.ts` — sliding window rate limiter
- Create: `apps/web/src/app/api/_lib/with-auth.ts` — auth + role HOF for API routes
- Modify: `apps/web/src/app/api/v1/ai/skills/extract/route.ts` — add auth
- Modify: `apps/web/src/app/api/v1/ai/match/score/route.ts` — add auth
- Modify: `apps/web/src/app/api/v1/ai/match/pricing/route.ts` — add auth
- Modify: `apps/web/src/app/api/v1/ai/search/freelancers/route.ts` — add auth + rate limit
- Modify: `apps/web/src/app/api/v1/ai/search/gigs/route.ts` — add auth + rate limit
- Modify: `apps/web/src/app/api/v1/research/route.ts` — add rate limit
- Modify: `apps/web/src/app/api/v1/news/route.ts` — add rate limit

### Performance
- Create: `apps/web/src/components/ui/pagination.tsx` — reusable pagination component
- Create: `apps/web/src/components/ui/dashboard-skeleton.tsx` — skeleton layouts for dashboards
- Modify: `apps/web/src/server/actions/dashboard.actions.ts` — add pagination to getMyBids, getMyGigs, getMyInvoices + caching
- Modify: `apps/web/src/app/[locale]/(dashboard)/freelancer/bids/page.tsx` — add pagination + Suspense
- Modify: `apps/web/src/app/[locale]/(dashboard)/employer/gigs/page.tsx` — add pagination + Suspense
- Modify: `apps/web/src/app/[locale]/(dashboard)/freelancer/invoices/page.tsx` — add pagination + Suspense
- Modify: `apps/web/src/app/[locale]/(dashboard)/employer/invoices/page.tsx` — add pagination + Suspense

### Dark Mode
- Modify: `apps/web/package.json` — add next-themes dependency
- Create: `apps/web/src/components/theme-provider.tsx` — ThemeProvider wrapper
- Create: `apps/web/src/components/layout/theme-toggle.tsx` — dark mode toggle button
- Modify: `apps/web/src/app/layout.tsx` — wrap with ThemeProvider
- Modify: `apps/web/src/components/layout/navbar.tsx` — add ThemeToggle
- Modify: `apps/web/src/components/layout/sidebar.tsx` — dark mode classes
- Modify: `apps/web/src/app/[locale]/(dashboard)/layout.tsx` — dark mode bg

### Milestones
- Create: `apps/web/src/server/actions/milestone.actions.ts` — server actions for milestones
- Create: `apps/web/src/app/[locale]/(dashboard)/freelancer/milestones/page.tsx` — freelancer milestone page
- Create: `apps/web/src/app/[locale]/(dashboard)/freelancer/milestones/client.tsx` — freelancer milestone client
- Create: `apps/web/src/app/[locale]/(dashboard)/employer/milestones/page.tsx` — employer milestone page
- Create: `apps/web/src/app/[locale]/(dashboard)/employer/milestones/client.tsx` — employer milestone client
- Modify: `apps/web/src/components/layout/sidebar.tsx` — add milestones nav links

---

### Task 1: Rate Limiter

**Files:**
- Create: `apps/web/src/app/api/_lib/rate-limit.ts`

- [ ] **Step 1: Create rate limiter**

In-memory sliding window rate limiter using Map. No external deps.

```typescript
// apps/web/src/app/api/_lib/rate-limit.ts
import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/_lib/rate-limit.ts
git commit -m "feat: add in-memory sliding window rate limiter for API routes"
```

---

### Task 2: withAuth Higher-Order Function

**Files:**
- Create: `apps/web/src/app/api/_lib/with-auth.ts`

- [ ] **Step 1: Create withAuth wrapper**

```typescript
// apps/web/src/app/api/_lib/with-auth.ts
import { NextRequest } from "next/server";
import { getAuthUser, jsonError } from "./auth";
import { rateLimit, getClientIp, rateLimitResponse } from "./rate-limit";

type Role = "FREELANCER" | "EMPLOYER" | "ADMIN";

interface AuthUser {
  id: string;
  supabaseId: string;
  email: string;
  role: Role;
  displayName: string | null;
}

interface WithAuthOptions {
  roles?: Role[];
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

type AuthenticatedHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: AuthUser
) => Promise<Response>;

export function withAuth(handler: AuthenticatedHandler, options: WithAuthOptions = {}) {
  const { roles, rateLimitMax = 60, rateLimitWindowMs = 60_000 } = options;

  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    // Rate limit check
    const ip = getClientIp(req);
    const rlKey = `${ip}:${req.nextUrl.pathname}`;
    const rl = rateLimit(rlKey, rateLimitMax, rateLimitWindowMs);
    if (!rl.success) return rateLimitResponse(rl.resetAt);

    // Auth check
    const user = await getAuthUser(req);
    if (!user) return jsonError("Unauthorized", 401);

    // Role check
    if (roles && !roles.includes(user.role as Role)) {
      return jsonError("Forbidden", 403);
    }

    return handler(req, context, user as AuthUser);
  };
}

// Rate limit only (no auth required) for public endpoints
export function withRateLimit(
  handler: (req: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<Response>,
  max = 30,
  windowMs = 60_000
) {
  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    const ip = getClientIp(req);
    const rlKey = `${ip}:${req.nextUrl.pathname}`;
    const rl = rateLimit(rlKey, max, windowMs);
    if (!rl.success) return rateLimitResponse(rl.resetAt);

    return handler(req, context);
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/_lib/with-auth.ts
git commit -m "feat: add withAuth HOF for consistent API auth + rate limiting"
```

---

### Task 3: Protect AI Endpoints

**Files:**
- Modify: All AI API routes to add auth + rate limiting

- [ ] **Step 1: Add withAuth/withRateLimit to AI routes**

Each AI route needs the import and wrapper. AI search endpoints get auth + lower rate limits (10/min). News/research get rate limiting only (30/min).

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/api/v1/ai/ apps/web/src/app/api/v1/research/ apps/web/src/app/api/v1/news/
git commit -m "feat: add auth and rate limiting to AI and public API endpoints"
```

---

### Task 4: Pagination Component + Server Action Updates

**Files:**
- Create: `apps/web/src/components/ui/pagination.tsx`
- Modify: `apps/web/src/server/actions/dashboard.actions.ts`

- [ ] **Step 1: Create pagination component**

Reusable Previous/Next with page numbers, works as client component with searchParams.

- [ ] **Step 2: Add pagination to getMyBids, getMyGigs, getMyInvoices**

Add optional `page` and `limit` params, return `{ data, total, page, totalPages }`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ui/pagination.tsx apps/web/src/server/actions/dashboard.actions.ts
git commit -m "feat: add pagination component and paginated server actions"
```

---

### Task 5: Loading Skeletons + Suspense

**Files:**
- Create: `apps/web/src/components/ui/dashboard-skeleton.tsx`
- Modify: Dashboard pages to add Suspense boundaries

- [ ] **Step 1: Create skeleton components**

Dashboard skeleton, list skeleton, card skeleton variants.

- [ ] **Step 2: Wrap dashboard pages with Suspense + loading.tsx files**

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add loading skeletons and Suspense boundaries to dashboard pages"
```

---

### Task 6: Caching for Expensive Queries

**Files:**
- Modify: `apps/web/src/server/actions/dashboard.actions.ts`

- [ ] **Step 1: Add unstable_cache to admin dashboard and analytics aggregations**

Wrap getAdminDashboardData and analytics queries with `unstable_cache` (30s TTL).

- [ ] **Step 2: Commit**

```bash
git commit -m "feat: add caching for expensive dashboard aggregation queries"
```

---

### Task 7: Dark Mode Toggle

**Files:**
- Create: `apps/web/src/components/theme-provider.tsx`
- Create: `apps/web/src/components/layout/theme-toggle.tsx`
- Modify: `apps/web/src/app/layout.tsx`
- Modify: `apps/web/src/components/layout/navbar.tsx`

- [ ] **Step 1: Install next-themes**

```bash
cd apps/web && pnpm add next-themes
```

- [ ] **Step 2: Create ThemeProvider**
- [ ] **Step 3: Create ThemeToggle component**
- [ ] **Step 4: Wire into layout and navbar**
- [ ] **Step 5: Fix hardcoded white/gray classes in navbar, sidebar, dashboard layout**
- [ ] **Step 6: Commit**

```bash
git commit -m "feat: add dark mode toggle with next-themes and localStorage persistence"
```

---

### Task 8: Milestone Management Pages

**Files:**
- Create: `apps/web/src/server/actions/milestone.actions.ts`
- Create: Freelancer + Employer milestone pages and client components
- Modify: `apps/web/src/components/layout/sidebar.tsx`

- [ ] **Step 1: Create milestone server actions**
- [ ] **Step 2: Create freelancer milestones page (server/client split)**
- [ ] **Step 3: Create employer milestones page (server/client split)**
- [ ] **Step 4: Add sidebar nav links for milestones**
- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add milestone management pages for freelancer and employer"
```

---

### Task 9: Build Verification

- [ ] **Step 1: Run build**

```bash
pnpm --filter @hiresense/web build
```

- [ ] **Step 2: Fix any type errors or build failures**
- [ ] **Step 3: Final commit if fixes needed**

---

### Task 10: Manual Browser Testing

- [ ] **Step 1: Start dev server and test all AI tools**
- [ ] **Step 2: Test dark mode toggle**
- [ ] **Step 3: Test pagination on list pages**
- [ ] **Step 4: Test milestone management flow**
- [ ] **Step 5: Verify rate limiting works on AI endpoints**
