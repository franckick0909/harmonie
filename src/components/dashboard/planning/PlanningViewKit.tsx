"use client";

import type { Demande } from "@/types/demande";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { WeekViewKit } from "./WeekViewKit";

interface PlanningViewKitProps {
  demandes: Demande[];
  selectedDemande: Demande | null;
  isModalOpen: boolean;
  isLoading: boolean;
  onDemandeClick: (demande: Demande) => void;
  onModalClose: () => void;
  onUpdate: () => void;
  onOptimisticUpdate: (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => void;
  weekStart: Date;
}

export function PlanningViewKit({
  demandes,
  onDemandeClick,
  onUpdate,
  onOptimisticUpdate,
  weekStart,
}: PlanningViewKitProps) {
  const [, setActiveId] = useState<string | null>(null);
  const [activeDemande, setActiveDemande] = useState<Demande | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const demande = demandes.find((d) => d.id === active.id);

    setActiveId(active.id as string);
    setActiveDemande(demande || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveDemande(null);
      return;
    }

    const overId = over.id as string;

    // Extraire day et hour du drop zone ID
    if (overId.startsWith("drop-")) {
      const parts = overId.split("-");
      const dayTimestamp = parseInt(parts[1]);
      const hour = parseInt(parts[2]);

      const day = new Date(dayTimestamp);

      // Déclencher le drop
      handleDrop(active.id as string, day, hour);
    }

    setActiveId(null);
    setActiveDemande(null);
  };

  const handleDrop = async (demandeId: string, day: Date, hour: number) => {
    const draggedDemande = demandes.find((d) => d.id === demandeId);
    if (!draggedDemande) return;

    // Vérifier si c'est le même créneau
    const demandeDate = draggedDemande.dateRdv
      ? new Date(draggedDemande.dateRdv)
      : null;
    const isAllDay =
      !draggedDemande.heureRdv ||
      draggedDemande.heureRdv === "Toute la journée";
    const heureMatch = draggedDemande.heureRdv?.match(/(\d+)h/);
    const demandeHour = isAllDay
      ? 0
      : heureMatch
      ? parseInt(heureMatch[1])
      : null;

    const isSameSlot =
      demandeDate &&
      demandeDate.getDate() === day.getDate() &&
      demandeDate.getMonth() === day.getMonth() &&
      demandeDate.getFullYear() === day.getFullYear() &&
      demandeHour === hour;

    if (isSameSlot) return;

    // Créer la nouvelle date/heure
    const newDate = new Date(day);
    const newHeureRdv = hour === 0 ? "Toute la journée" : `${hour}h`;

    // Mise à jour optimiste
    onOptimisticUpdate(draggedDemande.id, newDate, newHeureRdv);

    // Mise à jour en base
    try {
      const response = await fetch("/api/demandes/update-date", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draggedDemande.id,
          dateRdv: newDate.toISOString(),
          heureRdv: newHeureRdv,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        alert(`Erreur: ${result.error}`);
        // Recharger les données en cas d'erreur pour annuler la mise à jour optimiste
        onUpdate();
      } else {
        // Même en cas de succès, on recharge pour s'assurer que tout est synchronisé
        // (notamment si d'autres composants ont besoin des données fraîches)
        onUpdate();
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du déplacement");
      // Recharger les données en cas d'erreur pour annuler la mise à jour optimiste
      onUpdate();
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <WeekViewKit
        demandes={demandes}
        weekStart={weekStart}
        onDemandeClick={onDemandeClick}
      />

      <DragOverlay>
        {activeDemande ? (
          <div className="opacity-50">
            {/* Badge dupliqué pour l'overlay */}
            <div className="py-1 h-auto text-[10px] px-1 lg:px-2 lg:text-xs rounded-full bg-primary text-primary-foreground">
              <span className="font-medium text-[10px] lg:text-xs truncate whitespace-nowrap">
                <span className="lg:hidden uppercase">
                  {activeDemande.patient.prenom.charAt(0).toUpperCase()}
                  {activeDemande.patient.nom.charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline">
                  {activeDemande.patient.prenom} {activeDemande.patient.nom}
                </span>
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
