"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Get demandes for the current patient user
 * Accessible à tout utilisateur connecté qui a une fiche patient
 */
export async function getPatientDemandes() {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Non authentifié" };
  }

  try {
    // Récupérer l'ID du patient lié à cet utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { patientId: true, email: true },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Si pas de patientId, chercher par email
    let patientId = user.patientId;

    if (!patientId) {
      const patient = await prisma.patient.findUnique({
        where: { email: user.email },
        select: { id: true },
      });
      patientId = patient?.id || null;

      // Lier l'utilisateur au patient si trouvé
      if (patientId) {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { patientId },
        });
      }
    }

    if (!patientId) {
      return { success: true, data: [] }; // Pas encore de fiche patient
    }

    // Récupérer les demandes du patient
    const demandes = await prisma.demande.findMany({
      where: { patientId },
      include: {
        patient: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: demandes };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes patient:",
      error
    );
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Get patient profile for the current user
 */
export async function getPatientProfile() {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Non authentifié" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        patientId: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    // Chercher la fiche patient
    let patient = null;

    if (user.patientId) {
      patient = await prisma.patient.findUnique({
        where: { id: user.patientId },
      });
    } else {
      // Chercher par email
      patient = await prisma.patient.findUnique({
        where: { email: user.email },
      });
    }

    return {
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
        patient,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du profil patient:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * Update patient profile
 * Accessible à tout utilisateur connecté qui a une fiche patient liée
 */
export async function updatePatientProfile(data: {
  nom?: string;
  prenom?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}) {
  const session = await getSession();

  if (!session?.user) {
    return { success: false, error: "Non authentifié" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { patientId: true, email: true },
    });

    if (!user?.patientId) {
      // Chercher par email
      const patient = await prisma.patient.findUnique({
        where: { email: user?.email },
      });

      if (!patient) {
        return { success: false, error: "Fiche patient non trouvée" };
      }

      // Mettre à jour la fiche patient
      const updatedPatient = await prisma.patient.update({
        where: { id: patient.id },
        data,
      });

      return { success: true, data: updatedPatient };
    }

    // Mettre à jour la fiche patient liée
    const updatedPatient = await prisma.patient.update({
      where: { id: user.patientId },
      data,
    });

    return { success: true, data: updatedPatient };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return { success: false, error: "Erreur serveur" };
  }
}
