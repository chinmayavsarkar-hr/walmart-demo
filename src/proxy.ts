import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_TOKEN } from "@/lib/session";

/**
 * Auth gate (Next 16 renamed `middleware` → `proxy`). Runs before render:
 * - unauthenticated requests are redirected to /login
 * - authenticated requests to /login are bounced to the dashboard
 */
export function proxy(request: NextRequest) {
  const authed =
    request.cookies.get(SESSION_COOKIE)?.value === SESSION_TOKEN;
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/login";

  if (!authed && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (authed && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals, static assets, and files with an extension.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
