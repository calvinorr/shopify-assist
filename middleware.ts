import { auth } from "@/lib/auth";

export default auth((req) => {
  // Dev bypass mode - skip all auth checks
  if (process.env.DEV_BYPASS_AUTH === "true") {
    return;
  }

  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === "/login";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isPublicRoute = req.nextUrl.pathname === "/" || isOnLoginPage;

  // Allow API routes to handle their own auth
  if (isApiRoute) {
    return;
  }

  // Redirect to login if not authenticated and not on public route
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", req.url));
  }

  // Redirect to dashboard if authenticated and on login page
  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL("/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
