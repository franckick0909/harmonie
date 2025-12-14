"use server";

import { prisma } from "@/lib/prisma";
import type { StatutType, UrgenceType } from "@/types/demande";

export async function getDemandes(filters?: {
  dateDebut?: Date;
  dateFin?: Date;
  statut?: StatutType;
  urgence?: UrgenceType;
  includeSansDate?: boolean; // Nouveau paramètre pour inclure les demandes sans dateRdv
}) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    if (filters?.dateDebut || filters?.dateFin) {
      // Si on filtre par date, on inclut aussi les demandes sans dateRdv si demandé
      if (filters.includeSansDate) {
        where.OR = [
          {
            dateRdv: {
              ...(filters.dateDebut ? { gte: filters.dateDebut } : {}),
              ...(filters.dateFin ? { lte: filters.dateFin } : {}),
            },
          },
          {
            dateRdv: null,
          },
        ];
      } else {
        where.dateRdv = {};
        if (filters.dateDebut) {
          where.dateRdv.gte = filters.dateDebut;
        }
        if (filters.dateFin) {
          where.dateRdv.lte = filters.dateFin;
        }
      }
    }

    if (filters?.statut) {
      where.statut = filters.statut;
    }

    if (filters?.urgence) {
      where.urgence = filters.urgence;
    }

    const demandes = await prisma.demande.findMany({
      where,
      include: {
        patient: true,
      },
      orderBy: [
        {
          dateRdv: "asc",
        },
        {
          createdAt: "desc", // Pour les demandes sans dateRdv, trier par date de création
        },
      ],
    });

    return {
      success: true,
      data: demandes,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    return {
      success: false,
      error: "Impossible de récupérer les demandes",
    };
  }
}

export async function updateDemandeStatut(
  demandeId: string,
  statut: StatutType
) {
  try {
    const demande = await prisma.demande.update({
      where: { id: demandeId },
      data: { statut },
      include: { patient: true },
    });

    return {
      success: true,
      data: demande,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le statut",
    };
  }
}

export async function updateDemandeDate(
  demandeId: string,
  dateRdv: Date,
  heureRdv: string
) {
  try {
    const existingDemande = await prisma.demande.findUnique({
      where: { id: demandeId },
    });

    if (!existingDemande) {
      return {
        success: false,
        error: `Demande avec l'ID ${demandeId} introuvable`,
      };
    }

    const demande = await prisma.demande.update({
      where: { id: demandeId },
      data: {
        dateRdv,
        heureRdv,
      },
      include: { patient: true },
    });

    return {
      success: true,
      data: {
        id: demande.id,
        dateRdv: demande.dateRdv,
        heureRdv: demande.heureRdv,
        patientId: demande.patient?.id,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la date:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Impossible de mettre à jour la date",
    };
  }
}

export async function getDemandeById(demandeId: string) {
  try {
    const demande = await prisma.demande.findUnique({
      where: { id: demandeId },
      include: {
        patient: true,
      },
    });

    if (!demande) {
      return {
        success: false,
        error: "Demande introuvable",
      };
    }

    return {
      success: true,
      data: demande,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de la demande:", error);
    return {
      success: false,
      error: "Impossible de récupérer la demande",
    };
  }
}

export async function deleteDemande(demandeId: string) {
  try {
    await prisma.demande.delete({
      where: { id: demandeId },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Erreur lors de la suppression de la demande:", error);
    return {
      success: false,
      error: "Impossible de supprimer la demande",
    };
  }
}

export async function createDemande(data: {
  patientId: string;
  typeSoin: string;
  description?: string;
  dateRdv?: Date;
  heureRdv?: string;
  lieu?: string;
  urgence?: UrgenceType;
  notes?: string;
}) {
  try {
    const demande = await prisma.demande.create({
      data: {
        patientId: data.patientId,
        typeSoin: data.typeSoin,
        description: data.description,
        dateRdv: data.dateRdv,
        heureRdv: data.heureRdv,
        lieu: data.lieu,
        urgence: data.urgence || "NORMALE",
        notes: data.notes,
      },
      include: { patient: true },
    });

    return {
      success: true,
      data: demande,
    };
  } catch (error) {
    console.error("Erreur lors de la création de la demande:", error);
    return {
      success: false,
      error: "Impossible de créer la demande",
    };
  }
}
