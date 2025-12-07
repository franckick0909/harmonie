import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { prisma } from "./db";
import { headers } from "next/headers";
import { sendEmail } from "./email";
import { sendOTPSMS } from "./sms";

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
                            Si vous n'avez pas demandé cette réinitialisation, ignorez simplement cet email.
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

            console.log("Password reset email sent to:", user.email);
        },
    },
    plugins: [
        phoneNumber({
            sendOTP: async ({ phoneNumber, code }) => {
                // Envoi du code OTP via Twilio
                await sendOTPSMS(phoneNumber, code);
                console.log("OTP sent to:", phoneNumber);
            },
            otpLength: 6,
            expiresIn: 600, // 10 minutes
            signUpOnVerification: {
                // Permet l'inscription avec juste le numéro de téléphone
                getTempEmail: (phone) => `${phone.replace(/\+/g, '')}@harmonie-patient.local`,
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
