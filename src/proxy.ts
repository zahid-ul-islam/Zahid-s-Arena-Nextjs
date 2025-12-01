import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  const token = req.cookies.get("auth_token")?.value;
  const role = req.cookies.get("role")?.value;

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/signin", "/auth/signup"];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some((p) => pathname === p);

  // Allow static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") || // Allow API routes to handle their own auth or be public
    pathname.includes(".") || // Assumes files with extensions are static assets (images, fonts, etc.)
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Admin Route Protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      // If logged in but not admin, redirect to user home (e.g., shop or account)
      url.pathname = "/shop";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // General Route Protection (for everything else not public)
  if (!isPublicPath) {
    if (!token) {
      url.pathname = "/auth/signin";
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (
    isPublicPath &&
    token &&
    (pathname === "/auth/signin" || pathname === "/auth/signup")
  ) {
    if (role === "admin") {
      url.pathname = "/admin";
    } else {
      url.pathname = "/shop"; // or /account
    }
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
