import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  // Exclude static assets, rendered video files, AND all /api routes.
  //
  // The /api routes already do their own `await auth()` check in each
  // route handler, so middleware doesn't need to intercept them — and it
  // shouldn't, because Next's Edge middleware enforces a much stricter
  // request body size cap than the actual route handler does. The photo
  // upload form (multiple images via FormData) blew past that cap and got
  // silently truncated to 10MB before /api/jobs ever saw it, causing
  // "Failed to parse body as FormData".
  //
  // The `.*\.(...)` clause excludes any public/ static asset by extension
  // (svg, png, jpg, etc). Without it, only explicitly-named paths were
  // excluded, so e.g. /midpoint-lockup.svg got funneled through the auth
  // check and 307-redirected to /login for anyone not already signed in —
  // including the login page itself trying to load its own logo.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|renders|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
