"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Token de réinitialisation manquant");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                setError(error.message || "Erreur lors de la réinitialisation");
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-900/20 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-red-400" />
                </div>
                <div>
                    <h2 className="text-xl text-white font-medium mb-2">Lien invalide</h2>
                    <p className="text-neutral-400 text-sm">
                        Ce lien de réinitialisation est invalide ou expiré.
                    </p>
                </div>
                <Link
                    href="/forgot-password"
                    className="inline-block text-xs uppercase tracking-[0.15em] text-[#927950] hover:text-[#a8906a] transition-colors"
                >
                    Demander un nouveau lien
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#927950]/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#927950]" />
                </div>
                <div>
                    <h2 className="text-xl text-white font-medium mb-2">Mot de passe modifié !</h2>
                    <p className="text-neutral-400 text-sm">
                        Redirection vers la connexion...
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-3 text-neutral-400 mb-8">
                <Lock className="w-5 h-5 text-[#927950]" />
                <p className="text-sm">Entrez votre nouveau mot de passe.</p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm mb-6"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                        Nouveau mot de passe
                    </label>
                    <Input
                        type="password"
                        className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                        Confirmer le mot de passe
                    </label>
                    <Input
                        type="password"
                        className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-[#927950] text-[#0a0a0a] hover:bg-[#a8906a] rounded-none uppercase tracking-[0.2em] text-sm font-semibold mt-8 disabled:opacity-50 transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Réinitialiser"
                    )}
                </Button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#927950]/5 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#927950] transition-colors text-xs uppercase tracking-[0.2em] font-medium mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Retour à la connexion
                </Link>

                <div className="bg-[#111111] border border-[#222222] p-8 md:p-12">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
                            Harmonie
                        </h1>
                        <div className="flex items-center justify-center gap-4">
                            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#927950]" />
                            <p className="text-[#927950] text-xs uppercase tracking-[0.3em]">
                                Nouveau mot de passe
                            </p>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#927950]" />
                        </div>
                    </div>

                    <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin text-[#927950] mx-auto" />}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>

                <p className="text-center text-neutral-600 text-xs mt-8 uppercase tracking-[0.1em]">
                    © 2024 Harmonie — Cabinet Infirmier
                </p>
            </motion.div>
        </div>
    );
}
