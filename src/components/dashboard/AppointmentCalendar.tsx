"use client";

import type { Demande } from "@/types/demande";
import { motion } from "framer-motion";
import { AlertCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMemo } from "react";

interface AppointmentCalendarProps {
  demandes: Demande[];
  onDemandeSelect: (demande: Demande) => void;
  onDemandeUpdate: () => void;
  currentWeekStart: Date;
  onWeekChange: (date: Date) => void;
  onOptimisticUpdate: (
    demandeId: string,
    newDate: Date,
    newHeureRdv: string
  ) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8h à 19h
const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function AppointmentCalendar({
  demandes,
  onDemandeSelect,
  currentWeekStart,
  onWeekChange,
}: AppointmentCalendarProps) {
  // Générer les jours de la semaine
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  // Grouper les demandes par jour et heure
  const demandesByDayHour = useMemo(() => {
    const grouped: Record<string, Demande[]> = {};

    demandes.forEach((demande) => {
      if (!demande.dateRdv) return;

      const date = new Date(demande.dateRdv);
      const dayKey = date.toISOString().split("T")[0];
      // heureRdv format is "HH:MM" (e.g., "14:00"), not French "14h"
      const hour = demande.heureRdv
        ? parseInt(demande.heureRdv.split(":")[0])
        : date.getHours();
      const key = `${dayKey}-${hour}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(demande);
    });

    return grouped;
  }, [demandes]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(
      currentWeekStart.getDate() + (direction === "next" ? 7 : -7)
    );
    onWeekChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);
    onWeekChange(monday);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const formatWeekRange = () => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return `${currentWeekStart.toLocaleDateString(
      "fr-FR",
      options
    )} - ${end.toLocaleDateString("fr-FR", options)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#1E211E] mb-2">Planning</h1>
          <p className="text-[#6b6b6b]">Vue hebdomadaire des rendez-vous</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateWeek("prev")}
            className="p-2 hover:bg-[#F4E6CD]-dark rounded-lg transition-colors"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={goToToday}
            className="px-4 py-2 bg-[#F4E6CD]-dark hover:bg-[#927950] hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            Aujourd&apos;hui
          </button>

          <span className="px-4 py-2 text-sm font-medium text-[#1E211E] min-w-[180px] text-center">
            {formatWeekRange()}
          </span>

          <button
            type="button"
            onClick={() => navigateWeek("next")}
            className="p-2 hover:bg-[#F4E6CD]-dark rounded-lg transition-colors"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-[#F4E6CD]-dark rounded-xl overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b border-[#d5ccc0]">
          <div className="p-4 text-center text-sm font-medium text-[#6b6b6b]">
            Heure
          </div>
          {weekDays.map((date, index) => (
            <div
              key={date.toISOString()}
              className={`p-4 text-center border-l border-[#d5ccc0] ${
                isToday(date) ? "bg-[#927950]/10" : ""
              }`}
            >
              <p className="text-xs text-[#6b6b6b]">{DAYS[index]}</p>
              <p
                className={`text-lg font-semibold ${
                  isToday(date) ? "text-[#927950]" : "text-[#1E211E]"
                }`}
              >
                {date.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-[#d5ccc0] min-h-[80px]"
            >
              {/* Hour Label */}
              <div className="p-2 text-center text-sm text-[#6b6b6b] border-r border-[#d5ccc0]">
                {hour}h00
              </div>

              {/* Day Cells */}
              {weekDays.map((date) => {
                const dayKey = date.toISOString().split("T")[0];
                const key = `${dayKey}-${hour}`;
                const cellDemandes = demandesByDayHour[key] || [];

                return (
                  <div
                    key={key}
                    className={`p-1 border-l border-[#d5ccc0] ${
                      isToday(date) ? "bg-[#927950]/5" : ""
                    }`}
                  >
                    {cellDemandes.map((demande) => (
                      <AppointmentCard
                        key={demande.id}
                        demande={demande}
                        onClick={() => onDemandeSelect(demande)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-[#6b6b6b]">Confirmé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-orange-500" />
          <span className="text-[#6b6b6b]">En attente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-purple-500" />
          <span className="text-[#6b6b6b]">En cours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-[#6b6b6b]">Terminé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span className="text-[#6b6b6b]">Urgent</span>
        </div>
      </div>
    </div>
  );
}

interface AppointmentCardProps {
  demande: Demande;
  onClick: () => void;
}

function AppointmentCard({ demande, onClick }: AppointmentCardProps) {
  const statusColors: Record<string, string> = {
    EN_ATTENTE: "bg-orange-500",
    CONFIRMEE: "bg-blue-500",
    EN_COURS: "bg-purple-500",
    TERMINEE: "bg-green-500",
    ANNULEE: "bg-gray-500",
  };

  const isUrgent =
    demande.urgence === "ELEVEE" || demande.urgence === "URGENTE";
  const bgColor = isUrgent
    ? "bg-red-50 border-red-200"
    : "bg-[#F4E6CD] border-[#d5ccc0]";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-2 rounded-lg border text-left transition-shadow hover:shadow-md ${bgColor}`}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${statusColors[demande.statut]}`}
            />
            <p className="text-xs font-medium text-[#1E211E] truncate">
              {demande.patient.prenom} {demande.patient.nom[0]}.
            </p>
          </div>
          <p className="text-[10px] text-[#6b6b6b] truncate mt-0.5">
            {demande.typeSoin}
          </p>
          {demande.heureRdv && (
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-[#6b6b6b]" />
              <span className="text-[10px] text-[#6b6b6b]">
                {demande.heureRdv}
              </span>
            </div>
          )}
        </div>
        {isUrgent && (
          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
        )}
      </div>
    </motion.button>
  );
}
