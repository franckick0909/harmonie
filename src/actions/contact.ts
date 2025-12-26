"use server";

import { sendEmail } from "@/lib/email";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const { name, email, phone, message } = data;

  // Validation
  if (!name || !email || !message) {
    return {
      success: false,
      error: "Veuillez remplir tous les champs obligatoires",
    };
  }

  // Validation email simple
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Adresse email invalide" };
  }

  try {
    // Email au cabinet
    await sendEmail({
      to: process.env.CONTACT_EMAIL || "cabinet.rfm24@orange.fr",
      subject: `[Harmonie] Nouveau message de ${name}`,
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #1E211E;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: #927950;
                            color: #F4E6CD;
                            padding: 30px;
                            text-align: center;
                            border-radius: 12px 12px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            font-weight: 600;
                        }
                        .content {
                            background: #F9F7F2;
                            padding: 30px;
                            border-radius: 0 0 12px 12px;
                            border: 1px solid #d5ccc0;
                            border-top: none;
                        }
                        .field {
                            margin-bottom: 20px;
                        }
                        .field-label {
                            font-size: 12px;
                            color: #6b6b6b;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            font-size: 16px;
                            color: #1E211E;
                        }
                        .message-box {
                            background: white;
                            padding: 20px;
                            border-radius: 8px;
                            border: 1px solid #d5ccc0;
                            margin-top: 10px;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #6b6b6b;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📨 Nouveau message</h1>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="field-label">Nom</div>
                            <div class="field-value">${escapeHtml(name)}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">Email</div>
                            <div class="field-value"><a href="mailto:${escapeHtml(
                              email
                            )}">${escapeHtml(email)}</a></div>
                        </div>
                        ${
                          phone
                            ? `
                        <div class="field">
                            <div class="field-label">Téléphone</div>
                            <div class="field-value"><a href="tel:${escapeHtml(
                              phone
                            )}">${escapeHtml(phone)}</a></div>
                        </div>
                        `
                            : ""
                        }
                        <div class="field">
                            <div class="field-label">Message</div>
                            <div class="message-box">${escapeHtml(
                              message
                            ).replace(/\n/g, "<br>")}</div>
                        </div>
                    </div>
                    <div class="footer">
                        Message reçu via le formulaire de contact Harmonie<br>
                        ${new Date().toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </div>
                </body>
                </html>
            `,
    });

    // Email de confirmation à l'utilisateur
    await sendEmail({
      to: email,
      subject: "Confirmation de votre message - Harmonie",
      html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            line-height: 1.6;
                            color: #1E211E;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background: #F4E6CD;
                        }
                        .container {
                            background: white;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: #927950;
                            color: #F4E6CD;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 400;
                            font-family: Georgia, serif;
                        }
                        .header p {
                            margin: 10px 0 0;
                            opacity: 0.8;
                            font-size: 14px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .greeting {
                            font-size: 18px;
                            color: #1E211E;
                            margin-bottom: 20px;
                        }
                        .message {
                            color: #6b6b6b;
                            font-size: 15px;
                        }
                        .info-box {
                            background: #F9F7F2;
                            padding: 20px;
                            border-radius: 12px;
                            margin: 25px 0;
                            border-left: 4px solid #927950;
                        }
                        .info-box h3 {
                            color: #927950;
                            font-size: 14px;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                            margin: 0 0 10px;
                        }
                        .footer {
                            background: #1E211E;
                            color: #F4E6CD;
                            padding: 30px;
                            text-align: center;
                        }
                        .footer p {
                            margin: 5px 0;
                            font-size: 13px;
                        }
                        .footer a {
                            color: #F4E6CD;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Harmonie</h1>
                            <p>Cabinet Infirmier</p>
                        </div>
                        <div class="content">
                            <p class="greeting">Bonjour ${escapeHtml(name)},</p>
                            <p class="message">
                                Nous avons bien reçu votre message et vous remercions de votre confiance.
                            </p>
                            <p class="message">
                                Notre équipe reviendra vers vous dans les plus brefs délais, généralement sous 24 à 48 heures.
                            </p>
                            <div class="info-box">
                                <h3>📞 Urgence ?</h3>
                                <p style="margin: 0; color: #1E211E;">
                                    Pour toute urgence, n'hésitez pas à nous appeler directement au <strong>05 53 56 04 56</strong>
                                </p>
                            </div>
                            <p class="message">
                                À très bientôt,<br>
                                <strong style="color: #927950;">L'équipe Harmonie</strong>
                            </p>
                        </div>
                        <div class="footer">
                            <p><strong>Maison de Santé Pluriprofessionnelle</strong></p>
                            <p>Place des Droits de l'Homme, 24300 Nontron</p>
                            <p>📧 <a href="mailto:cabinet.rfm24@orange.fr">cabinet.rfm24@orange.fr</a></p>
                        </div>
                    </div>
                </body>
                </html>
            `,
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email contact:", error);
    return {
      success: false,
      error:
        "Erreur lors de l'envoi du message. Veuillez réessayer ou nous contacter par téléphone.",
    };
  }
}

// Fonction d'échappement HTML pour éviter les injections XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
