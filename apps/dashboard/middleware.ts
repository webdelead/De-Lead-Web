import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // public: the lead endpoint (CORS-guarded in the route) + auth pages + assets
  if (
    pathname.startsWith("/api/lead") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (!req.auth?.user?.id) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
