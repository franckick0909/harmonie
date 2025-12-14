"use client";

import { getDemandes } from "@/actions/dashboard";
import { getPatientStats } from "@/actions/patientStats";
import { refreshPlanningStats } from "@/actions/planningStats";
import { AppointmentDetailModal } from "@/components/dashboard/AppointmentDetailModal";
import { DashboardTabController } from "@/components/dashboard/DashboardTabController";
import type { Demande, PatientStats } from "@/types/demande";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [patientStats, setPatientStats] = useState<PatientStats>({
    patientsAujourdhui: 0,
    patientsCetteSemaine: 0,
    patientsCeMois: 0,
  });
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    // Calculer le début de la semaine (lundi)
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  const loadDemandes = useCallback(async () => {
    setIsLoading(true);
    try {
      // Charger TOUTES les demandes pour la vue d'ensemble
      // Le planning filtrera côté client les demandes de la semaine
      const result = await getDemandes();

      if (result.success && result.data) {
        setDemandes(result.data as unknown as Demande[]);
      }

      // Mettre à jour les statistiques de planning
      await refreshPlanningStats();

      // Récupérer les statistiques de patients
      const patientStatsResult = await getPatientStats();
      setPatientStats(patientStatsResult);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentWeekStart]);

  useEffect(() => {
    loadDemandes();
  }, [loadDemandes]);

  const handleDemandeClick = (demande: Demande) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDemande(null);
  };

  const handleDemandeUpdate = () => {
    // Recharger les demandes après une mise à jour
    loadDemandes();
  };

  const handleOptimisticUpdate = (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => {
    // Mise à jour optimiste immédiate
    setDemandes((prevDemandes) =>
      prevDemandes.map((demande) =>
        demande.id === demandeId
          ? { ...demande, dateRdv: newDate, heureRdv: newHeureRdv }
          : demande
      )
    );
  };

  return (
    <div className="h-screen">
      <DashboardTabController
        demandes={demandes}
        selectedDemande={selectedDemande}
        isModalOpen={isModalOpen}
        isLoading={isLoading}
        currentWeekStart={currentWeekStart}
        patientStats={patientStats}
        onDemandeSelect={handleDemandeClick}
        onModalClose={handleModalClose}
        onWeekChange={setCurrentWeekStart}
        onDemandeUpdate={handleDemandeUpdate}
        onOptimisticUpdate={handleOptimisticUpdate}
      />

      <AppointmentDetailModal
        demande={selectedDemande}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdate={handleDemandeUpdate}
      />
    </div>
  );
}
