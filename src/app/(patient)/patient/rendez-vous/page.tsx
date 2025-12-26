"use client";

import { getPatientDemandes } from "@/actions/patient";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Type pour les RDV
interface RendezVous {
  id: string;
  typeSoin: string;
  dateRdv: Date | null;
  heureRdv: string | null;
  lieu: string | null;
  statut: string;
  notes: string | null;
}

export default function RendezVousPage() {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");

  const loadRendezVous = useCallback(async () => {
    try {
      const result = await getPatientDemandes();
      if (result.success && result.data) {
        // Filtrer uniquement les demandes avec une date de RDV
        const rdvs = (result.data as RendezVous[]).filter((d) => d.dateRdv);
        setRendezVous(rdvs);
      }
    } catch (error) {
      console.error("Erreur chargement RDV:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRendezVous();
  }, [loadRendezVous]);

  const filteredRdv = rendezVous.filter((rdv) => {
    if (!rdv.dateRdv) return false;
    const now = new Date();
    const rdvDate = new Date(rdv.dateRdv);

    if (filter === "upcoming") {
      return rdvDate >= now && rdv.statut !== "ANNULEE";
    }
    if (filter === "past") {
      return rdvDate < now || rdv.statut === "TERMINEE";
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#927950]" />
      </div>
    );
  }

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "TERMINEE":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "ANNULEE":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-[#927950]" />;
    }
  };

  const getStatusLabel = (statut: string) => {
    const labels: Record<string, { label: string; className: string }> = {
      EN_ATTENTE: {
        label: "En attente",
        className: "bg-orange-100 text-orange-700",
      },
      CONFIRMEE: { label: "Confirmé", className: "bg-blue-100 text-blue-700" },
      EN_COURS: {
        label: "En cours",
        className: "bg-purple-100 text-purple-700",
      },
      TERMINEE: { label: "Terminé", className: "bg-green-100 text-green-700" },
      ANNULEE: { label: "Annulé", className: "bg-gray-100 text-gray-700" },
    };
    return labels[statut] || labels.EN_ATTENTE;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl text-[#1E211E] mb-2">
          Mes rendez-vous
        </h1>
        <p className="text-[#6b6b6b]">Consultez et gérez vos rendez-vous</p>
      </motion.div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {[
          { id: "upcoming", label: "À venir" },
          { id: "past", label: "Passés" },
          { id: "all", label: "Tous" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === f.id
                ? "bg-[#927950] text-white"
                : "bg-white text-[#6b6b6b] hover:bg-[#F4E6CD]/50 border border-[#d5ccc0]/30"
            }`}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Liste des RDV */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredRdv.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#d5ccc0]/30">
            <AlertCircle className="w-16 h-16 text-[#d5ccc0] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#1E211E] mb-2">
              Aucun rendez-vous
            </h3>
            <p className="text-[#6b6b6b] mb-6">
              {filter === "upcoming"
                ? "Vous n'avez pas de rendez-vous à venir"
                : filter === "past"
                ? "Aucun rendez-vous passé"
                : "Aucun rendez-vous enregistré"}
            </p>
            <Link
              href="/demande/soins"
              className="inline-flex items-center gap-2 bg-[#927950] text-white px-6 py-3 rounded-lg hover:bg-[#7a6443] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRdv.map((rdv, index) => {
              const status = getStatusLabel(rdv.statut);
              return (
                <motion.div
                  key={rdv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#d5ccc0]/30"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F9F7F2] flex items-center justify-center shrink-0">
                        {getStatusIcon(rdv.statut)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-[#1E211E] text-base sm:text-lg">
                          {rdv.typeSoin}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-4 mt-2 text-sm text-[#6b6b6b]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 shrink-0" />
                            {rdv.dateRdv &&
                              new Date(rdv.dateRdv).toLocaleDateString(
                                "fr-FR",
                                {
                                  weekday: "long",
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                          </span>
                          {rdv.heureRdv && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4 shrink-0" />
                              {rdv.heureRdv}
                            </span>
                          )}
                          {rdv.lieu && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 shrink-0" />
                              {rdv.lieu}
                            </span>
                          )}
                        </div>
                        {rdv.notes && (
                          <p className="mt-3 text-sm text-[#6b6b6b] bg-[#F9F7F2] p-3 rounded-lg">
                            {rdv.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap self-start ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
