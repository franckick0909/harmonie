import type { UrgenceType } from "@/types/demande";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PatientFormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  email: string;
  telephone: string;
  adresse: string;
  complementAdresse?: string;
  codePostal: string;
  ville: string;
  numeroSecu: string;
}

export interface OrdonnanceData {
  url?: string;
  nom?: string;
  type?: string;
  medecinPrescripteur?: string;
  medecinTraitant?: string;
  choice?: "avec_domicile" | "sans_domicile" | "non";
}

export interface DemandeFormData {
  // Étape 1: Soins
  typeSoin: string;
  urgence: UrgenceType;
  descriptionSoin?: string;

  // Étape 2: Patient
  patient: PatientFormData;

  // Étape 3: Ordonnance
  ordonnance?: OrdonnanceData;

  // Étape 4: Disponibilités
  dateRdv?: string;
  heureRdv?: string;
  creneauxPreferes?: string[];

  // Notes additionnelles
  notes?: string;
}

interface DemandeStore {
  formData: DemandeFormData;
  currentStep: number;

  // Actions
  setTypeSoin: (typeSoin: string) => void;
  setUrgence: (urgence: UrgenceType) => void;
  setPatient: (patient: Partial<PatientFormData>) => void;
  setOrdonnance: (ordonnance: Partial<OrdonnanceData> | undefined) => void;
  setDateRdv: (date: string) => void;
  setHeureRdv: (heure: string) => void;
  setNotes: (notes: string) => void;

  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;

  isStepValid: (step: number) => boolean;
}

const initialPatientData: PatientFormData = {
  nom: "",
  prenom: "",
  dateNaissance: "",
  email: "",
  telephone: "",
  adresse: "",
  complementAdresse: "",
  codePostal: "",
  ville: "",
  numeroSecu: "",
};

const initialFormData: DemandeFormData = {
  typeSoin: "",
  urgence: "NORMALE",
  patient: initialPatientData,
};

export const useDemandeStore = create<DemandeStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 1,

      setTypeSoin: (typeSoin) =>
        set((state) => ({
          formData: { ...state.formData, typeSoin },
        })),

      setUrgence: (urgence) =>
        set((state) => ({
          formData: { ...state.formData, urgence },
        })),

      setPatient: (patient) =>
        set((state) => ({
          formData: {
            ...state.formData,
            patient: { ...state.formData.patient, ...patient },
          },
        })),

      setOrdonnance: (ordonnance) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ordonnance: state.formData.ordonnance
              ? { ...state.formData.ordonnance, ...ordonnance }
              : (ordonnance as OrdonnanceData),
          },
        })),

      setDateRdv: (dateRdv) =>
        set((state) => ({
          formData: { ...state.formData, dateRdv },
        })),

      setHeureRdv: (heureRdv) =>
        set((state) => ({
          formData: { ...state.formData, heureRdv },
        })),

      setNotes: (notes) =>
        set((state) => ({
          formData: { ...state.formData, notes },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      goToStep: (step) => set({ currentStep: Math.min(Math.max(step, 1), 6) }),

      resetForm: () =>
        set({
          formData: initialFormData,
          currentStep: 1,
        }),

      isStepValid: (step) => {
        const { formData } = get();
        switch (step) {
          case 1:
            return !!formData.typeSoin && !!formData.urgence;
          case 2:
            const p = formData.patient;
            return !!(
              p.nom &&
              p.prenom &&
              p.dateNaissance &&
              p.email &&
              p.telephone &&
              p.adresse &&
              p.codePostal &&
              p.ville
            );
          case 3:
            return true; // Ordonnance optionnelle
          case 4:
            return !!(formData.dateRdv && formData.heureRdv);
          case 5:
            return (
              get().isStepValid(1) &&
              get().isStepValid(2) &&
              get().isStepValid(4)
            );
          default:
            return false;
        }
      },
    }),
    {
      name: "demande-storage",
    }
  )
);
