"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import type { DashboardStats } from "@/types/demande";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  ChevronRight,
  Crown,
  Home,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

// Fonction pour obtenir le numéro de semaine
function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + start.getDay() + 1) / 7);
}

// Fonction pour obtenir les dates de la semaine (lundi à dimanche)
function getWeekDates(date: Date): string {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Lundi = 1, Dimanche = 0
  startOfWeek.setDate(startOfWeek.getDate() + diff);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startStr = startOfWeek.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
  const endStr = endOfWeek.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });

  return `${startStr} - ${endStr}`;
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats?: Partial<DashboardStats>;
  isMobile?: boolean;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  stats,
  isMobile = false,
}: DashboardSidebarProps) {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  const { isDesktop } = useBreakpoint();

  const menuItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <Home className="w-5 h-5" strokeWidth={1.2} />,
      description: "Tableau de bord principal",
    },
    {
      id: "patients",
      label: "Patients",
      icon: <Users className="w-5 h-5" strokeWidth={1.2} />,
      description: "Gestion des patients",
      badge: stats?.patientsAujourdhui,
    },
    {
      id: "planning",
      label: "Planning",
      icon: <Calendar className="w-5 h-5" strokeWidth={1.2} />,
      description: "Vue calendrier",
      badge: stats?.patientsCetteSemaine,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-5 h-5" strokeWidth={1.2} />,
      description: "Rappels et alertes",
      badge: stats?.patientsCeMois,
    },
  ];

  const quickStats = [
    {
      label: `Aujourd'hui (${new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })})`,
      value: stats?.patientsAujourdhui || 0,
      icon: <Users className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-blue-600",
    },
    {
      label: `Semaine S.${getWeekNumber(new Date())} (${getWeekDates(
        new Date()
      )})`,
      value: stats?.patientsCetteSemaine || 0,
      icon: <Calendar className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-indigo-600",
    },
    {
      label: `${new Date().toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      })}`,
      value: stats?.patientsCeMois || 0,
      icon: <TrendingUp className="w-4 h-4" strokeWidth={1.2} />,
      color: "text-purple-600",
    },
  ];

  // Sur mobile (menu slide), toujours étendu
  // Sur tablette (< lg), collapsed
  // Sur desktop (>= lg), dépend de isCollapsed
  const effectiveCollapsed = isMobile ? false : !isDesktop || isCollapsed;

  return (
    <motion.div
      animate={{
        width: isMobile ? 280 : effectiveCollapsed ? 64 : 320,
      }}
      transition={{
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="bg-[#1E211E] text-[#F4E6CD] backdrop-blur-md border-r border-[#F4E6CD]/10 flex flex-col h-screen sticky top-0 z-40"
    >
      {/* Header */}
      <div className="p-4 border-b border-[#F4E6CD]/10 bg-[#1E211E]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {!effectiveCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.4,
                      delay: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: {
                      duration: 0.3,
                      delay: 0,
                      ease: [0.4, 0, 1, 1],
                    },
                  }}
                >
                  <Link
                    href="/"
                    className="text-primary text-lg tracking-wider truncate hover:text-[#1E211E] transition-colors duration-200 uppercase"
                  >
                    <span className="hidden sm:inline font-cormorant-garamond font-bold text-2xl tracking-tight">
                      Cabinet Harmonie
                    </span>
                    <span className="sm:hidden font-cormorant-garamond font-bold">
                      Harmonie
                    </span>
                  </Link>

                  <p className="text-xs text-[#F4E6CD]/60 font-light tracking-widest uppercase mt-1">
                    Dashboard
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bouton toggle - visible uniquement sur desktop */}
          {isDesktop && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label={
                  effectiveCollapsed ? "Étendre le menu" : "Réduire le menu"
                }
                className="h-10 w-10 p-0 rounded-md hover:bg-[#F4E6CD]/10 transition-colors flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <motion.div
                  animate={{ rotate: effectiveCollapsed ? 0 : 180 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  <ChevronRight
                    className="w-5 h-5 pointer-events-none text-[#F4E6CD]/70"
                    strokeWidth={2}
                  />
                </motion.div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <motion.div
          className="space-y-2"
          initial={false}
          animate={effectiveCollapsed ? "collapsed" : "expanded"}
        >
          {menuItems.map((item, index) => {
            const isActive = activeTab === item.id;

            return (
              <motion.div
                key={item.id}
                variants={{
                  collapsed: {
                    opacity: 1,
                    transition: {
                      duration: 0.3,
                      delay: 0,
                      ease: [0.4, 0, 1, 1],
                    },
                  },
                  expanded: {
                    opacity: 1,
                    transition: {
                      duration: 0.4,
                      delay: 0.3 + index * 0.05,
                      ease: [0.4, 0, 0.2, 1],
                    },
                  },
                }}
              >
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full h-[50px] px-2 ${
                    effectiveCollapsed ? "justify-center px-0" : "justify-start"
                  } rounded-xl flex items-center transition-all duration-200 ${
                    isActive
                      ? "bg-[#F4E6CD] text-[#1E211E] shadow-md"
                      : "hover:bg-[#F4E6CD]/10 text-[#F4E6CD]/80"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      effectiveCollapsed ? "justify-center" : "gap-3"
                    } w-full`}
                  >
                    <motion.div
                      animate={{
                        scale: effectiveCollapsed ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center shrink-0"
                    >
                      {item.icon}
                    </motion.div>
                    <AnimatePresence mode="wait">
                      {!effectiveCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: {
                              duration: 0.4,
                              delay: 0.35 + index * 0.03,
                              ease: [0.4, 0, 0.2, 1],
                            },
                          }}
                          exit={{
                            opacity: 0,
                            x: -10,
                            transition: {
                              duration: 0.1,
                              delay: 0,
                              ease: [0.4, 0, 1, 1],
                            },
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="font-medium text-sm md:text-[15px]">
                            {item.label}
                          </div>
                          <div className="text-xs md:text-[13px] opacity-60 font-light">
                            {item.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </nav>

      {/* Lien Administration */}
      <div className="p-2 border-t border-[#F4E6CD]/10">
        <Link
          href="/dashboard/admin"
          className={`w-full h-[50px] px-2 ${
            effectiveCollapsed ? "justify-center px-0" : "justify-start"
          } rounded-xl flex items-center transition-all duration-200 hover:bg-[#F4E6CD]/10 text-[#F4E6CD]/80`}
        >
          <div
            className={`flex items-center ${
              effectiveCollapsed ? "justify-center" : "gap-3"
            } w-full`}
          >
            <Crown className="w-5 h-5" strokeWidth={1.2} />
            {!effectiveCollapsed && (
              <div className="flex-1 text-left">
                <div className="font-medium text-sm md:text-[15px]">
                  Administration
                </div>
                <div className="text-xs md:text-[13px] opacity-60 font-light">
                  Gestion des utilisateurs
                </div>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <AnimatePresence>
        {!effectiveCollapsed && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                delay: 0.5,
                ease: [0.4, 0, 0.2, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
              transition: {
                duration: 0.3,
                delay: 0,
                ease: [0.4, 0, 1, 1],
              },
            }}
            className="p-4 border-t border-[#F4E6CD]/10 bg-[#1E211E]"
          >
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="text-sm font-semibold text-[#F4E6CD] mb-3 uppercase tracking-wide"
            >
              Statistiques rapides
            </motion.h3>
            <div className="space-y-2">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + index * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-[#F4E6CD]/10 transition-colors duration-200 cursor-default"
                >
                  <motion.div
                    className={`${stat.color} flex items-center justify-center shrink-0`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <span className="text-[#F4E6CD]/70 flex-1">{stat.label}</span>
                  <motion.span
                    className={`font-medium ${stat.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0.65 + index * 0.05,
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    {stat.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
