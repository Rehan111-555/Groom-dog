// middleware.js
export { default } from "next-auth/middleware";

/**
 * Protect everything except:
 * - /signin
 * - Next internals: /api/auth, /_next/static, /_next/image
 * - Common root files: /favicon.ico, /robots.txt, /sitemap.xml
 * - Any request that looks like a static file (has a dot in the last segment)
 */
export const config = {
  matcher: [
    "/((?!signin|api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
