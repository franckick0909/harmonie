"use client";

import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { PatientListTable } from "@/components/dashboard/PatientListTable";
import { PlanningView } from "@/components/dashboard/planning/PlanningView";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PatientService } from "@/services/patientService";
import type { Demande, PatientStats } from "@/types/demande";
import { useMemo, useState } from "react";

interface DashboardTabControllerProps {
  demandes: Demande[];
  selectedDemande: Demande | null;
  isModalOpen: boolean;
  isLoading: boolean;
  currentWeekStart: Date;
  patientStats: PatientStats;
  onDemandeSelect: (demande: Demande) => void;
  onModalClose: () => void;
  onWeekChange: (date: Date) => void;
  onDemandeUpdate: () => void;
  onOptimisticUpdate: (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => void;
}

export function DashboardTabController({
  demandes,
  currentWeekStart,
  patientStats,
  onDemandeSelect,
  onWeekChange,
  onDemandeUpdate,
  onOptimisticUpdate,
}: DashboardTabControllerProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Calculer les statistiques pour le sidebar
  const patients = useMemo(() => {
    return PatientService.extractPatientsFromDemandes(demandes);
  }, [demandes]);

  const stats = useMemo(() => {
    return PatientService.calculateStats(patients, demandes);
  }, [patients, demandes]);

  // Fonction pour gérer l'envoi de notifications (placeholder)
  const handleSendNotification = (demandeId: string, type: "sms" | "email") => {
    console.log(`Envoi de notification ${type} pour la demande ${demandeId}`);
    // TODO: Intégrer avec un service de notification réel
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview demandes={demandes} stats={stats} />;

      case "patients":
        return (
          <PatientListTable
            demandes={demandes}
            onPatientSelect={(patient) => {
              console.log("Patient sélectionné:", patient);
            }}
          />
        );

      case "planning":
        return (
          <PlanningView
            demandes={demandes}
            onDemandeSelect={onDemandeSelect}
            onDemandeUpdate={onDemandeUpdate}
            currentWeekStart={currentWeekStart}
            onWeekChange={onWeekChange}
            onOptimisticUpdate={onOptimisticUpdate}
          />
        );

      case "notifications":
        return (
          <NotificationsPanel
            demandes={demandes}
            onSendNotification={handleSendNotification}
          />
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      stats={{
        ...stats,
        patientsAujourdhui: patientStats.patientsAujourdhui,
        patientsCetteSemaine: patientStats.patientsCetteSemaine,
        patientsCeMois: patientStats.patientsCeMois,
      }}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
}
