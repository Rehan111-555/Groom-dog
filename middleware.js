import { NextResponse } from "next/server";
import { auth } from "next-auth";

const PUBLIC_FILE = /\.(.*)$/;

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow NextAuth routes, public files and the sign-in page itself
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/signin" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // If authenticated, continue as normal
  if (req.auth) return NextResponse.next();

  // Otherwise, send to /signin and remember where they came from
  const url = req.nextUrl.clone();
  url.pathname = "/signin";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: ["/:path*"],
};
