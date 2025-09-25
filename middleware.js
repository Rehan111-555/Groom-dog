// middleware.js (pure JS)
import { NextResponse } from 'next/server';

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Always allow Next internals, auth endpoints, and the signin page
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/signin' ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Allow any public asset (has an extension: .jpg, .png, .css, .js, etc.)
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // Gate the rest of the app by session cookie
  const token =
    req.cookies.get('__Secure-next-auth.session-token')?.value ??
    req.cookies.get('next-auth.session-token')?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/signin';
    url.search = `from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run for everything; filtering is handled in the function above
export const config = {
  matcher: ['/:path*'],
};
