// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Safe auth gate:
 * - Lets /signin, /api/auth, Next assets, and public assets pass through
 * - For everything else, if there is NO session token, redirect to /signin
 * - Never throws (catches errors and allows request to continue)
 */
export async function middleware(req) {
  const { pathname, search } = req.nextUrl;

  // allowlist public routes & static assets
  const isPublic =
    pathname === "/signin" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml";

  if (isPublic) {
    return NextResponse.next();
  }

  try {
    // Check NextAuth JWT (uses Edge-safe getToken)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const url = new URL("/signin", req.url);
      // Preserve where the user came from
      url.searchParams.set("from", pathname + search);
      return NextResponse.redirect(url);
    }
  } catch (_err) {
    // Never crash the request pipeline
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Apply to all routes EXCEPT the ones above.
// This matcher syntax is supported in Next.js middleware.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|api/auth|signin).*)",
  ],
};
