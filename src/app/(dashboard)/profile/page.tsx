"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, User, Mail, Phone, Lock, CheckCircle, Edit2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
    const { data: session, isPending } = authClient.useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const { error } = await authClient.updateUser({
                name,
            });

            if (error) {
                setError(error.message || "Erreur lors de la mise à jour");
                return;
            }

            setSuccess("Profil mis à jour avec succès !");
            setIsEditing(false);
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
                {/* Back link */}
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-xs uppercase tracking-[0.2em] font-medium mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Retour au tableau de bord
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">
                            Mon Profil
                        </h1>
                        <p className="text-[var(--muted)] text-sm">
                            Gérez vos informations personnelles
                        </p>
                    </div>

                    {/* Success message */}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-6 flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" />
                            {success}
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Profile Card */}
                    <div className="bg-[var(--beige-dark)] p-8">
                        {/* Avatar section */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[var(--border)]">
                            <div className="w-20 h-20 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--background)] text-2xl font-serif">
                                {session?.user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                                <h2 className="text-xl font-medium text-[var(--foreground)]">
                                    {session?.user?.name || "Utilisateur"}
                                </h2>
                                <p className="text-[var(--muted)] text-sm">
                                    {session?.user?.email}
                                </p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="ml-auto p-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
                                        <User className="w-4 h-4" />
                                        Nom complet
                                    </label>
                                    <Input
                                        className="w-full bg-transparent border border-[var(--border)] rounded-none px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted-light)] focus:border-[var(--accent)] transition-colors focus:ring-0"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-none px-4 py-3 text-[var(--muted)] cursor-not-allowed"
                                        value={email}
                                        disabled
                                    />
                                    <p className="text-xs text-[var(--muted-light)]">
                                        L&apos;email ne peut pas être modifié pour des raisons de sécurité.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="h-12 px-8 bg-[var(--accent)] text-[var(--background)] hover:bg-[var(--accent-dark)] rounded-none uppercase tracking-[0.15em] text-xs font-medium disabled:opacity-50 transition-all"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            "Enregistrer"
                                        )}
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setName(session?.user?.name || "");
                                        }}
                                        className="h-12 px-8 border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] rounded-none uppercase tracking-[0.15em] text-xs font-medium transition-all"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <User className="w-5 h-5 text-[var(--accent)]" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] mb-1">Nom</p>
                                        <p className="text-[var(--foreground)]">{session?.user?.name || "-"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Mail className="w-5 h-5 text-[var(--accent)]" />
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] mb-1">Email</p>
                                        <p className="text-[var(--foreground)]">{session?.user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Security section */}
                    <div className="mt-8 bg-[var(--beige-dark)] p-8">
                        <h3 className="font-serif text-lg text-[var(--foreground)] mb-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-[var(--accent)]" />
                            Sécurité
                        </h3>

                        <div className="space-y-4">
                            <Link
                                href="/forgot-password"
                                className="flex items-center justify-between p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
                            >
                                <span className="text-sm text-[var(--foreground)]">Changer mon mot de passe</span>
                                <ArrowLeft className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] rotate-180 transition-colors" />
                            </Link>

                            <Link
                                href="/verify-phone"
                                className="flex items-center justify-between p-4 border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-[var(--accent)]" />
                                    <span className="text-sm text-[var(--foreground)]">Vérifier mon téléphone</span>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] rotate-180 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
