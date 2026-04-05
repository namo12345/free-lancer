import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const authCookie = request.cookies.get("hiresense-auth");
  const isAuthenticated = authCookie?.value === "admin";

  // Redirect unauthenticated users trying to access dashboard
  const pathname = request.nextUrl.pathname;
  const isDashboardRoute = /^\/[a-z]{2}\/(dashboard|freelancer|employer|admin)/.test(pathname);

  if (!isAuthenticated && isDashboardRoute) {
    const locale = pathname.split("/")[1] || "en";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return response;
}
