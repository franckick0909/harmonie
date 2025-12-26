"use client";

import { exportPatientDetailToPDF } from "@/services/exportService";
import { PatientService } from "@/services/patientService";
import type { Demande, Patient } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  History,
  Mail,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react";
import { useMemo } from "react";

interface PatientDetailModalProps {
  patient: Patient | null;
  demandes: Demande[];
  isOpen: boolean;
  onClose: () => void;
  onDemandeClick?: (demande: Demande) => void;
}

export function PatientDetailModal({
  patient,
  demandes,
  isOpen,
  onClose,
  onDemandeClick,
}: PatientDetailModalProps) {
  // Filtrer les demandes du patient
  const patientDemandes = useMemo(() => {
    if (!patient) return [];
    return demandes
      .filter((d) => d.patient.id === patient.id)
      .sort((a, b) => {
        const dateA = a.dateRdv ? new Date(a.dateRdv).getTime() : 0;
        const dateB = b.dateRdv ? new Date(b.dateRdv).getTime() : 0;
        return dateB - dateA;
      });
  }, [patient, demandes]);

  // Statistiques du patient
  const stats = useMemo(() => {
    if (!patient) return null;
    const total = patientDemandes.length;
    const terminees = patientDemandes.filter(
      (d) => d.statut === "TERMINEE"
    ).length;
    const enAttente = patientDemandes.filter(
      (d) => d.statut === "EN_ATTENTE"
    ).length;
    const confirmees = patientDemandes.filter(
      (d) => d.statut === "CONFIRMEE"
    ).length;

    // Prochain RDV
    const now = new Date();
    const prochainRdv = patientDemandes.find(
      (d) =>
        d.dateRdv &&
        new Date(d.dateRdv) >= now &&
        d.statut !== "TERMINEE" &&
        d.statut !== "ANNULEE"
    );

    return {
      total,
      terminees,
      enAttente,
      confirmees,
      prochainRdv,
    };
  }, [patient, patientDemandes]);

  if (!patient) return null;

  const age = PatientService.calculateAge(patient.dateNaissance);

  const getStatusBadge = (statut: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      EN_ATTENTE: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "En attente",
      },
      CONFIRMEE: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Confirmée",
      },
      EN_COURS: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "En cours",
      },
      TERMINEE: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Terminée",
      },
      ANNULEE: { bg: "bg-gray-100", text: "text-gray-700", label: "Annulée" },
    };
    return statusConfig[statut] || statusConfig.EN_ATTENTE;
  };

  const getUrgenceBadge = (urgence: string) => {
    const urgenceConfig: Record<string, { bg: string; text: string }> = {
      FAIBLE: { bg: "bg-gray-100", text: "text-gray-600" },
      NORMALE: { bg: "bg-blue-50", text: "text-blue-600" },
      ELEVEE: { bg: "bg-orange-100", text: "text-orange-600" },
      URGENTE: { bg: "bg-red-100", text: "text-red-600" },
    };
    return urgenceConfig[urgence] || urgenceConfig.NORMALE;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[600]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[700] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#d5ccc0]/30 bg-[#F9F7F2]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#927950]/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-[#927950]">
                    {patient.prenom[0]}
                    {patient.nom[0]}
                  </span>
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-[#1E211E]">
                    {patient.prenom} {patient.nom}
                  </h2>
                  <p className="text-[#6b6b6b] text-sm">
                    {age} ans • Patient depuis{" "}
                    {new Date(patient.createdAt).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-[#927950]/10 rounded-full transition-all group"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-[#6b6b6b] group-hover:text-[#1E211E] transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne gauche - Infos patient */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Statistiques rapides */}
                  <div className="bg-[#F9F7F2] rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-widest">
                      Statistiques
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-[#927950]">
                          {stats?.total || 0}
                        </p>
                        <p className="text-xs text-[#6b6b6b]">Total RDV</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {stats?.terminees || 0}
                        </p>
                        <p className="text-xs text-[#6b6b6b]">Terminés</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {stats?.confirmees || 0}
                        </p>
                        <p className="text-xs text-[#6b6b6b]">Confirmés</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {stats?.enAttente || 0}
                        </p>
                        <p className="text-xs text-[#6b6b6b]">En attente</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-widest">
                      Contact
                    </h3>

                    <a
                      href={`tel:${patient.telephone}`}
                      className="flex items-center gap-3 p-4 bg-[#F9F7F2] rounded-xl hover:bg-[#927950]/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#927950]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b6b6b]">Téléphone</p>
                        <p className="text-[#1E211E] font-medium group-hover:text-[#927950] transition-colors">
                          {patient.telephone}
                        </p>
                      </div>
                    </a>

                    <a
                      href={`mailto:${patient.email}`}
                      className="flex items-center gap-3 p-4 bg-[#F9F7F2] rounded-xl hover:bg-[#927950]/10 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#927950]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b6b6b]">Email</p>
                        <p className="text-[#1E211E] font-medium group-hover:text-[#927950] transition-colors truncate max-w-[200px]">
                          {patient.email}
                        </p>
                      </div>
                    </a>

                    {patient.adresse && (
                      <div className="flex items-start gap-3 p-4 bg-[#F9F7F2] rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-[#927950]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6b6b6b]">Adresse</p>
                          <p className="text-[#1E211E]">
                            {patient.adresse}
                            {patient.complementAdresse && (
                              <>
                                <br />
                                {patient.complementAdresse}
                              </>
                            )}
                            <br />
                            {patient.codePostal} {patient.ville}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-medium text-[#6b6b6b] uppercase tracking-widest">
                      Informations
                    </h3>

                    <div className="flex items-center gap-3 p-4 bg-[#F9F7F2] rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        <User className="w-5 h-5 text-[#927950]" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6b6b6b]">
                          Date de naissance
                        </p>
                        <p className="text-[#1E211E]">
                          {new Date(patient.dateNaissance).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}{" "}
                          ({age} ans)
                        </p>
                      </div>
                    </div>

                    {patient.numeroSecu && (
                      <div className="flex items-center gap-3 p-4 bg-[#F9F7F2] rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#927950]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#6b6b6b]">
                            N° Sécurité Sociale
                          </p>
                          <p className="text-[#1E211E] font-mono text-sm">
                            {patient.numeroSecu}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Historique des RDV */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Prochain RDV */}
                  {stats?.prochainRdv && (
                    <div className="bg-gradient-to-r from-[#927950]/10 to-[#927950]/5 rounded-2xl p-6 border border-[#927950]/20">
                      <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[#927950]" />
                        <h3 className="text-sm font-medium text-[#927950] uppercase tracking-widest">
                          Prochain rendez-vous
                        </h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-serif text-[#1E211E]">
                            {stats.prochainRdv.typeSoin}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[#6b6b6b]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(
                                stats.prochainRdv.dateRdv!
                              ).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                            {stats.prochainRdv.heureRdv && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {stats.prochainRdv.heureRdv}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onDemandeClick?.(stats.prochainRdv!)}
                          className="px-4 py-2 bg-[#927950] text-white rounded-lg hover:bg-[#7a6443] transition-colors text-sm"
                        >
                          Voir détails
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Historique */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-[#6b6b6b]" />
                      <h3 className="text-sm font-medium text-[#6b6b6b] uppercase tracking-widest">
                        Historique des rendez-vous ({patientDemandes.length})
                      </h3>
                    </div>

                    {patientDemandes.length === 0 ? (
                      <div className="text-center py-12 bg-[#F9F7F2] rounded-2xl">
                        <AlertCircle className="w-12 h-12 text-[#d5ccc0] mx-auto mb-4" />
                        <p className="text-[#6b6b6b]">
                          Aucun rendez-vous enregistré
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {patientDemandes.map((demande) => {
                          const status = getStatusBadge(demande.statut);
                          const urgence = getUrgenceBadge(demande.urgence);

                          return (
                            <motion.button
                              key={demande.id}
                              onClick={() => onDemandeClick?.(demande)}
                              className="w-full text-left p-4 bg-[#F9F7F2] rounded-xl hover:bg-[#927950]/10 transition-all group"
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium text-[#1E211E] group-hover:text-[#927950] transition-colors">
                                      {demande.typeSoin}
                                    </p>
                                    {demande.urgence === "URGENTE" && (
                                      <span
                                        className={`px-2 py-0.5 rounded-full text-xs ${urgence.bg} ${urgence.text}`}
                                      >
                                        Urgent
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-[#6b6b6b]">
                                    {demande.dateRdv ? (
                                      <>
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3.5 h-3.5" />
                                          {new Date(
                                            demande.dateRdv
                                          ).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                          })}
                                        </span>
                                        {demande.heureRdv && (
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {demande.heureRdv}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-orange-600">
                                        Date à définir
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}
                                  >
                                    {status.label}
                                  </span>
                                  {demande.statut === "TERMINEE" && (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                              {demande.notes && (
                                <p className="mt-2 text-sm text-[#6b6b6b] truncate">
                                  {demande.notes}
                                </p>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-[#F9F7F2] border-t border-[#d5ccc0]/30 flex items-center justify-between">
              <p className="text-sm text-[#6b6b6b]">
                Dernière mise à jour :{" "}
                {new Date(patient.updatedAt).toLocaleDateString("fr-FR")}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => exportPatientDetailToPDF(patient, demandes)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#d5ccc0] text-[#1E211E] rounded-lg hover:bg-[#F4E6CD] transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Fiche PDF
                </button>
                <a
                  href={`tel:${patient.telephone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#927950] text-white rounded-lg hover:bg-[#7a6443] transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Appeler
                </a>
                <a
                  href={`mailto:${patient.email}`}
                  className="flex items-center gap-2 px-4 py-2 border border-[#927950] text-[#927950] rounded-lg hover:bg-[#927950]/10 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
