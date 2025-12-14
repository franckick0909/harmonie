"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function refreshPlanningStats() {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Vérifier si les stats du jour existent déjà
    const existingStats = await prisma.planningStats.findUnique({
      where: { date: today },
    });

    // Calculer les stats
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [
      totalPatients,
      patientsAujourdhui,
      patientsCetteSemaine,
      patientsCeMois,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.demande.count({
        where: { dateRdv: { gte: startOfDay, lte: endOfDay } },
      }),
      prisma.demande.count({
        where: { dateRdv: { gte: startOfWeek, lte: endOfWeek } },
      }),
      prisma.demande.count({
        where: { dateRdv: { gte: startOfMonth, lte: endOfMonth } },
      }),
    ]);

    if (existingStats) {
      await prisma.planningStats.update({
        where: { id: existingStats.id },
        data: {
          totalPatients,
          patientsAujourdhui,
          patientsCetteSemaine,
          patientsCeMois,
        },
      });
    } else {
      await prisma.planningStats.create({
        data: {
          date: today,
          type: "jour",
          totalPatients,
          patientsAujourdhui,
          patientsCetteSemaine,
          patientsCeMois,
        },
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        totalPatients,
        patientsAujourdhui,
        patientsCetteSemaine,
        patientsCeMois,
      },
    };
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des stats:", error);
    return {
      success: false,
      error: "Impossible de rafraîchir les statistiques",
    };
  }
}
