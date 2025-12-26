"use server";

import { isStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { sendOTPSMS } from "@/lib/sms";

interface NotificationResult {
  success: boolean;
  sent: number;
  failed: number;
  error?: string;
}

/**
 * Envoyer un rappel email individuel
 */
export async function sendReminderEmail(
  demandeId: string
): Promise<{ success: boolean; error?: string }> {
  const isStaffUser = await isStaff();
  if (!isStaffUser) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: { patient: true },
    });

    if (!demande || !demande.patient.email) {
      return { success: false, error: "Patient ou email non trouvé" };
    }

    const dateStr = demande.dateRdv
      ? new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : "à définir";

    await sendEmail({
      to: demande.patient.email,
      subject: `Rappel de rendez-vous - Harmonie`,
      html: generateReminderEmailHtml({
        patientName: `${demande.patient.prenom} ${demande.patient.nom}`,
        typeSoin: demande.typeSoin,
        dateRdv: dateStr,
        heureRdv: demande.heureRdv,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email rappel:", error);
    return { success: false, error: "Erreur lors de l'envoi" };
  }
}

/**
 * Envoyer un rappel SMS individuel
 */
export async function sendReminderSMS(
  demandeId: string
): Promise<{ success: boolean; error?: string }> {
  const isStaffUser = await isStaff();
  if (!isStaffUser) {
    return { success: false, error: "Non autorisé" };
  }

  try {
    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: { patient: true },
    });

    if (!demande || !demande.patient.telephone) {
      return { success: false, error: "Patient ou téléphone non trouvé" };
    }

    const dateStr = demande.dateRdv
      ? new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "à définir";

    const message = `Harmonie - Rappel RDV: ${demande.typeSoin} le ${dateStr}${
      demande.heureRdv ? ` à ${demande.heureRdv}` : ""
    }. Contact: 05 53 56 04 56`;

    await sendOTPSMS(demande.patient.telephone, message);

    return { success: true };
  } catch (error) {
    console.error("Erreur envoi SMS rappel:", error);
    return { success: false, error: "Erreur lors de l'envoi" };
  }
}

/**
 * Envoyer un rappel à tous les patients du jour
 */
export async function sendDailyReminders(): Promise<NotificationResult> {
  const isStaffUser = await isStaff();
  if (!isStaffUser) {
    return { success: false, sent: 0, failed: 0, error: "Non autorisé" };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const demandes = await prisma.demande.findMany({
      where: {
        dateRdv: {
          gte: today,
          lt: tomorrow,
        },
        statut: {
          in: ["CONFIRMEE", "EN_ATTENTE"],
        },
      },
      include: { patient: true },
    });

    let sent = 0;
    let failed = 0;

    for (const demande of demandes) {
      try {
        if (demande.patient.email) {
          const dateStr = demande.dateRdv
            ? new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : "aujourd'hui";

          await sendEmail({
            to: demande.patient.email,
            subject: `Rappel: Votre RDV aujourd'hui - Harmonie`,
            html: generateReminderEmailHtml({
              patientName: `${demande.patient.prenom} ${demande.patient.nom}`,
              typeSoin: demande.typeSoin,
              dateRdv: dateStr,
              heureRdv: demande.heureRdv,
            }),
          });
          sent++;
        }
      } catch {
        failed++;
      }
    }

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Erreur envoi rappels journaliers:", error);
    return { success: false, sent: 0, failed: 0, error: "Erreur serveur" };
  }
}

/**
 * Contacter les patients avec RDV urgents
 */
export async function sendUrgentAlerts(): Promise<NotificationResult> {
  const isStaffUser = await isStaff();
  if (!isStaffUser) {
    return { success: false, sent: 0, failed: 0, error: "Non autorisé" };
  }

  try {
    const demandes = await prisma.demande.findMany({
      where: {
        urgence: {
          in: ["ELEVEE", "URGENTE"],
        },
        statut: {
          in: ["EN_ATTENTE", "CONFIRMEE"],
        },
      },
      include: { patient: true },
    });

    let sent = 0;
    let failed = 0;

    for (const demande of demandes) {
      try {
        if (demande.patient.email) {
          await sendEmail({
            to: demande.patient.email,
            subject: `⚠️ Important - RDV urgent - Harmonie`,
            html: generateUrgentAlertEmailHtml({
              patientName: `${demande.patient.prenom} ${demande.patient.nom}`,
              typeSoin: demande.typeSoin,
              urgence: demande.urgence,
            }),
          });
          sent++;
        }
      } catch {
        failed++;
      }
    }

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Erreur envoi alertes urgentes:", error);
    return { success: false, sent: 0, failed: 0, error: "Erreur serveur" };
  }
}

/**
 * Demander confirmation aux patients en attente
 */
export async function sendConfirmationRequests(): Promise<NotificationResult> {
  const isStaffUser = await isStaff();
  if (!isStaffUser) {
    return { success: false, sent: 0, failed: 0, error: "Non autorisé" };
  }

  try {
    const demandes = await prisma.demande.findMany({
      where: {
        statut: "EN_ATTENTE",
        dateRdv: {
          not: null,
        },
      },
      include: { patient: true },
    });

    let sent = 0;
    let failed = 0;

    for (const demande of demandes) {
      try {
        if (demande.patient.email) {
          const dateStr = demande.dateRdv
            ? new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            : "";

          await sendEmail({
            to: demande.patient.email,
            subject: `Confirmation de RDV requise - Harmonie`,
            html: generateConfirmationEmailHtml({
              patientName: `${demande.patient.prenom} ${demande.patient.nom}`,
              typeSoin: demande.typeSoin,
              dateRdv: dateStr,
              heureRdv: demande.heureRdv,
            }),
          });
          sent++;
        }
      } catch {
        failed++;
      }
    }

    return { success: true, sent, failed };
  } catch (error) {
    console.error("Erreur envoi demandes confirmation:", error);
    return { success: false, sent: 0, failed: 0, error: "Erreur serveur" };
  }
}

// Templates d'emails
function generateReminderEmailHtml(data: {
  patientName: string;
  typeSoin: string;
  dateRdv: string;
  heureRdv: string | null;
}): string {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1E211E; max-width: 600px; margin: 0 auto; padding: 20px; background: #F4E6CD; }
                .container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #927950; color: #F4E6CD; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 400; font-family: Georgia, serif; }
                .content { padding: 40px 30px; }
                .rdv-box { background: #F9F7F2; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #927950; }
                .rdv-box h3 { color: #927950; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 15px; }
                .rdv-detail { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #d5ccc0; }
                .rdv-detail:last-child { border-bottom: none; }
                .footer { background: #1E211E; color: #F4E6CD; padding: 30px; text-align: center; }
                .footer p { margin: 5px 0; font-size: 13px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🗓️ Rappel de RDV</h1>
                </div>
                <div class="content">
                    <p>Bonjour ${data.patientName},</p>
                    <p>Nous vous rappelons votre prochain rendez-vous :</p>
                    <div class="rdv-box">
                        <h3>📋 Détails du rendez-vous</h3>
                        <div class="rdv-detail">
                            <span>Soin</span>
                            <strong>${data.typeSoin}</strong>
                        </div>
                        <div class="rdv-detail">
                            <span>Date</span>
                            <strong>${data.dateRdv}</strong>
                        </div>
                        ${
                          data.heureRdv
                            ? `
                        <div class="rdv-detail">
                            <span>Heure</span>
                            <strong>${data.heureRdv}</strong>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    <p>N'oubliez pas d'apporter votre ordonnance et votre carte vitale.</p>
                    <p>En cas d'empêchement, merci de nous prévenir au 05 53 56 04 56.</p>
                </div>
                <div class="footer">
                    <p><strong>Harmonie - Cabinet Infirmier</strong></p>
                    <p>Place des Droits de l'Homme, 24300 Nontron</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateUrgentAlertEmailHtml(data: {
  patientName: string;
  typeSoin: string;
  urgence: string;
}): string {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1E211E; max-width: 600px; margin: 0 auto; padding: 20px; background: #F4E6CD; }
                .container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #dc2626; color: white; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 400; font-family: Georgia, serif; }
                .content { padding: 40px 30px; }
                .alert-box { background: #fef2f2; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #dc2626; }
                .footer { background: #1E211E; color: #F4E6CD; padding: 30px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚠️ Alerte Urgente</h1>
                </div>
                <div class="content">
                    <p>Bonjour ${data.patientName},</p>
                    <div class="alert-box">
                        <p><strong>Votre demande de soin "${
                          data.typeSoin
                        }" est marquée comme ${
    data.urgence === "URGENTE" ? "URGENTE" : "priorité élevée"
  }.</strong></p>
                        <p>Merci de nous contacter dès que possible pour planifier votre rendez-vous.</p>
                    </div>
                    <p><strong>📞 Appelez-nous maintenant : 05 53 56 04 56</strong></p>
                </div>
                <div class="footer">
                    <p><strong>Harmonie - Cabinet Infirmier</strong></p>
                    <p>Place des Droits de l'Homme, 24300 Nontron</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateConfirmationEmailHtml(data: {
  patientName: string;
  typeSoin: string;
  dateRdv: string;
  heureRdv: string | null;
}): string {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1E211E; max-width: 600px; margin: 0 auto; padding: 20px; background: #F4E6CD; }
                .container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: #927950; color: #F4E6CD; padding: 40px 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 400; font-family: Georgia, serif; }
                .content { padding: 40px 30px; }
                .rdv-box { background: #F9F7F2; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #927950; }
                .cta-button { display: inline-block; background: #927950; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
                .cta-button.secondary { background: white; color: #927950; border: 2px solid #927950; }
                .footer { background: #1E211E; color: #F4E6CD; padding: 30px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📋 Confirmation requise</h1>
                </div>
                <div class="content">
                    <p>Bonjour ${data.patientName},</p>
                    <p>Nous vous prions de bien vouloir confirmer votre rendez-vous :</p>
                    <div class="rdv-box">
                        <p><strong>Soin :</strong> ${data.typeSoin}</p>
                        <p><strong>Date :</strong> ${data.dateRdv}</p>
                        ${
                          data.heureRdv
                            ? `<p><strong>Heure :</strong> ${data.heureRdv}</p>`
                            : ""
                        }
                    </div>
                    <p>Pour confirmer ou reporter ce rendez-vous, merci de nous contacter au <strong>05 53 56 04 56</strong>.</p>
                </div>
                <div class="footer">
                    <p><strong>Harmonie - Cabinet Infirmier</strong></p>
                    <p>Place des Droits de l'Homme, 24300 Nontron</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
