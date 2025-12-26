"use server";

import { redirect } from "next/navigation";
import { getSession, getUserRole, isStaff, UserRole } from "./auth";

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Require staff access (admin or nurse)
 */
export async function requireStaff() {
  const session = await requireAuth();
  const staffAccess = await isStaff();

  if (!staffAccess) {
    // Redirect patients to their dashboard
    redirect("/patient");
  }

  return session;
}

/**
 * Require admin access
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const role = await getUserRole();

  if (role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

/**
 * Require specific roles
 */
export async function requireRoles(allowedRoles: UserRole[]) {
  const session = await requireAuth();
  const role = await getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    // Redirect based on role
    if (role === "PATIENT") {
      redirect("/patient");
    }
    redirect("/dashboard");
  }

  return session;
}

/**
 * Get redirect URL based on user role
 */
export async function getRedirectUrlForRole(): Promise<string> {
  const role = await getUserRole();

  switch (role) {
    case "ADMIN":
    case "NURSE":
      return "/dashboard";
    case "PATIENT":
      return "/patient";
    default:
      return "/login";
  }
}

