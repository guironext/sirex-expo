"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  manager: "/manager",
  commercial: "/commercial",
};

export function AdminRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const role = (user.publicMetadata?.role as string) || "commercial";
    const homeRoute = ROLE_REDIRECTS[role] || "/commercial";
    const pathname = window.location.pathname;

    // Don't redirect on auth pages or the user's own home route
    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up")
    ) {
      return;
    }

    // Check if already on the correct route
    if (pathname.startsWith(homeRoute)) return;

    // Redirect to the user's home route if they are on a non-protected page
    // (the middleware handles this server-side too, but this is a client-side fallback)
    const protectedPrefixes = ["/admin", "/manager", "/commercial"];
    const onProtectedPage = protectedPrefixes.some((p) =>
      pathname.startsWith(p)
    );

    // If user is on another role's protected page or on a public page, redirect
    if (onProtectedPage || !protectedPrefixes.some((p) => pathname.startsWith(p))) {
      // Only redirect if they're on a different protected page or public page
      const currentRolePrefix = protectedPrefixes.find((p) =>
        pathname.startsWith(p)
      );
      if (currentRolePrefix && currentRolePrefix !== homeRoute) {
        router.push(homeRoute);
      } else if (!currentRolePrefix) {
        // On a public page like /, /voitures, /alternateur-tpo
        router.push(homeRoute);
      }
    }
  }, [isLoaded, user, router]);

  return null;
}
