// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Always allow Next internals, auth endpoints and the signin page
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

  // 2) Allow ANY request for a file in /public (has an extension)
  //    e.g. /dog-1.jpg, /logo.svg, /assets/whatever.css
  if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
    return NextResponse.next();
  }

  // 3) Gate the rest of the app
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

// Run for everything (we do the filtering above)
export const config = {
  matcher: ['/:path*'],
};
