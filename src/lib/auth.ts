import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { headers } from "next/headers";
import { prisma } from "./db";
import { sendEmail } from "./email";
import { sendOTPSMS } from "./sms";

// Types pour les rôles
export type UserRole = "ADMIN" | "NURSE" | "PATIENT";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Configuration pour le reset de mot de passe
    sendResetPassword: async ({ user, url }) => {
      // Envoi de l'email via Resend
      await sendEmail({
        to: user.email,
        subject: "Réinitialisez votre mot de passe - Harmonie",
        html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">
                            Harmonie
                        </h1>
                        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Bonjour,
                        </p>
                        <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                            Vous avez demandé à réinitialiser votre mot de passe. 
                            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
                        </p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${url}" 
                               style="background-color: #1a1a1a; color: #ffffff; padding: 14px 28px; 
                                      text-decoration: none; font-size: 14px; font-weight: bold;
                                      text-transform: uppercase; letter-spacing: 1px;">
                                Réinitialiser mon mot de passe
                            </a>
                        </div>
                        <p style="color: #888888; font-size: 14px; line-height: 1.6;">
                            Si vous n&apos;avez pas demandé cette réinitialisation, ignorez simplement cet email.
                        </p>
                        <p style="color: #888888; font-size: 14px; line-height: 1.6;">
                            Ce lien expirera dans 1 heure.
                        </p>
                        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                        <p style="color: #aaaaaa; font-size: 12px;">
                            Harmonie - Cabinet Infirmier
                        </p>
                    </div>
                `,
      });
    },
  },
  // Configuration des providers OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: process.env.APPLE_CLIENT_SECRET || "",
    },
  },
  // Configuration des champs utilisateur additionnels
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "PATIENT",
        input: false, // Ne peut pas être modifié lors de l'inscription
      },
      patientId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        // Envoi du code OTP via Twilio
        await sendOTPSMS(phoneNumber, code);
      },
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      signUpOnVerification: {
        // Permet l'inscription avec juste le numéro de téléphone
        getTempEmail: (phone) =>
          `${phone.replace(/\+/g, "")}@harmonie-patient.local`,
        getTempName: (phone) => phone,
      },
    }),
  ],
});

/**
 * Get the current session in a Server Component
 * @returns The session object or null if not authenticated
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Check if the user is authenticated in a Server Component
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Get the current user in a Server Component
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Get the current user's role
 * @returns The user role or null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const session = await getSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.role ?? null;
}

/**
 * Check if the current user is an admin
 * @returns true if admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "ADMIN";
}

/**
 * Check if the current user is a nurse
 * @returns true if nurse, false otherwise
 */
export async function isNurse(): Promise<boolean> {
  const role = await getUserRole();
  return role === "NURSE";
}

/**
 * Check if the current user is a patient
 * @returns true if patient, false otherwise
 */
export async function isPatient(): Promise<boolean> {
  const role = await getUserRole();
  return role === "PATIENT";
}

/**
 * Check if the current user is staff (admin or nurse)
 * @returns true if staff, false otherwise
 */
export async function isStaff(): Promise<boolean> {
  const role = await getUserRole();
  return role === "ADMIN" || role === "NURSE";
}

/**
 * Check if the user has one of the required roles
 * @param requiredRoles Array of roles that are allowed
 * @returns true if user has one of the required roles
 */
export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const role = await getUserRole();
  if (!role) return false;
  return requiredRoles.includes(role);
}
