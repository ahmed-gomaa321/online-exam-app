import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const path = req.nextUrl.pathname;
  if (authRoutes.includes(path)) {
    return !token
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
  if (!authRoutes.includes(path)) {
    if (!token) {
      const redirectUrl = new URL("/login", req.nextUrl.origin);
      redirectUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
