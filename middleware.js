export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    // Protect everything except the login and assets
    "/((?!signin|api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
