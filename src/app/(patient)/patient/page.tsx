"use client";

import { getPatientDemandes } from "@/actions/patient";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Types pour les données patient
interface PatientDemande {
  id: string;
  typeSoin: string;
  dateRdv: Date | null;
  heureRdv: string | null;
  statut: string;
  urgence: string;
  createdAt: Date;
}

export default function PatientDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [demandes, setDemandes] = useState<PatientDemande[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  const loadDemandes = useCallback(async () => {
    try {
      const result = await getPatientDemandes();
      if (result.success && result.data) {
        setDemandes(result.data as PatientDemande[]);
      }
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadDemandes();
    }
  }, [session, loadDemandes]);

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#927950]" />
      </div>
    );
  }

  const prochainRdv = demandes.find(
    (d) =>
      d.dateRdv &&
      new Date(d.dateRdv) >= new Date() &&
      d.statut !== "TERMINEE" &&
      d.statut !== "ANNULEE"
  );

  const demandesEnAttente = demandes.filter(
    (d) => d.statut === "EN_ATTENTE"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header de bienvenue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#927950]/10 to-[#927950]/5 rounded-2xl p-8 border border-[#927950]/20"
      >
        <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E] mb-2">
          Bonjour, {session?.user?.name?.split(" ")[0] || "Patient"}
        </h1>
        <p className="text-[#6b6b6b]">
          Bienvenue dans votre espace personnel Harmonie
        </p>
      </motion.div>

      {/* Cartes d&apos;actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prochain RDV */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#927950]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#927950]" />
            </div>
            <h3 className="font-medium text-[#1E211E]">Prochain rendez-vous</h3>
          </div>
          {prochainRdv ? (
            <div>
              <p className="text-lg font-medium text-[#1E211E]">
                {prochainRdv.typeSoin}
              </p>
              <p className="text-sm text-[#6b6b6b] mt-1">
                {new Date(prochainRdv.dateRdv!).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                {prochainRdv.heureRdv && ` à ${prochainRdv.heureRdv}`}
              </p>
            </div>
          ) : (
            <p className="text-[#6b6b6b]">Aucun rendez-vous à venir</p>
          )}
        </motion.div>

        {/* Demandes en attente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-medium text-[#1E211E]">En attente</h3>
          </div>
          <p className="text-3xl font-bold text-[#1E211E]">
            {demandesEnAttente}
          </p>
          <p className="text-sm text-[#6b6b6b]">
            demande(s) en cours de traitement
          </p>
        </motion.div>

        {/* Nouvelle demande */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#927950] rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-medium">Nouvelle demande</h3>
          </div>
          <p className="text-white/80 text-sm mb-4">
            Besoin d&apos;un soin à domicile ?
          </p>
          <Link
            href="/demande/soins"
            className="inline-flex items-center gap-2 bg-white text-[#927950] px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Faire une demande
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Historique récent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-[#1E211E] text-lg">
            Activité récente
          </h3>
          <Link
            href="/patient/rendez-vous"
            className="text-sm text-[#927950] hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {demandes.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-[#d5ccc0] mx-auto mb-4" />
            <p className="text-[#6b6b6b]">Aucune activité récente</p>
            <Link
              href="/demande/soins"
              className="inline-flex items-center gap-2 mt-4 text-[#927950] hover:underline"
            >
              Faire votre première demande
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.slice(0, 5).map((demande) => (
              <div
                key={demande.id}
                className="flex items-center justify-between p-4 bg-[#F9F7F2] rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      demande.statut === "TERMINEE"
                        ? "bg-green-100"
                        : "bg-[#927950]/10"
                    }`}
                  >
                    {demande.statut === "TERMINEE" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Calendar className="w-5 h-5 text-[#927950]" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1E211E]">
                      {demande.typeSoin}
                    </p>
                    <p className="text-sm text-[#6b6b6b]">
                      {demande.dateRdv
                        ? new Date(demande.dateRdv).toLocaleDateString("fr-FR")
                        : "Date à définir"}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    demande.statut === "TERMINEE"
                      ? "bg-green-100 text-green-700"
                      : demande.statut === "CONFIRMEE"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {demande.statut === "EN_ATTENTE"
                    ? "En attente"
                    : demande.statut === "CONFIRMEE"
                    ? "Confirmé"
                    : demande.statut === "TERMINEE"
                    ? "Terminé"
                    : demande.statut}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Informations utiles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-[#927950]" />
            <h3 className="font-medium text-[#1E211E]">Rappels</h3>
          </div>
          <p className="text-sm text-[#6b6b6b]">
            Vous recevrez un SMS de rappel 24h avant chaque rendez-vous.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-[#927950]" />
            <h3 className="font-medium text-[#1E211E]">Ordonnances</h3>
          </div>
          <p className="text-sm text-[#6b6b6b]">
            N&apos;oubliez pas de préparer votre ordonnance pour chaque
            rendez-vous.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
