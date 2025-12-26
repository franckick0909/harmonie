// Types partagés pour les demandes et patients du dashboard

export interface Patient {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: Date;
  adresse: string | null;
  complementAdresse: string | null;
  ville: string | null;
  codePostal: string | null;
  numeroSecu: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UrgenceType = "FAIBLE" | "NORMALE" | "ELEVEE" | "URGENTE";
export type StatutType =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "EN_COURS"
  | "TERMINEE"
  | "ANNULEE";

export interface Demande {
  id: string;
  patientId: string;
  typeSoin: string;
  description: string | null;
  urgence: UrgenceType;
  statut: StatutType;
  dateRdv: Date | null;
  heureRdv: string | null;
  lieu: string | null;
  notes: string | null;
  patient: Patient;
  createdAt: Date;
  updatedAt: Date;
}

// Stats pour le dashboard
export interface DashboardStats {
  totalPatients: number;
  patientsActifs: number;
  nouveauxPatients: number;
  patientsUrgents: number;
  rdvAujourdhui: number;
  rdvSemaine: number;
  rdvMois: number;
  patientsAujourdhui: number;
  patientsCetteSemaine: number;
  patientsCeMois: number;
  soinsTermines: number;
  soinsEnCours: number;
  soinsEnAttente: number;
  tauxSatisfaction: number;
  nouveauxCetteSemaine: number;
  nouveauxCeMois: number;
  rdvAnnules: number;
  rdvReportes: number;
  urgenceFaible: number;
  urgenceNormale: number;
  urgenceElevee: number;
  urgenceUrgente: number;
  patientsMoyenneAge: number;
  soinsParJour: number;
  tempsAttenteMoyen: number;
  pathologiesFrequentes: Array<{ nom: string; count: number }>;
}

export interface PatientStats {
  patientsAujourdhui: number;
  patientsCetteSemaine: number;
  patientsCeMois: number;
}
