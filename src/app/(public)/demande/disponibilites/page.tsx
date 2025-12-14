"use client";

import { FormNavigation } from "@/components/demande/FormNavigation";
import { Button } from "@/components/ui/Button";
import { useDemandeStore } from "@/stores/demandeStore";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const HEURES_DISPONIBLES = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export default function DisponibilitesPage() {
  const router = useRouter();
  const {
    formData,
    setDateRdv,
    setHeureRdv,
    nextStep,
    prevStep,
    isStepValid,
    goToStep,
  } = useDemandeStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleNext = () => {
    if (isStepValid(3)) {
      nextStep();
      goToStep(4);
      router.push("/demande/patient");
    }
  };

  const handlePrevious = () => {
    prevStep();
    goToStep(2);
    router.push("/demande/ordonnance");
  };

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = (firstDay.getDay() + 6) % 7;

    const days: (Date | null)[] = [];

    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  const isDateSelected = (date: Date | null) => {
    if (!date || !formData.dateRdv) return false;
    return date.toISOString().split("T")[0] === formData.dateRdv;
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4">
          Où et quand souhaitez-vous faire vos soins ?
        </h1>
        <p className="text-sm text-red-600">* Champs obligatoires</p>
      </div>

      {/* Boutons de navigation en haut */}
      <div className="mb-6">
        <FormNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={formData.dateRdv && formData.heureRdv ? true : false}
          nextLabel="Continuer"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendrier */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
                  )
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-semibold text-[#1a1a1a] capitalize">
                {formatMonth(currentMonth)}
              </h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1
                    )
                  )
                }
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={isDateDisabled(date)}
                  onClick={() =>
                    date && setDateRdv(date.toISOString().split("T")[0])
                  }
                  className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all ${
                    !date
                      ? "invisible"
                      : isDateSelected(date)
                      ? "bg-[#927950] text-white font-semibold"
                      : isDateDisabled(date)
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-[#1a1a1a]"
                  }`}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </div>

          {/* Créneaux horaires */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#927950]" />
              <h3 className="text-lg font-semibold text-[#1a1a1a]">
                Créneaux disponibles
              </h3>
            </div>

            {formData.dateRdv ? (
              <div className="grid grid-cols-3 gap-2">
                {HEURES_DISPONIBLES.map((heure) => (
                  <motion.button
                    key={heure}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setHeureRdv(heure)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      formData.heureRdv === heure
                        ? "bg-[#927950] text-white"
                        : "bg-gray-100 text-[#1a1a1a] hover:bg-[#927950]/10"
                    }`}
                  >
                    {heure}
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-8 bg-gray-50 rounded-xl text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">
                  Sélectionnez d&apos;abord une date pour voir les créneaux
                  disponibles
                </p>
              </div>
            )}
          </div>
        </div>

        {formData.dateRdv && formData.heureRdv && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <p className="text-green-700 font-medium">
              ✓ Rendez-vous sélectionné :{" "}
              {new Date(formData.dateRdv).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              à {formData.heureRdv}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
