"use client";

import { getPatientDemandes } from "@/actions/patient";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// Type pour les demandes
interface Demande {
  id: string;
  typeSoin: string;
  dateRdv: Date | null;
  statut: string;
  urgence: string;
  createdAt: Date;
}

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDemandes = useCallback(async () => {
    try {
      const result = await getPatientDemandes();
      if (result.success && result.data) {
        setDemandes(result.data as Demande[]);
      }
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDemandes();
  }, [loadDemandes]);

  const getStatusConfig = (statut: string) => {
    const configs: Record<
      string,
      { label: string; className: string; icon: React.ReactNode }
    > = {
      EN_ATTENTE: {
        label: "En attente",
        className: "bg-orange-100 text-orange-700",
        icon: <Clock className="w-5 h-5 text-orange-600" />,
      },
      CONFIRMEE: {
        label: "Confirmée",
        className: "bg-blue-100 text-blue-700",
        icon: <CheckCircle2 className="w-5 h-5 text-blue-600" />,
      },
      EN_COURS: {
        label: "En cours",
        className: "bg-purple-100 text-purple-700",
        icon: <Clock className="w-5 h-5 text-purple-600" />,
      },
      TERMINEE: {
        label: "Terminée",
        className: "bg-green-100 text-green-700",
        icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      },
      ANNULEE: {
        label: "Annulée",
        className: "bg-gray-100 text-gray-700",
        icon: <AlertCircle className="w-5 h-5 text-gray-600" />,
      },
    };
    return configs[statut] || configs.EN_ATTENTE;
  };

  const getUrgenceLabel = (urgence: string) => {
    const labels: Record<string, { label: string; className: string }> = {
      FAIBLE: { label: "Faible", className: "text-gray-500" },
      NORMALE: { label: "Normale", className: "text-blue-500" },
      ELEVEE: { label: "Élevée", className: "text-orange-500" },
      URGENTE: { label: "Urgente", className: "text-red-500" },
    };
    return labels[urgence] || labels.NORMALE;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#927950]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-serif text-3xl text-[#1E211E] mb-2">
            Mes demandes
          </h1>
          <p className="text-[#6b6b6b]">Historique de vos demandes de soins</p>
        </div>
        <Link
          href="/demande/soins"
          className="inline-flex items-center gap-2 bg-[#927950] text-white px-5 py-3 rounded-lg hover:bg-[#7a6443] transition-colors w-fit"
        >
          <Plus className="w-5 h-5" />
          Nouvelle demande
        </Link>
      </motion.div>

      {/* Liste des demandes */}
      {demandes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-12 text-center shadow-sm border border-[#d5ccc0]/30"
        >
          <FileText className="w-16 h-16 text-[#d5ccc0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1E211E] mb-2">
            Aucune demande
          </h3>
          <p className="text-[#6b6b6b] mb-6">
            Vous n&apos;avez pas encore fait de demande de soins
          </p>
          <Link
            href="/demande/soins"
            className="inline-flex items-center gap-2 bg-[#927950] text-white px-6 py-3 rounded-lg hover:bg-[#7a6443] transition-colors"
          >
            Faire ma première demande
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande, index) => {
            const status = getStatusConfig(demande.statut);
            const urgence = getUrgenceLabel(demande.urgence);

            return (
              <motion.div
                key={demande.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F9F7F2] flex items-center justify-center shrink-0">
                      {status.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-[#1E211E] text-base sm:text-lg">
                          {demande.typeSoin}
                        </h3>
                        {demande.urgence === "URGENTE" && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm text-[#6b6b6b]">
                        <span>
                          Demande du{" "}
                          {new Date(demande.createdAt).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                        <span className={urgence.className}>
                          Priorité : {urgence.label}
                        </span>
                      </div>
                      {demande.dateRdv && (
                        <p className="mt-2 text-sm">
                          <span className="text-[#6b6b6b]">RDV prévu : </span>
                          <span className="text-[#1E211E] font-medium">
                            {new Date(demande.dateRdv).toLocaleDateString(
                              "fr-FR",
                              {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              }
                            )}
                          </span>
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
    </div>
  );
}
