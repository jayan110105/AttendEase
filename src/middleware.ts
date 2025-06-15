import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedPaths = ["/admin", "/staff", "/dashboard"];
  const isProtectedPath = protectedPaths.some((path) => 
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Use Better Auth's official helper to check for session cookie
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/login", "/signup"];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  
  if (isAuthPath) {
    const sessionCookie = getSessionCookie(request);
      
    if (sessionCookie) {
      const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
}; 