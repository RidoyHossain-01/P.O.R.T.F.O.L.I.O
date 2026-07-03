import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  
  // Check for presence of NextAuth v5 session cookies (both HTTP and secure HTTPS variants)
  const hasSessionToken = 
    cookies.has("authjs.session-token") || 
    cookies.has("__Secure-authjs.session-token") ||
    cookies.has("next-auth.session-token") ||
    cookies.has("__Secure-next-auth.session-token");

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/login";

  if (isAdminRoute && !hasSessionToken) {
    // Redirect to login if accessing admin without a session
    const loginUrl = new URL("/login", nextUrl.origin);
    // Maintain the intended URL after login redirect if desired
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && hasSessionToken) {
    // Redirect to admin if accessing login while already authenticated
    return NextResponse.redirect(new URL("/admin", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
