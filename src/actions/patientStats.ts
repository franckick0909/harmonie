"use server";

import { prisma } from "@/lib/prisma";

export async function getPatientStats() {
  try {
    const now = new Date();

    // Début de la journée
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    // Fin de la journée
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Début de la semaine (lundi)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fin de la semaine (dimanche)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Début du mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fin du mois
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Compter les patients avec RDV aujourd'hui
    const patientsAujourdhui = await prisma.demande.count({
      where: {
        dateRdv: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Compter les patients avec RDV cette semaine
    const patientsCetteSemaine = await prisma.demande.count({
      where: {
        dateRdv: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
    });

    // Compter les patients avec RDV ce mois
    const patientsCeMois = await prisma.demande.count({
      where: {
        dateRdv: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    return {
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des stats patients:", error);
    return {
      patientsAujourdhui: 0,
      patientsCetteSemaine: 0,
      patientsCeMois: 0,
    };
  }
}

export async function getAllPatients() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        demandes: {
          orderBy: {
            dateRdv: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: patients,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    return {
      success: false,
      error: "Impossible de récupérer les patients",
    };
  }
}

export async function getPatientById(patientId: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        demandes: {
          orderBy: {
            dateRdv: "desc",
          },
        },
      },
    });

    if (!patient) {
      return {
        success: false,
        error: "Patient introuvable",
      };
    }

    return {
      success: true,
      data: patient,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération du patient:", error);
    return {
      success: false,
      error: "Impossible de récupérer le patient",
    };
  }
}

export async function createPatient(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  numeroSecu?: string;
}) {
  try {
    // Vérifier si un patient avec cet email existe déjà
    const existingPatient = await prisma.patient.findUnique({
      where: { email: data.email },
    });

    if (existingPatient) {
      // Retourner le patient existant
      return {
        success: true,
        data: existingPatient,
      };
    }

    // Créer un nouveau patient
    const patient = await prisma.patient.create({
      data,
    });

    return {
      success: true,
      data: patient,
    };
  } catch (error) {
    console.error("Erreur lors de la création du patient:", error);
    
    // Vérifier si c'est une erreur de contrainte unique
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2002") {
        // Erreur de contrainte unique - essayer de récupérer le patient existant
        try {
          const existingPatient = await prisma.patient.findUnique({
            where: { email: data.email },
          });
          if (existingPatient) {
            return {
              success: true,
              data: existingPatient,
            };
          }
        } catch (findError) {
          console.error("Erreur lors de la recherche du patient existant:", findError);
        }
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Impossible de créer le patient",
    };
  }
}
