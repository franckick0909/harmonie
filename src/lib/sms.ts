/**
 * SMS Service - Mode Développement
 * En production, remplacer par Twilio ou un autre service SMS
 */

interface SendSMSOptions {
    to: string;
    message: string;
}

export async function sendSMS({ to, message }: SendSMSOptions) {
    // Mode développement : affiche le SMS dans la console
    console.log("===========================================");
    console.log("📱 SMS (MODE DEV - pas de SMS réel envoyé)");
    console.log("To:", to);
    console.log("Message:", message);
    console.log("===========================================");

    return { sid: "dev-mode" };
}

/**
 * Send OTP code via SMS
 */
export async function sendOTPSMS(phoneNumber: string, code: string) {
    return sendSMS({
        to: phoneNumber,
        message: `Votre code de vérification Harmonie est : ${code}. Ce code expire dans 10 minutes.`,
    });
}

