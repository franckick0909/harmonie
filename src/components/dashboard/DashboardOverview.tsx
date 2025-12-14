"use client";

import type { DashboardStats, Demande } from "@/types/demande";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Clock4,
  TrendingUp,
  Users,
} from "lucide-react";

interface DashboardOverviewProps {
  demandes: Demande[];
  stats: DashboardStats;
}

export function DashboardOverview({ demandes, stats }: DashboardOverviewProps) {
  // RDV du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const todayAppointments = demandes.filter((d) => {
    if (!d.dateRdv) return false;
    const date = new Date(d.dateRdv);
    return date >= today && date <= todayEnd;
  });

  const pendingAppointments = demandes.filter((d) => d.statut === "EN_ATTENTE");
  const urgentAppointments = demandes.filter(
    (d) => d.urgence === "ELEVEE" || d.urgence === "URGENTE"
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E] mb-2">
          Vue d&apos;ensemble
        </h1>
        <p className="text-base text-[#6b6b6b]">
          Bienvenue dans votre espace de gestion du cabinet
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={Users}
          label="Patients total"
          value={stats.totalPatients}
          color="accent"
        />
        <StatCard
          icon={Calendar}
          label="RDV aujourd'hui"
          value={stats.rdvAujourdhui}
          color="blue"
        />
        <StatCard
          icon={Clock}
          label="En attente"
          value={stats.soinsEnAttente}
          color="orange"
        />
        <StatCard
          icon={AlertCircle}
          label="Urgents"
          value={stats.patientsUrgents}
          color="red"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#d5ccc0]/30 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl md:text-2xl text-[#1E211E]">
              Rendez-vous du jour
            </h2>
            <span className="px-3 py-1.5 bg-[#927950]/10 text-[#927950] rounded-full text-sm font-semibold">
              {todayAppointments.length} RDV
            </span>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((demande) => (
                <AppointmentItem key={demande.id} demande={demande} />
              ))}
              {todayAppointments.length > 5 && (
                <p className="text-sm text-[#6b6b6b] text-center pt-2 font-medium">
                  + {todayAppointments.length - 5} autres rendez-vous
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#6b6b6b]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F4E6CD] flex items-center justify-center">
                <Calendar className="w-8 h-8 text-[#927950] opacity-60" />
              </div>
              <p className="font-medium">Aucun rendez-vous aujourd&apos;hui</p>
              <p className="text-sm mt-1 opacity-75">
                Profitez de votre journée !
              </p>
            </div>
          )}
        </div>

        {/* Pending & Urgent */}
        <div className="space-y-6">
          {/* Pending */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#d5ccc0]/30 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg md:text-xl text-[#1E211E]">
                En attente de confirmation
              </h2>
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock4 className="w-5 h-5 text-orange-600" />
              </div>
            </div>

            {pendingAppointments.length > 0 ? (
              <div className="space-y-3">
                {pendingAppointments.slice(0, 3).map((demande) => (
                  <motion.div
                    key={demande.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-[#F4E6CD]/50 rounded-lg border border-orange-200/50 hover:bg-[#F4E6CD] transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1E211E] truncate">
                        {demande.patient.prenom} {demande.patient.nom}
                      </p>
                      <p className="text-xs text-[#6b6b6b] mt-0.5 truncate">
                        {demande.typeSoin}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full font-semibold ml-3 shrink-0">
                      En attente
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#6b6b6b]">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Tout est à jour !</p>
                <p className="text-xs mt-1 opacity-75">
                  Aucune demande en attente
                </p>
              </div>
            )}
          </div>

          {/* Urgent */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#d5ccc0]/30 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg md:text-xl text-[#1E211E]">
                Urgences
              </h2>
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>

            {urgentAppointments.length > 0 ? (
              <div className="space-y-3">
                {urgentAppointments.slice(0, 3).map((demande) => (
                  <motion.div
                    key={demande.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-red-50/50 rounded-lg border-l-4 border-red-500 hover:bg-red-50 transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1E211E] truncate">
                        {demande.patient.prenom} {demande.patient.nom}
                      </p>
                      <p className="text-xs text-[#6b6b6b] mt-0.5 truncate">
                        {demande.typeSoin}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full font-semibold ml-3 shrink-0">
                      {demande.urgence}
                    </span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#6b6b6b]">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium">Aucune urgence</p>
                <p className="text-xs mt-1 opacity-75">
                  Tout est sous contrôle
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-[#d5ccc0]/30">
        <h2 className="font-serif text-xl md:text-2xl text-[#1E211E] mb-6">
          Activité récente
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <MiniStat
            icon={TrendingUp}
            label="Cette semaine"
            value={stats.rdvSemaine}
          />
          <MiniStat icon={Activity} label="Ce mois" value={stats.rdvMois} />
          <MiniStat
            icon={CheckCircle2}
            label="Terminés"
            value={stats.soinsTermines}
          />
          <MiniStat
            icon={Users}
            label="Nouveaux patients"
            value={stats.nouveauxCeMois}
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: "accent" | "blue" | "orange" | "red";
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    accent: "bg-[#927950]/10 text-[#927950]",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#d5ccc0]/30 hover:shadow-md transition-all duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 shadow-sm`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-[#1E211E] mb-1">
        {value}
      </p>
      <p className="text-sm md:text-base text-[#6b6b6b] font-medium">{label}</p>
    </motion.div>
  );
}

interface MiniStatProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}

function MiniStat({ icon: Icon, label, value }: MiniStatProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="text-center p-4 rounded-lg bg-[#F4E6CD]/30 hover:bg-[#F4E6CD]/50 transition-colors duration-200"
    >
      <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-[#927950]/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#927950]" />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-[#1E211E] mb-1">
        {value}
      </p>
      <p className="text-xs md:text-sm text-[#6b6b6b] font-medium">{label}</p>
    </motion.div>
  );
}

interface AppointmentItemProps {
  demande: Demande;
}

function AppointmentItem({ demande }: AppointmentItemProps) {
  const statusColors = {
    EN_ATTENTE: "bg-orange-100 text-orange-700 border-orange-200",
    CONFIRMEE: "bg-blue-100 text-blue-700 border-blue-200",
    EN_COURS: "bg-purple-100 text-purple-700 border-purple-200",
    TERMINEE: "bg-green-100 text-green-700 border-green-200",
    ANNULEE: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 p-4 bg-[#F4E6CD]/50 rounded-lg border border-[#d5ccc0]/30 hover:bg-[#F4E6CD] hover:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <div className="shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#927950]/10 flex items-center justify-center shadow-sm">
          <span className="text-sm font-bold text-[#927950]">
            {demande.patient.prenom[0]}
            {demande.patient.nom[0]}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[#1E211E] truncate">
          {demande.patient.prenom} {demande.patient.nom}
        </p>
        <p className="text-sm text-[#6b6b6b] truncate mt-0.5">
          {demande.typeSoin}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#1E211E] mb-1.5">
          {demande.heureRdv || "—"}
        </p>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
            statusColors[demande.statut]
          }`}
        >
          {demande.statut.replace("_", " ")}
        </span>
      </div>
    </motion.div>
  );
}
