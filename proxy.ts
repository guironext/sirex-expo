import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ── Route matchers ──
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isCommercialRoute = createRouteMatcher(["/commercial(.*)"]);
const isAuthPage = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/manager(.*)",
  "/commercial(.*)",
  "/dashboard(.*)",
]);

// Public routes where authenticated users should be redirected to their dashboard
const isRedirectableRoute = createRouteMatcher([
  "/",
  "/voitures(.*)",
  "/alternateur-tpo(.*)",
  "/dashboard(.*)",
]);

// Each role gets its own home route
const roleHomeRoute: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  commercial: "/commercial",
};

export default clerkMiddleware(async (auth, request) => {
  // Protect role-based routes
  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  const { userId, sessionClaims } = auth() as any;

  // Not authenticated — nothing more to do
  if (!userId) return;

  // ── Get user role ──
  // Try session claims first
  let role: string | undefined = (sessionClaims as any)?.publicMetadata?.role;

  // Fallback: fetch user from Clerk API
  if (!role) {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      role = user.publicMetadata?.role as string | undefined;
    } catch (e) {
      return;
    }
  }

  // No role — treat as commercial (default)
  if (!role) {
    role = "commercial";
  }

  const homeRoute = roleHomeRoute[role] || "/commercial";

  const pathname = request.nextUrl.pathname;

  // ── Role-based access control ──
  // Admin can access everything; other roles restricted to their area

  if (role === "admin") {
    // Admin can access /admin and below
    if (isAdminRoute(request)) return;

    // Redirect admin from manager/commercial pages to /admin
    if (isManagerRoute(request) || isCommercialRoute(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Don't redirect from auth pages
    if (isAuthPage(request)) return;

    // Redirect from public pages to /admin
    if (isRedirectableRoute(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return;
  }

  if (role === "manager") {
    // Manager can access /manager
    if (isManagerRoute(request)) return;

    // Redirect away from admin and commercial pages
    if (isAdminRoute(request) || isCommercialRoute(request)) {
      return NextResponse.redirect(new URL("/manager", request.url));
    }

    // Don't redirect from auth pages
    if (isAuthPage(request)) return;

    // Redirect from public pages to /manager
    if (isRedirectableRoute(request)) {
      return NextResponse.redirect(new URL("/manager", request.url));
    }
    return;
  }

  // ── Commercial (default role) ──
  if (role === "commercial") {
    // Commercial can access /commercial
    if (isCommercialRoute(request)) return;

    // Redirect away from admin and manager pages
    if (isAdminRoute(request) || isManagerRoute(request)) {
      return NextResponse.redirect(new URL("/commercial", request.url));
    }

    // Don't redirect from auth pages
    if (isAuthPage(request)) return;

    // Redirect from public pages to /commercial
    if (isRedirectableRoute(request)) {
      return NextResponse.redirect(new URL("/commercial", request.url));
    }
    return;
  }

  // Unknown role — redirect to /commercial as fallback
  if (isProtectedRoute(request) && !isCommercialRoute(request)) {
    return NextResponse.redirect(new URL("/commercial", request.url));
  }
});
