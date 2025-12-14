"use client";

import { DemandeCardKit } from "@/components/dashboard/DemandeCardKit";
import type { Demande } from "@/types/demande";
import { useDroppable } from "@dnd-kit/core";
import { useCallback } from "react";

interface WeekViewKitProps {
  demandes: Demande[];
  weekStart: Date;
  onDemandeClick: (demande: Demande) => void;
}

const HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export function WeekViewKit({
  demandes,
  weekStart,
  onDemandeClick,
}: WeekViewKitProps) {
  // Générer les 7 jours de la semaine à partir de weekStart
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Fonction pour obtenir les demandes d'un jour et d'une heure spécifiques
  const getDemandesForDayAndHour = useCallback(
    (day: Date, hour: number) => {
      return demandes.filter((demande) => {
        // Les demandes sans dateRdv ne sont pas affichées dans les créneaux horaires
        // (elles sont affichées dans la section "À planifier" au-dessus)
        if (!demande.dateRdv) return false;

        // Normaliser les dates pour éviter les problèmes de fuseau horaire
        const demandeDate = new Date(demande.dateRdv);
        const dayDate = new Date(day);

        // Réinitialiser les heures pour comparer seulement les dates
        demandeDate.setHours(0, 0, 0, 0);
        dayDate.setHours(0, 0, 0, 0);

        // Comparer seulement la date (sans l'heure) - méthode plus simple avec toDateString
        const demandeDateStr = demandeDate.toDateString();
        const dayDateStr = dayDate.toDateString();

        const isSameDay = demandeDateStr === dayDateStr;

        if (!isSameDay) return false;

        // Pour "Toute la journée" (hour === 0)
        if (hour === 0) {
          return (
            !demande.heureRdv ||
            demande.heureRdv === "Toute la journée" ||
            demande.heureRdv === "À définir avec le professionnel" ||
            demande.heureRdv.trim() === ""
          );
        }

        // Pour une heure spécifique
        // Gérer différents formats : "9h00", "9h", "09h00", "09h", "9:00", "09:00", "11:00", etc.
        // Regex pour gérer les deux formats : "h" et ":"
        const heureMatchH = demande.heureRdv?.match(/(\d+)h/);
        const heureMatchColon = demande.heureRdv?.match(/(\d+):/);
        const demandeHour = heureMatchH
          ? parseInt(heureMatchH[1])
          : heureMatchColon
          ? parseInt(heureMatchColon[1])
          : null;

        // Si pas d'heure spécifiée et qu'on cherche une heure spécifique, ne pas inclure
        if (demandeHour === null) return false;

        return demandeHour === hour;
      });
    },
    [demandes]
  );

  // Fonction pour obtenir les demandes "Toute la journée" d'un jour
  const getDemandesAllDay = useCallback(
    (day: Date) => {
      return getDemandesForDayAndHour(day, 0);
    },
    [getDemandesForDayAndHour]
  );

  return (
    <div className="flex flex-col h-full bg-white border border-[#d5ccc0]/50 shadow-sm rounded-xl overflow-x-auto overflow-y-auto w-full">
      {/* Header avec les jours */}
      <div className="grid grid-cols-8 border-b border-[#d5ccc0]/50 sticky top-0 bg-white z-10 min-w-[320px] sm:min-w-0">
        {/* Colonne des heures */}
        <div className="px-3 sm:px-4 py-3 text-sm font-semibold text-[#1E211E] border-r border-[#d5ccc0]/40 text-left bg-[#F9F7F2]">
          Heure
        </div>
        {weekDays.map((day, index) => {
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`px-2 sm:px-4 py-3 text-center border-r border-[#d5ccc0]/40 last:border-r-0 ${
                isToday
                  ? "bg-[#F4E6CD] text-[#1E211E] font-semibold"
                  : "bg-white"
              }`}
            >
              <div className="text-xs sm:text-sm font-medium text-[#1E211E]">
                {day.toLocaleDateString("fr-FR", { weekday: "short" })}
              </div>
              <div className="text-xs text-[#1E211E]">{day.getDate()}</div>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto">
        {/* Ligne "Toute la journée" */}
        <div className="grid grid-cols-8 border-b border-[#d5ccc0]/40 min-h-[60px] min-w-[320px] sm:min-w-0">
          <div className="px-3 sm:px-4 py-3 text-xs text-[#1E211E] border-r border-[#d5ccc0]/40 flex items-center bg-[#F9F7F2]">
            Toute la journée
          </div>
          {weekDays.map((day, dayIndex) => {
            return (
              <DropZoneKit
                key={dayIndex}
                day={day}
                hour={0}
                demandes={getDemandesAllDay(day)}
                onDemandeClick={onDemandeClick}
              />
            );
          })}
        </div>

        {/* Grille avec les heures et créneaux */}
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-[#d5ccc0]/40 min-h-[60px] min-w-[320px] sm:min-w-0"
          >
            {/* Colonne des heures */}
            <div className="px-3 sm:px-4 py-3 text-xs text-[#1E211E] border-r border-[#d5ccc0]/40 flex items-center bg-[#F9F7F2]">
              {hour}h00
            </div>
            {weekDays.map((day, dayIndex) => {
              return (
                <DropZoneKit
                  key={dayIndex}
                  day={day}
                  hour={hour}
                  demandes={getDemandesForDayAndHour(day, hour)}
                  onDemandeClick={onDemandeClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant DropZone avec @dnd-kit
function DropZoneKit({
  day,
  hour,
  demandes,
  onDemandeClick,
}: {
  day: Date;
  hour: number;
  demandes: Demande[];
  onDemandeClick: (demande: Demande) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `drop-${day.getTime()}-${hour}`,
  });

  const handleClick = () => {
    // Si on clique sur la zone et qu'il y a une demande en cours de drag
    // (cette logique sera gérée par le DragOverlay)
  };

  const isToday =
    day.getDate() === new Date().getDate() &&
    day.getMonth() === new Date().getMonth() &&
    day.getFullYear() === new Date().getFullYear();

  return (
    <div
      ref={setNodeRef}
      className={`p-1.5 border-r border-[#d5ccc0]/40 relative min-h-[60px] sm:min-h-[80px] ${
        isToday ? "bg-[#F4E6CD]" : "bg-white"
      } ${
        isOver ? "bg-[#927950]/10 border-[#927950]" : ""
      } hover:bg-[#F4E6CD]/30 transition-colors`}
      onClick={handleClick}
    >
      {/* Layout responsive avec CSS Grid */}
      <div
        className="grid gap-1 h-full w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1"
        style={{
          gridAutoRows: "min-content",
        }}
      >
        {demandes.map((demande) => (
          <DemandeCardKit
            key={demande.id}
            demande={demande}
            onClick={() => onDemandeClick(demande)}
          />
        ))}
      </div>
    </div>
  );
}
