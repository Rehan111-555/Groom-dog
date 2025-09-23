// middleware.js (Edge-safe auth gate – no next-auth imports)
import { NextResponse } from "next/server";

/**
 * NextAuth uses one of these cookie names:
 * - "__Secure-next-auth.session-token" (on HTTPS / production)
 * - "next-auth.session-token" (on HTTP / localhost)
 */
function readSessionCookie(cookies) {
  return (
    cookies.get("__Secure-next-auth.session-token")?.value ||
    cookies.get("next-auth.session-token")?.value ||
    null
  );
}

export function middleware(req) {
  const { nextUrl, cookies } = req;
  const token = readSessionCookie(cookies);
  const isAuthed = Boolean(token);

  const isAuthPage = nextUrl.pathname === "/login";
  const isNextAuthAPI = nextUrl.pathname.startsWith("/api/auth");

  // Not logged in → redirect to /login
  if (!isAuthed && !isAuthPage && !isNextAuthAPI) {
    const url = new URL("/login", nextUrl.origin);
    url.searchParams.set("callbackUrl", nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Logged in and trying to view /login → send to callback or home
  if (isAuthed && isAuthPage) {
    const to = nextUrl.searchParams.get("callbackUrl") || "/";
    return NextResponse.redirect(new URL(to, nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  // Protect everything except the NextAuth endpoints, your image/API routes, and static assets
  matcher: [
    "/((?!api/auth|api/groom|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)).*)",
  ],
};
