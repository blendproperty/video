import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');
  const isAuthApi = req.nextUrl.pathname.startsWith('/api/auth');

  if (!isLoggedIn && !isLoginPage && !isAuthApi) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  // Exclude static assets and the rendered video files themselves.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|renders).*)'],
};
