"use client";

import type { UrgenceType } from "@/types/demande";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

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
  url: string;
  nom: string;
  type: string;
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
  dateRdv?: Date;
  heureRdv?: string;
  creneauxPreferes?: string[];

  // Notes additionnelles
  notes?: string;
}

interface DemandeContextType {
  formData: DemandeFormData;
  currentStep: number;
  updateFormData: (data: Partial<DemandeFormData>) => void;
  updatePatient: (data: Partial<PatientFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
  isStepValid: (step: number) => boolean;
}

const DemandeContext = createContext<DemandeContextType | undefined>(undefined);

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

interface DemandeProviderProps {
  children: ReactNode;
}

export function DemandeProvider({ children }: DemandeProviderProps) {
  const [formData, setFormData] = useState<DemandeFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = useCallback((data: Partial<DemandeFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const updatePatient = useCallback((data: Partial<PatientFormData>) => {
    setFormData((prev) => ({
      ...prev,
      patient: { ...prev.patient, ...data },
    }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }, []);

  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1: // Soins
          return !!formData.typeSoin && !!formData.urgence;

        case 2: // Patient
          const { patient } = formData;
          return !!(
            patient.nom &&
            patient.prenom &&
            patient.dateNaissance &&
            patient.email &&
            patient.telephone &&
            patient.adresse &&
            patient.codePostal &&
            patient.ville &&
            patient.numeroSecu
          );

        case 3: // Ordonnance (optionnel)
          return true;

        case 4: // Disponibilités
          return !!(formData.dateRdv && formData.heureRdv);

        case 5: // Récapitulatif
          return isStepValid(1) && isStepValid(2) && isStepValid(4);

        default:
          return false;
      }
    },
    [formData]
  );

  return (
    <DemandeContext.Provider
      value={{
        formData,
        currentStep,
        updateFormData,
        updatePatient,
        nextStep,
        prevStep,
        goToStep,
        resetForm,
        isStepValid,
      }}
    >
      {children}
    </DemandeContext.Provider>
  );
}

export function useDemande() {
  const context = useContext(DemandeContext);
  if (context === undefined) {
    throw new Error("useDemande must be used within a DemandeProvider");
  }
  return context;
}
