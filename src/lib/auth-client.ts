import { phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Types pour les rôles utilisateur
export type UserRole = "ADMIN" | "NURSE" | "PATIENT";

// Interface étendue pour l'utilisateur avec le rôle
export interface UserWithRole {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  image: string | null;
  role: UserRole;
  patientId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const authClient = createAuthClient({
  plugins: [phoneNumberClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
}

/**
 * Sign in with Apple
 */
export async function signInWithApple() {
  return authClient.signIn.social({
    provider: "apple",
    callbackURL: "/dashboard",
  });
}

/**
 * Get user role from session
 */
export function getUserRoleFromSession(
  session: ReturnType<typeof useSession>["data"]
): UserRole | null {
  if (!session?.user) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session.user as any).role ?? "PATIENT";
}

/**
 * Check if user is staff (admin or nurse)
 */
export function isStaffFromSession(
  session: ReturnType<typeof useSession>["data"]
): boolean {
  const role = getUserRoleFromSession(session);
  return role === "ADMIN" || role === "NURSE";
}

/**
 * Check if user is admin
 */
export function isAdminFromSession(
  session: ReturnType<typeof useSession>["data"]
): boolean {
  return getUserRoleFromSession(session) === "ADMIN";
}

/**
 * Check if user is patient
 */
export function isPatientFromSession(
  session: ReturnType<typeof useSession>["data"]
): boolean {
  return getUserRoleFromSession(session) === "PATIENT";
}
