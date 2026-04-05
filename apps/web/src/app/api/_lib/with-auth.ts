import { NextRequest } from "next/server";
import { getAuthUser, jsonError } from "./auth";
import { rateLimit, getClientIp, rateLimitResponse } from "./rate-limit";

type Role = "FREELANCER" | "EMPLOYER" | "ADMIN";

interface WithAuthOptions {
  roles?: Role[];
  rateLimitMax?: number;
  rateLimitWindowMs?: number;
}

type AuthenticatedHandler = (
  req: NextRequest,
  context: { params: Promise<Record<string, string>> },
  user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>
) => Promise<Response>;

export function withAuth(handler: AuthenticatedHandler, options: WithAuthOptions = {}) {
  const { roles, rateLimitMax = 60, rateLimitWindowMs = 60_000 } = options;

  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    // Rate limit
    const ip = getClientIp(req);
    const rlKey = `${ip}:${req.nextUrl.pathname}`;
    const rl = rateLimit(rlKey, rateLimitMax, rateLimitWindowMs);
    if (!rl.success) return rateLimitResponse(rl.resetAt);

    // Auth
    const user = await getAuthUser(req);
    if (!user) return jsonError("Unauthorized", 401);

    // Role
    if (roles && !roles.includes(user.role as Role)) {
      return jsonError("Forbidden", 403);
    }

    return handler(req, context, user);
  };
}

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
