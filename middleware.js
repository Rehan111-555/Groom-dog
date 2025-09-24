// middleware.js
export { default } from "next-auth/middleware";

// Protect everything except /signin and static assets.
export const config = {
  matcher: [
    // include all paths…
    "/((?!signin|api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|assets|.*\\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?)).*)",
  ],
};
