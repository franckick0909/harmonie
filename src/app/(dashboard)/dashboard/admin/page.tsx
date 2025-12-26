"use client";

import { getAllUsers, updateUserRole } from "@/actions/users";
import Header from "@/components/layout/Header";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Crown,
  Loader2,
  Mail,
  Search,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "NURSE" | "PATIENT";
  createdAt: Date;
  emailVerified: boolean;
  patientId: string | null;
}

type RoleFilter = "all" | "ADMIN" | "NURSE" | "PATIENT";

const ROLE_CONFIG = {
  ADMIN: {
    label: "Administrateur",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: Crown,
  },
  NURSE: {
    label: "Infirmier(e)",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Shield,
  },
  PATIENT: {
    label: "Patient",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: User,
  },
};

export default function AdminUsersPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    if (!isPending && session?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const role = (session.user as any).role;
      if (role !== "ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [session, isPending, router]);

  const loadUsers = useCallback(async () => {
    try {
      const result = await getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data as UserData[]);
      } else {
        setError(result.error || "Erreur lors du chargement des utilisateurs");
      }
    } catch (err) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (
    userId: string,
    newRole: "ADMIN" | "NURSE" | "PATIENT"
  ) => {
    if (userId === session?.user?.id) {
      setError("Vous ne pouvez pas modifier votre propre rôle");
      return;
    }

    setUpdatingUserId(userId);
    setError(null);
    setOpenDropdownId(null);

    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setSuccess(`Rôle mis à jour avec succès`);
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Erreur lors de la mise à jour du rôle");
      }
    } catch (err) {
      setError("Erreur serveur");
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    nurses: users.filter((u) => u.role === "NURSE").length,
    patients: users.filter((u) => u.role === "PATIENT").length,
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#927950]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
        <Header />
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-[#1E211E] mb-2">
            Gestion des utilisateurs
          </h1>
          <p className="text-base text-[#6b6b6b]">
            {stats.total} utilisateur{stats.total > 1 ? "s" : ""} enregistré
            {stats.total > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#d5ccc0]/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#927950]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#927950]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1E211E]">{stats.total}</p>
              <p className="text-xs text-[#6b6b6b]">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#d5ccc0]/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1E211E]">
                {stats.admins}
              </p>
              <p className="text-xs text-[#6b6b6b]">Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#d5ccc0]/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1E211E]">
                {stats.nurses}
              </p>
              <p className="text-xs text-[#6b6b6b]">Infirmiers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#d5ccc0]/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1E211E]">
                {stats.patients}
              </p>
              <p className="text-xs text-[#6b6b6b]">Patients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b6b6b]" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-[#d5ccc0]/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#927950] focus:border-[#927950] transition-all"
          />
        </div>

        {/* Role Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "all", label: "Tous" },
            { id: "ADMIN", label: "Admins" },
            { id: "NURSE", label: "Infirmiers" },
            { id: "PATIENT", label: "Patients" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setRoleFilter(filter.id as RoleFilter)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                roleFilter === filter.id
                  ? "bg-[#927950] text-white"
                  : "bg-white border border-[#d5ccc0]/50 text-[#6b6b6b] hover:border-[#927950]/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#d5ccc0]/30 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-[#F4E6CD]/50 border-b border-[#d5ccc0]/50 text-sm font-semibold text-[#1E211E]">
          <div className="col-span-4">Utilisateur</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Rôle</div>
          <div className="col-span-2">Inscrit le</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Table Body */}
        {filteredUsers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-[#d5ccc0] mx-auto mb-4" />
            <p className="text-[#6b6b6b]">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-[#d5ccc0]/30">
            {filteredUsers.map((user) => {
              const roleConfig = ROLE_CONFIG[user.role];
              const RoleIcon = roleConfig.icon;
              const isCurrentUser = user.id === session?.user?.id;

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-[#F9F7F2]/50 transition-colors ${
                    isCurrentUser ? "bg-[#927950]/5" : ""
                  }`}
                >
                  {/* User */}
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#927950] flex items-center justify-center text-white font-medium">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-[#1E211E] flex items-center gap-2">
                        {user.name || "Sans nom"}
                        {isCurrentUser && (
                          <span className="text-xs bg-[#927950]/10 text-[#927950] px-2 py-0.5 rounded-full">
                            Vous
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#6b6b6b] md:hidden">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="hidden md:flex md:col-span-3 items-center gap-2 text-sm text-[#6b6b6b]">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>

                  {/* Role Badge */}
                  <div className="md:col-span-2 flex items-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleConfig.color}`}
                    >
                      <RoleIcon className="w-3.5 h-3.5" />
                      {roleConfig.label}
                    </span>
                  </div>

                  {/* Created At */}
                  <div className="hidden md:flex md:col-span-2 items-center text-sm text-[#6b6b6b]">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex items-center justify-end relative">
                    {!isCurrentUser && (
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === user.id ? null : user.id
                            )
                          }
                          disabled={updatingUserId === user.id}
                          className="p-2 hover:bg-[#F4E6CD] rounded-lg transition-colors disabled:opacity-50"
                        >
                          {updatingUserId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#927950]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#6b6b6b]" />
                          )}
                        </button>

                        <AnimatePresence>
                          {openDropdownId === user.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#d5ccc0]/30 z-50 overflow-hidden"
                              >
                                <div className="py-1">
                                  <p className="px-4 py-2 text-xs text-[#6b6b6b] uppercase tracking-wider">
                                    Changer le rôle
                                  </p>
                                  {(["ADMIN", "NURSE", "PATIENT"] as const).map(
                                    (role) => {
                                      const config = ROLE_CONFIG[role];
                                      const Icon = config.icon;
                                      return (
                                        <button
                                          key={role}
                                          onClick={() =>
                                            handleRoleChange(user.id, role)
                                          }
                                          disabled={user.role === role}
                                          className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                                            user.role === role
                                              ? "bg-[#F4E6CD] cursor-default"
                                              : "hover:bg-[#F9F7F2]"
                                          }`}
                                        >
                                          <Icon className="w-4 h-4" />
                                          {config.label}
                                          {user.role === role && (
                                            <CheckCircle2 className="w-4 h-4 ml-auto text-green-600" />
                                          )}
                                        </button>
                                      );
                                    }
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
