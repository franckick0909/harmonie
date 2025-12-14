import type { DashboardStats, Demande, Patient } from "@/types/demande";

// Service pour la gestion des patients côté client
export class PatientService {
  /**
   * Extrait les patients uniques depuis une liste de demandes
   */
  static extractPatientsFromDemandes(demandes: Demande[]): Patient[] {
    const patientMap = new Map<string, Patient>();

    for (const demande of demandes) {
      if (demande.patient && !patientMap.has(demande.patient.id)) {
        patientMap.set(demande.patient.id, demande.patient);
      }
    }

    return Array.from(patientMap.values());
  }

  /**
   * Calcule les statistiques du dashboard à partir des patients et demandes
   */
  static calculateStats(
    patients: Patient[],
    demandes: Demande[]
  ): DashboardStats {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Début et fin de semaine
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Début et fin de mois
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Compter les RDV par période
    const rdvAujourdhui = demandes.filter((d) => {
      if (!d.dateRdv) return false;
      const date = new Date(d.dateRdv);
      return date >= startOfDay && date <= endOfDay;
    }).length;

    const rdvSemaine = demandes.filter((d) => {
      if (!d.dateRdv) return false;
      const date = new Date(d.dateRdv);
      return date >= startOfWeek && date <= endOfWeek;
    }).length;

    const rdvMois = demandes.filter((d) => {
      if (!d.dateRdv) return false;
      const date = new Date(d.dateRdv);
      return date >= startOfMonth && date <= endOfMonth;
    }).length;

    // Compter par statut
    const soinsTermines = demandes.filter(
      (d) => d.statut === "TERMINEE"
    ).length;
    const soinsEnCours = demandes.filter((d) => d.statut === "EN_COURS").length;
    const soinsEnAttente = demandes.filter(
      (d) => d.statut === "EN_ATTENTE"
    ).length;

    // Compter par urgence
    const urgenceFaible = demandes.filter((d) => d.urgence === "FAIBLE").length;
    const urgenceNormale = demandes.filter(
      (d) => d.urgence === "NORMALE"
    ).length;
    const urgenceElevee = demandes.filter((d) => d.urgence === "ELEVEE").length;
    const urgenceUrgente = demandes.filter(
      (d) => d.urgence === "URGENTE"
    ).length;

    // Patients avec urgence élevée ou urgente
    const patientsUrgents = demandes.filter(
      (d) => d.urgence === "ELEVEE" || d.urgence === "URGENTE"
    ).length;

    // Nouveaux patients cette semaine
    const nouveauxCetteSemaine = patients.filter((p) => {
      if (!p.createdAt) return false;
      const date = new Date(p.createdAt);
      return date >= startOfWeek && date <= endOfWeek;
    }).length;

    // Nouveaux patients ce mois
    const nouveauxCeMois = patients.filter((p) => {
      if (!p.createdAt) return false;
      const date = new Date(p.createdAt);
      return date >= startOfMonth && date <= endOfMonth;
    }).length;

    // RDV annulés
    const rdvAnnules = demandes.filter((d) => d.statut === "ANNULEE").length;

    // Calculer l'âge moyen des patients
    let totalAge = 0;
    let patientsWithAge = 0;
    for (const patient of patients) {
      if (patient.dateNaissance) {
        const birthDate = new Date(patient.dateNaissance);
        const age = Math.floor(
          (now.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        if (age > 0 && age < 150) {
          totalAge += age;
          patientsWithAge++;
        }
      }
    }
    const patientsMoyenneAge =
      patientsWithAge > 0 ? Math.round(totalAge / patientsWithAge) : 0;

    // Compter les types de soins les plus fréquents
    const soinsCount: Record<string, number> = {};
    for (const demande of demandes) {
      soinsCount[demande.typeSoin] = (soinsCount[demande.typeSoin] || 0) + 1;
    }
    const pathologiesFrequentes = Object.entries(soinsCount)
      .map(([nom, count]) => ({ nom, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPatients: patients.length,
      patientsActifs: patients.length,
      nouveauxPatients: nouveauxCeMois,
      patientsUrgents,
      rdvAujourdhui,
      rdvSemaine,
      rdvMois,
      patientsAujourdhui: rdvAujourdhui,
      patientsCetteSemaine: rdvSemaine,
      patientsCeMois: rdvMois,
      soinsTermines,
      soinsEnCours,
      soinsEnAttente,
      tauxSatisfaction: 95, // Placeholder
      nouveauxCetteSemaine,
      nouveauxCeMois,
      rdvAnnules,
      rdvReportes: 0, // Placeholder
      urgenceFaible,
      urgenceNormale,
      urgenceElevee,
      urgenceUrgente,
      patientsMoyenneAge,
      soinsParJour: rdvAujourdhui,
      tempsAttenteMoyen: 15, // Placeholder en minutes
      pathologiesFrequentes,
    };
  }

  /**
   * Calcule l'âge d'un patient à partir de sa date de naissance
   */
  static calculateAge(dateNaissance: Date | string): number {
    const birthDate = new Date(dateNaissance);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Formate le nom complet d'un patient
   */
  static formatFullName(patient: Patient): string {
    return `${patient.prenom} ${patient.nom}`;
  }

  /**
   * Formate l'adresse complète d'un patient
   */
  static formatAddress(patient: Patient): string {
    const parts = [
      patient.adresse,
      patient.complementAdresse,
      patient.codePostal && patient.ville
        ? `${patient.codePostal} ${patient.ville}`
        : patient.ville,
    ].filter(Boolean);

    return parts.join(", ");
  }
}
