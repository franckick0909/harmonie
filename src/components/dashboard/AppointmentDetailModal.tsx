"use client";

import { deleteDemande, updateDemandeStatut } from "@/actions/dashboard";
import { Button } from "@/components/ui/Button";
import type { Demande } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  FileText,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

interface AppointmentDetailModalProps {
  demande: Demande | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function AppointmentDetailModal({
  demande,
  isOpen,
  onClose,
  onUpdate,
}: AppointmentDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!demande) return null;

  const statusColors: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    EN_ATTENTE: {
      bg: "bg-orange-100",
      text: "text-orange-600",
      label: "En attente",
    },
    CONFIRMEE: { bg: "bg-blue-100", text: "text-blue-600", label: "Confirmée" },
    EN_COURS: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      label: "En cours",
    },
    TERMINEE: { bg: "bg-green-100", text: "text-green-600", label: "Terminée" },
    ANNULEE: { bg: "bg-gray-100", text: "text-gray-600", label: "Annulée" },
  };

  const handleStatusChange = async (newStatus: Demande["statut"]) => {
    setIsUpdating(true);
    try {
      await updateDemandeStatut(demande.id, newStatus);
      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;

    setIsDeleting(true);
    try {
      await deleteDemande(demande.id);
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
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
            className="fixed inset-0 sm:inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white sm:rounded-3xl shadow-2xl z-[700] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start sm:items-center justify-between px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0 flex-1">
                <h2 className="font-serif text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight font-normal truncate">
                  {demande.patient.prenom} {demande.patient.nom}
                </h2>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {demande.urgence === "URGENTE" && (
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-50 text-red-600 rounded-full text-[9px] sm:text-[10px] font-medium tracking-widest uppercase border border-red-100">
                      Urgente
                    </span>
                  )}
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] sm:text-[10px] font-medium tracking-widest uppercase border border-blue-100">
                    {demande.statut}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-50 rounded-full transition-all group shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-180" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-10">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (demande.patient.telephone) {
                      window.location.href = `tel:${demande.patient.telephone}`;
                    }
                  }}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>APPELER</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (demande.patient.email) {
                      window.location.href = `mailto:${demande.patient.email}`;
                    }
                  }}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>EMAIL</span>
                </Button>
              </div>

              <div className="space-y-6 sm:space-y-8">
                {/* Patient Info Block */}
                <div>
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                    Informations Patient
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InfoItem
                      label="Email"
                      value={demande.patient.email}
                      icon={Mail}
                    />
                    <InfoItem
                      label="Téléphone"
                      value={demande.patient.telephone}
                      icon={Phone}
                    />
                    {demande.patient.adresse && (
                      <div className="sm:col-span-2">
                        <InfoItem
                          label="Adresse"
                          value={`${demande.patient.adresse}, ${
                            demande.patient.ville || ""
                          }`}
                          icon={MapPin}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px w-full bg-gray-100" />

                {/* Appointment Info Block */}
                <div>
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
                    Détails du Rendez-vous
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InfoItem
                      label="Date"
                      value={
                        demande.dateRdv
                          ? new Date(demande.dateRdv).toLocaleDateString(
                              "fr-FR",
                              { weekday: "long", day: "numeric", month: "long" }
                            )
                          : "Non défini"
                      }
                      icon={Calendar}
                    />
                    <InfoItem
                      label="Heure"
                      value={demande.heureRdv || "Non définie"}
                      icon={Clock}
                    />
                    <div className="sm:col-span-2">
                      <InfoItem
                        label="Type de soin"
                        value={demande.typeSoin}
                        icon={FileText}
                      />
                    </div>
                  </div>
                </div>

                {demande.notes && (
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed font-normal">
                      {demande.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-4 sm:px-8 py-4 sm:py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                size="sm"
                className="order-2 sm:order-1 text-xs sm:text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Archiver</span>
              </Button>

              <div className="flex flex-wrap gap-2 order-1 sm:order-2">
                {(["EN_ATTENTE", "CONFIRMEE", "TERMINEE"] as const).map(
                  (status) =>
                    status !== demande.statut && (
                      <Button
                        key={status}
                        variant="outline"
                        onClick={() => handleStatusChange(status)}
                        disabled={isUpdating}
                        size="sm"
                        className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">Marquer</span> {statusColors[status].label}
                      </Button>
                    )
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-sm sm:text-base font-normal text-gray-900 break-words">{value}</p>
      </div>
    </div>
  );
}
