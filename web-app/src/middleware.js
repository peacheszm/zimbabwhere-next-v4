import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute = pathname.startsWith("/my-account") || pathname.startsWith("/add-a-business");

  // Use NextAuth to reliably detect session via JWT/cookie
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = Boolean(token);

  // Prevent logged-in users from visiting auth pages (login, register, etc.)
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/my-account", req.url));
  }

  // Prevent logged-out users from visiting protected pages
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/my-account/:path*", "/add-a-business/:path*"],
};
