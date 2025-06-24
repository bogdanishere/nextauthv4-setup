import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

console.log("🔥 MIDDLEWARE FILE LOADED");

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;

    // Force console logs to appear
    console.log("\n🚀 === MIDDLEWARE START ===");
    console.log("🚀 Middleware executed for:", pathname);
    console.log("🔑 Token exists:", !!req.nextauth?.token);
    console.log(
      "🔑 Token details:",
      req.nextauth?.token ? "Present" : "Missing"
    );
    console.log("isAdmin:", req.nextauth?.token?.role);
    console.log("📊 Request method:", req.method);
    console.log("🌐 Full URL:", req.nextUrl.toString());
    console.log("🚀 === MIDDLEWARE END ===\n");

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        console.log("🔍 === AUTHORIZATION CHECK START ===");
        console.log("🔍 Checking authorization for:", pathname);
        console.log("🔑 Token in auth check:", !!token);

        //allow auth related routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        ) {
          console.log("✅ Auth route - allowing access");
          return true;
        }

        //public routes
        if (pathname === "/" || pathname.startsWith("/api/video")) {
          console.log("✅ Public route - allowing access");
          return true;
        }

        const hasAccess = !!token;
        console.log(
          hasAccess ? "✅ Authorized - has token" : "❌ Unauthorized - no token"
        );
        console.log("🔍 === AUTHORIZATION CHECK END ===");
        return hasAccess;
      },
    },
  }
);

export const config = {
  matcher: ["/", "/test", "/login", "/api/:path*"],
};
