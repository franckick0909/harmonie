"use client";

import { Button } from "@/components/ui/Button";
import type { Demande } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import { useMemo, useState } from "react";

interface NotificationsPanelProps {
  demandes: Demande[];
  onSendNotification: (demandeId: string, type: "sms" | "email") => void;
}

type NotificationType = "all" | "pending" | "urgent" | "today";

export function NotificationsPanel({
  demandes,
  onSendNotification,
}: NotificationsPanelProps) {
  const [filter, setFilter] = useState<NotificationType>("all");
  const [sentNotifications, setSentNotifications] = useState<Set<string>>(
    new Set()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  // Filtrer les demandes selon le type
  const filteredDemandes = useMemo(() => {
    switch (filter) {
      case "pending":
        return demandes.filter((d) => d.statut === "EN_ATTENTE");
      case "urgent":
        return demandes.filter(
          (d) => d.urgence === "ELEVEE" || d.urgence === "URGENTE"
        );
      case "today":
        return demandes.filter((d) => {
          if (!d.dateRdv) return false;
          const date = new Date(d.dateRdv);
          return date >= today && date <= todayEnd;
        });
      default:
        return demandes;
    }
  }, [demandes, filter]);

  const handleSendNotification = (demandeId: string, type: "sms" | "email") => {
    onSendNotification(demandeId, type);
    setSentNotifications((prev) => new Set(prev).add(`${demandeId}-${type}`));
  };

  const isNotificationSent = (demandeId: string, type: "sms" | "email") => {
    return sentNotifications.has(`${demandeId}-${type}`);
  };

  const filterButtons: {
    id: NotificationType;
    label: string;
    count: number;
  }[] = [
    { id: "all", label: "Toutes", count: demandes.length },
    {
      id: "pending",
      label: "En attente",
      count: demandes.filter((d) => d.statut === "EN_ATTENTE").length,
    },
    {
      id: "urgent",
      label: "Urgentes",
      count: demandes.filter(
        (d) => d.urgence === "ELEVEE" || d.urgence === "URGENTE"
      ).length,
    },
    {
      id: "today",
      label: "Aujourd'hui",
      count: demandes.filter((d) => {
        if (!d.dateRdv) return false;
        const date = new Date(d.dateRdv);
        return date >= today && date <= todayEnd;
      }).length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E] mb-2">
            Notifications
          </h1>
          <p className="text-base text-[#6b6b6b]">
            Gérez les rappels et notifications pour vos patients
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 md:gap-3">
        {filterButtons.map((btn) => (
          <motion.button
            key={btn.id}
            type="button"
            onClick={() => setFilter(btn.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              filter === btn.id
                ? "bg-[#927950] text-white shadow-md"
                : "bg-white text-[#6b6b6b] hover:text-[#1E211E] hover:bg-[#F4E6CD]/50 border border-[#d5ccc0]/30"
            }`}
          >
            {btn.label}
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                filter === btn.id
                  ? "bg-white/20 text-white"
                  : "bg-[#927950]/10 text-[#927950]"
              }`}
            >
              {btn.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredDemandes.map((demande, index) => (
            <motion.div
              key={demande.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#d5ccc0]/30 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Patient Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[#927950]/10 flex items-center justify-center shadow-sm shrink-0">
                    <span className="text-lg font-bold text-[#927950]">
                      {demande.patient.prenom[0]}
                      {demande.patient.nom[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1E211E] truncate">
                        {demande.patient.prenom} {demande.patient.nom}
                      </p>
                      {(demande.urgence === "ELEVEE" ||
                        demande.urgence === "URGENTE") && (
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#6b6b6b] mt-0.5 truncate">
                      {demande.typeSoin}
                    </p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="flex items-center gap-4 md:gap-6 text-sm shrink-0">
                  {demande.dateRdv && (
                    <div className="flex items-center gap-2 text-[#6b6b6b] px-3 py-1.5 bg-[#F4E6CD]/50 rounded-lg">
                      <Calendar className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">
                        {new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                  {demande.heureRdv && (
                    <div className="flex items-center gap-2 text-[#6b6b6b] px-3 py-1.5 bg-[#F4E6CD]/50 rounded-lg">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span className="whitespace-nowrap">
                        {demande.heureRdv}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <NotificationButton
                    type="email"
                    icon={Mail}
                    label="Email"
                    isSent={isNotificationSent(demande.id, "email")}
                    onClick={() => handleSendNotification(demande.id, "email")}
                    disabled={!demande.patient.email}
                  />
                  <NotificationButton
                    type="sms"
                    icon={Phone}
                    label="SMS"
                    isSent={isNotificationSent(demande.id, "sms")}
                    onClick={() => handleSendNotification(demande.id, "sms")}
                    disabled={!demande.patient.telephone}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-[#d5ccc0]/50 flex flex-wrap gap-4 text-sm">
                {demande.patient.email && (
                  <div className="flex items-center gap-2 text-[#6b6b6b]">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{demande.patient.email}</span>
                  </div>
                )}
                {demande.patient.telephone && (
                  <div className="flex items-center gap-2 text-[#6b6b6b]">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{demande.patient.telephone}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredDemandes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-[#d5ccc0]/30 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F4E6CD] flex items-center justify-center">
              <Bell className="w-8 h-8 text-[#927950] opacity-60" />
            </div>
            <p className="font-medium text-[#1E211E] mb-1">
              Aucune notification à afficher
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">
              {filter === "all"
                ? "Toutes les notifications sont à jour"
                : "Aucune notification correspondant à ce filtre"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#d5ccc0]/30">
        <h2 className="font-serif text-xl md:text-2xl text-[#1E211E] mb-6">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <QuickActionCard
            icon={Mail}
            title="Rappel général"
            description="Envoyer un rappel à tous les patients du jour"
            onClick={() => console.log("Rappel général")}
          />
          <QuickActionCard
            icon={AlertCircle}
            title="Alertes urgentes"
            description="Contacter les patients avec RDV urgents"
            onClick={() => console.log("Alertes urgentes")}
          />
          <QuickActionCard
            icon={CheckCircle}
            title="Confirmations"
            description="Demander confirmation aux patients en attente"
            onClick={() => console.log("Confirmations")}
          />
        </div>
      </div>
    </div>
  );
}

interface NotificationButtonProps {
  type: "email" | "sms";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isSent: boolean;
  onClick: () => void;
  disabled: boolean;
}

function NotificationButton({
  type,
  icon: Icon,
  label,
  isSent,
  onClick,
  disabled,
}: NotificationButtonProps) {
  if (isSent) {
    return (
      <Button variant="success" size="sm" disabled className="cursor-default">
        <CheckCircle className="w-4 h-4" />
        <span>Envoyé</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="bg-[#927950]/10 text-[#927950] hover:bg-[#927950] hover:text-white border-[#927950]/30 shadow-sm hover:shadow-md transition-all"
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Button>
  );
}

interface QuickActionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionCard({
  icon: Icon,
  title,
  description,
  onClick,
}: QuickActionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="p-5 bg-[#F4E6CD]/50 rounded-xl text-left hover:shadow-md transition-all duration-200 group border border-[#d5ccc0]/30 hover:border-[#927950]/30"
    >
      <div className="w-12 h-12 rounded-xl bg-[#927950]/10 flex items-center justify-center mb-4 group-hover:bg-[#927950] group-hover:text-white transition-colors shadow-sm">
        <Icon className="w-6 h-6 text-[#927950] group-hover:text-white" />
      </div>
      <p className="font-semibold text-[#1E211E] mb-2">{title}</p>
      <p className="text-sm text-[#6b6b6b] leading-relaxed">{description}</p>
    </motion.button>
  );
}
