"use client";

import { DemandeCardKit } from "@/components/dashboard/DemandeCardKit";
import type { Demande } from "@/types/demande";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { useMemo, useState } from "react";
import { PlanningViewKit } from "./PlanningViewKit";

interface PlanningViewProps {
  demandes: Demande[];
  onDemandeSelect: (demande: Demande) => void;
  onDemandeUpdate: () => void;
  currentWeekStart?: Date;
  onWeekChange?: (date: Date) => void;
  onOptimisticUpdate: (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => void;
}

type ViewType = "week" | "month";

export function PlanningView({
  demandes,
  onDemandeSelect,
  onDemandeUpdate,
  currentWeekStart,
  onWeekChange,
  onOptimisticUpdate,
}: PlanningViewProps) {
  const [viewType, setViewType] = useState<ViewType>("week");
  const [currentDate, setCurrentDate] = useState(
    currentWeekStart || new Date()
  );
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

  // Calculer les dates de début et fin selon la vue
  const { startDate, endDate, title } = useMemo(() => {
    const date = new Date(currentDate);

    if (viewType === "week") {
      // Début de la semaine (lundi)
      const day = date.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      const start = new Date(date);
      start.setDate(date.getDate() + diff);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      const weekTitle = `${start.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })} - ${end.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;

      return { startDate: start, endDate: end, title: weekTitle };
    } else {
      // Début et fin du mois
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);

      const monthTitle = date.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      return { startDate: start, endDate: end, title: monthTitle };
    }
  }, [currentDate, viewType]);

  // Filtrer les demandes pour la période
  const filteredDemandes = useMemo(() => {
    return demandes.filter((demande) => {
      if (!demande.dateRdv) return false;
      const demandeDate = new Date(demande.dateRdv);
      return demandeDate >= startDate && demandeDate <= endDate;
    });
  }, [demandes, startDate, endDate]);

  // Statistiques pour la période
  const periodStats = useMemo(() => {
    const total = filteredDemandes.length;
    const confirmees = filteredDemandes.filter(
      (d) => d.statut === "CONFIRMEE"
    ).length;
    const enCours = filteredDemandes.filter(
      (d) => d.statut === "EN_COURS"
    ).length;
    const terminees = filteredDemandes.filter(
      (d) => d.statut === "TERMINEE"
    ).length;
    const urgentes = filteredDemandes.filter(
      (d) => d.urgence === "URGENTE"
    ).length;

    return { total, confirmees, enCours, terminees, urgentes };
  }, [filteredDemandes]);

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(currentDate.getDate() - 7);
      if (onWeekChange) {
        onWeekChange(newDate);
      }
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "week") {
      newDate.setDate(currentDate.getDate() + 7);
      if (onWeekChange) {
        onWeekChange(newDate);
      }
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (viewType === "week" && onWeekChange) {
      onWeekChange(today);
    }
  };

  // Obtenir les jours pour l'affichage
  const getDaysToDisplay = () => {
    const days = [];

    if (viewType === "week") {
      // 7 jours de la semaine
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
      }
    } else {
      // Tous les jours du mois
      const firstDay = new Date(startDate);
      const lastDay = new Date(endDate);

      // Commencer par le lundi de la première semaine
      const startOfCalendar = new Date(firstDay);
      const dayOfWeek = firstDay.getDay();
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfCalendar.setDate(firstDay.getDate() - daysToSubtract);

      // Aller jusqu'au dimanche de la dernière semaine
      const endOfCalendar = new Date(lastDay);
      const endDayOfWeek = lastDay.getDay();
      const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek;
      endOfCalendar.setDate(lastDay.getDate() + daysToAdd);

      const current = new Date(startOfCalendar);
      while (current <= endOfCalendar) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    }

    return days;
  };

  const days = getDaysToDisplay();

  // Obtenir les demandes pour un jour donné
  const getDemandesForDay = (day: Date) => {
    return filteredDemandes.filter((demande) => {
      if (!demande.dateRdv) return false;
      const demandeDate = new Date(demande.dateRdv);
      return (
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Gestion du drag and drop pour la vue mois
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const demande = demandes.find((d) => d.id === active.id);
    setActiveDemande(demande || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDemande(null);
      return;
    }

    const overId = over.id as string;

    // Extraire le jour du drop zone ID pour la vue mois
    if (overId.startsWith("month-drop-")) {
      const parts = overId.split("-");
      const dayTimestamp = parseInt(parts[2]);
      const day = new Date(dayTimestamp);

      const draggedDemande = demandes.find((d) => d.id === active.id);
      if (!draggedDemande) {
        setActiveDemande(null);
        return;
      }

      // Vérifier si c'est le même jour
      const demandeDate = draggedDemande.dateRdv
        ? new Date(draggedDemande.dateRdv)
        : null;

      const isSameDay =
        demandeDate &&
        demandeDate.getDate() === day.getDate() &&
        demandeDate.getMonth() === day.getMonth() &&
        demandeDate.getFullYear() === day.getFullYear();

      if (isSameDay) {
        setActiveDemande(null);
        return;
      }

      // Conserver l'heure actuelle ou utiliser "Toute la journée" si pas d'heure
      const newDate = new Date(day);
      // Conserver l'heure existante si elle existe, sinon "Toute la journée"
      const newHeureRdv = draggedDemande.heureRdv
        ? draggedDemande.heureRdv
        : "Toute la journée";

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
          onDemandeUpdate();
        } else {
          onDemandeUpdate();
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors du déplacement");
        onDemandeUpdate();
      }
    }

    setActiveDemande(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 md:px-6 py-5 md:py-6 border-b border-[#d5ccc0]/20 z-10 bg-white  rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#1E211E] tracking-tight mb-2">
              Planning
            </h1>
            <p className="text-base text-[#6b6b6b]">{title}</p>
          </div>

          {/* Sélecteur de vue - Style segmenté */}
          <div className="flex items-center gap-0 bg-white p-1 rounded-lg border border-[#d5ccc0]/30 shadow-sm">
            <button
              type="button"
              onClick={() => setViewType("week")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewType === "week"
                  ? "bg-[#F4E6CD] text-[#1E211E] shadow-sm"
                  : "text-[#6b6b6b] hover:text-[#1E211E] hover:bg-[#F4E6CD]/30"
              }`}
            >
              <List className="w-4 h-4 inline-block mr-2" />
              Semaine
            </button>
            <button
              type="button"
              onClick={() => setViewType("month")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewType === "month"
                  ? "bg-[#F4E6CD] text-[#1E211E] shadow-sm"
                  : "text-[#6b6b6b] hover:text-[#1E211E] hover:bg-[#F4E6CD]/30"
              }`}
            >
              <Grid3X3 className="w-4 h-4 inline-block mr-2" />
              Mois
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={goToPrevious}
            className="px-3 py-2 bg-white border border-[#d5ccc0]/50 rounded-lg text-sm text-[#1E211E] hover:bg-[#F4E6CD]/30 hover:border-[#927950]/30 transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 inline-block mr-1" />
            <span className="hidden sm:inline">Semaine précédente</span>
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="px-4 py-2 bg-white border border-[#d5ccc0]/50 rounded-lg text-sm font-medium text-[#1E211E] hover:bg-[#927950] hover:text-white hover:border-[#927950] transition-all shadow-sm"
          >
            Aujourd&apos;hui
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="px-3 py-2 bg-white border border-[#d5ccc0]/50 rounded-lg text-sm text-[#1E211E] hover:bg-[#F4E6CD]/30 hover:border-[#927950]/30 transition-all shadow-sm"
          >
            <span className="hidden sm:inline">Semaine suivante</span>
            <ChevronRight className="w-4 h-4 inline-block ml-1" />
          </button>
        </div>

        {/* Légende des statuts */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#1E211E]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-300"></div>
            <span>{periodStats.confirmees} Confirmés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-300"></div>
            <span>{periodStats.enCours} En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 border border-green-300"></div>
            <span>{periodStats.terminees} Terminés</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 border border-red-300"></div>
            <span>{periodStats.urgentes} Urgents</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto py-4 md:py-6">
        {viewType === "week" ? (
          <PlanningViewKit
            demandes={demandes}
            selectedDemande={null}
            isModalOpen={false}
            isLoading={false}
            onDemandeClick={onDemandeSelect}
            onModalClose={() => {}}
            onUpdate={onDemandeUpdate}
            onOptimisticUpdate={onOptimisticUpdate}
            weekStart={startDate}
          />
        ) : (
          /* Vue Mois avec Drag and Drop */
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="bg-white rounded-xl border border-[#d5ccc0]/50 shadow-sm overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-[#d5ccc0]/50">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-3 text-center border-r border-[#d5ccc0]/40 last:border-r-0 bg-[#F4E6CD]/30"
                    >
                      <span className="text-sm font-semibold text-[#1E211E]">
                        {day}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const dayDemandes = getDemandesForDay(day);
                  const isCurrentMonth =
                    day.getMonth() === currentDate.getMonth();
                  const isToday =
                    day.toDateString() === new Date().toDateString();

                  return (
                    <MonthDropZone
                      key={day.toISOString()}
                      day={day}
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday}
                      dayDemandes={dayDemandes}
                      onDemandeSelect={onDemandeSelect}
                    />
                  );
                })}
              </div>
            </div>

            <DragOverlay>
              {activeDemande ? (
                <div className="opacity-50">
                  <DemandeCardKit demande={activeDemande} onClick={() => {}} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
}

// Composant DropZone pour la vue mois
function MonthDropZone({
  day,
  isCurrentMonth,
  isToday,
  dayDemandes,
  onDemandeSelect,
}: {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayDemandes: Demande[];
  onDemandeSelect: (demande: Demande) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `month-drop-${day.getTime()}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] p-2 transition-colors border-r border-b border-[#d5ccc0]/40 last:border-r-0
        ${!isCurrentMonth ? "bg-[#F4E6CD]/10 text-[#6b6b6b]" : "bg-white"} 
        ${isToday ? "bg-[#F4E6CD]" : ""}
        ${isOver ? "bg-[#927950]/10 border-[#927950]" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-semibold ${
            isToday ? "text-[#1E211E]" : "text-[#1E211E]"
          }`}
        >
          {day.getDate()}
        </span>
        {dayDemandes.length > 0 && (
          <span className="text-[10px] text-[#6b6b6b]">
            {dayDemandes.length} RDV
          </span>
        )}
      </div>

      <div className="space-y-1">
        {dayDemandes.slice(0, 3).map((demande) => (
          <MonthDemandeBadge
            key={demande.id}
            demande={demande}
            onClick={() => onDemandeSelect(demande)}
          />
        ))}
        {dayDemandes.length > 3 && (
          <div className="text-center pt-1">
            <span className="text-[10px] text-[#6b6b6b]">
              +{dayDemandes.length - 3} autres
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Composant Badge pour la vue mois avec l'heure affichée
function MonthDemandeBadge({
  demande,
  onClick,
}: {
  demande: Demande;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: demande.id,
      data: {
        type: "demande",
        demande,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
        opacity: 0.8,
      }
    : undefined;

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick();
  };

  // Obtenir les couleurs selon le statut et l'urgence (même logique que DemandeCardKit)
  const getBadgeClasses = () => {
    if (demande.urgence === "URGENTE") {
      return "bg-[#FFDCDC] text-[#1E211E] border-red-200 hover:bg-[#FFCECE] shadow-sm";
    }
    if (demande.statut === "CONFIRMEE") {
      return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 shadow-sm";
    }
    if (demande.statut === "EN_COURS") {
      return "bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100 shadow-sm";
    }
    if (demande.statut === "TERMINEE") {
      return "bg-green-50 text-green-900 border-green-200 hover:bg-green-100 shadow-sm";
    }
    if (demande.urgence === "ELEVEE") {
      return "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 shadow-sm";
    }
    return "bg-[#F4E6CD]/70 text-[#1E211E] border-[#d5ccc0]/50 hover:bg-[#F4E6CD] shadow-sm";
  };

  // Formater l'heure pour l'affichage
  const heureDisplay = demande.heureRdv || "Toute la journée";

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        touchAction: "none",
      }}
      {...listeners}
      {...attributes}
      className="group relative cursor-move"
    >
      <button
        onClick={handleClick}
        className={`
          w-full text-left px-2 py-1 rounded text-xs border transition-all shadow-sm hover:shadow-md
          select-none flex items-center justify-center
          ${getBadgeClasses()}
          ${isDragging ? "opacity-50" : ""}
        `}
      >
        <span className="font-medium text-[11px] leading-none truncate whitespace-nowrap block w-full text-center">
          {heureDisplay} - {demande.patient.prenom} {demande.patient.nom}
        </span>
      </button>
    </div>
  );
}
