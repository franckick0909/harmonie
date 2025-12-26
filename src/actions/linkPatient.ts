"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * Lier automatiquement un utilisateur à sa fiche patient existante
 * Recherche par email
 */
export async function linkUserToPatientByEmail(): Promise<{
  success: boolean;
  linked: boolean;
  patientId?: string;
  error?: string;
}> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, linked: false, error: "Non authentifié" };
    }

    // Vérifier si l'utilisateur est déjà lié à un patient
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { patientId: true, email: true },
    });

    if (!user) {
      return { success: false, linked: false, error: "Utilisateur non trouvé" };
    }

    // Déjà lié
    if (user.patientId) {
      return { success: true, linked: true, patientId: user.patientId };
    }

    // Rechercher un patient avec le même email
    const patient = await prisma.patient.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (!patient) {
      // Pas de fiche patient trouvée, ce n'est pas une erreur
      return { success: true, linked: false };
    }

    // Vérifier si ce patient n'est pas déjà lié à un autre utilisateur
    const existingUserWithPatient = await prisma.user.findFirst({
      where: { patientId: patient.id },
      select: { id: true },
    });

    if (
      existingUserWithPatient &&
      existingUserWithPatient.id !== session.user.id
    ) {
      // Le patient est déjà lié à un autre compte
      return {
        success: false,
        linked: false,
        error: "Cette fiche patient est déjà liée à un autre compte",
      };
    }

    // Lier l'utilisateur au patient
    await prisma.user.update({
      where: { id: session.user.id },
      data: { patientId: patient.id },
    });

    return { success: true, linked: true, patientId: patient.id };
  } catch (error) {
    console.error("Erreur liaison patient:", error);
    return { success: false, linked: false, error: "Erreur serveur" };
  }
}

/**
 * Créer une fiche patient pour un utilisateur qui n'en a pas
 */
export async function createPatientFromUser(data: {
  dateNaissance: Date;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
}): Promise<{
  success: boolean;
  patientId?: string;
  error?: string;
}> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: "Non authentifié" };
    }

    // Vérifier si l'utilisateur a déjà un patient lié
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { patientId: true, email: true, name: true },
    });

    if (!user) {
      return { success: false, error: "Utilisateur non trouvé" };
    }

    if (user.patientId) {
      return { success: true, patientId: user.patientId };
    }

    // Extraire prénom et nom du name
    const nameParts = (user.name || "").split(" ");
    const prenom = nameParts[0] || "Patient";
    const nom = nameParts.slice(1).join(" ") || "Inconnu";

    // Créer la fiche patient
    const patient = await prisma.patient.create({
      data: {
        email: user.email,
        prenom,
        nom,
        dateNaissance: data.dateNaissance,
        telephone: data.telephone || "",
        adresse: data.adresse || null,
        ville: data.ville || null,
        codePostal: data.codePostal || null,
      },
    });

    // Lier l'utilisateur au patient créé
    await prisma.user.update({
      where: { id: session.user.id },
      data: { patientId: patient.id },
    });

    return { success: true, patientId: patient.id };
  } catch (error) {
    console.error("Erreur création patient:", error);
    return {
      success: false,
      error: "Erreur lors de la création de la fiche patient",
    };
  }
}

/**
 * Vérifier le statut de liaison Patient ↔ User
 */
export async function checkPatientLinkStatus(): Promise<{
  success: boolean;
  isLinked: boolean;
  hasPatientRecord: boolean;
  patientId?: string;
}> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, isLinked: false, hasPatientRecord: false };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { patientId: true, email: true },
    });

    if (!user) {
      return { success: false, isLinked: false, hasPatientRecord: false };
    }

    // Si l'utilisateur est déjà lié
    if (user.patientId) {
      return {
        success: true,
        isLinked: true,
        hasPatientRecord: true,
        patientId: user.patientId,
      };
    }

    // Vérifier s'il existe une fiche patient avec le même email
    const patient = await prisma.patient.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    return {
      success: true,
      isLinked: false,
      hasPatientRecord: !!patient,
      patientId: patient?.id,
    };
  } catch (error) {
    console.error("Erreur vérification liaison:", error);
    return { success: false, isLinked: false, hasPatientRecord: false };
  }
}
