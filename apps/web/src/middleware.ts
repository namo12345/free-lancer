import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First, handle Supabase session refresh
  const sessionResponse = await updateSession(request);

  // If session update returned a redirect, use that
  if (sessionResponse.headers.get("location")) {
    return sessionResponse;
  }

  // Then apply i18n routing
  const intlResponse = intlMiddleware(request);

  // Copy Supabase cookies to the intl response
  sessionResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    // Match all pathnames except: api, _next, static files
    "/((?!api|_next|.*\\..*).*)",
  ],
};
