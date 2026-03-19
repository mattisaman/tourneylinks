import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes (no authentication required)
const isPublicRoute = createRouteMatcher([
  '/', 
  '/tournaments(.*)', 
  '/courses(.*)', 
  '/verify(.*)',
  '/api/(.*)', 
  '/system/(.*)', // Custom founders Super Admin platform
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is NOT public, require authentication via Clerk Session
  if (!isPublicRoute(req)) {
     await auth.protect();
  }

  const res = NextResponse.next();

  // Brutal suppression of the browser Back-Forward Cache (bfcache) for the Super Admin portal
  if (req.nextUrl.pathname.startsWith('/system')) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
  }

  return res;
});

export const config = {
  matcher: [
    // Next.js config to omit static files and internal tracking from middleware runtime
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always execute the middleware for API routes and trpc calls
    '/(api|trpc)(.*)',
  ],
};
