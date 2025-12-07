"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await authClient.requestPasswordReset({
                email,
                redirectTo: "/reset-password",
            });

            if (error) {
                setError(error.message || "Erreur lors de l'envoi de l'email");
                return;
            }

            setSuccess(true);
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
            <div className="absolute top-20 right-20 w-64 h-64 bg-[#927950]/5 rounded-full blur-3xl" />

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
                                Mot de passe oublié
                            </p>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#927950]" />
                        </div>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#927950]/20 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-[#927950]" />
                            </div>
                            <div>
                                <h2 className="text-xl text-white font-medium mb-2">Email envoyé !</h2>
                                <p className="text-neutral-400 text-sm">
                                    Si un compte existe avec l&apos;adresse <span className="text-[#927950]">{email}</span>,
                                    vous recevrez un email avec les instructions.
                                </p>
                            </div>
                            <Link
                                href="/login"
                                className="inline-block text-xs uppercase tracking-[0.15em] text-[#927950] hover:text-[#a8906a] transition-colors"
                            >
                                Retourner à la connexion
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 text-neutral-400 mb-8">
                                <Mail className="w-5 h-5 text-[#927950]" />
                                <p className="text-sm">
                                    Entrez votre email pour recevoir un lien de réinitialisation.
                                </p>
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
                                        Email
                                    </label>
                                    <Input
                                        type="email"
                                        className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                                        placeholder="jean.dupont@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
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
                                        "Envoyer le lien"
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </div>

                <p className="text-center text-neutral-600 text-xs mt-8 uppercase tracking-[0.1em]">
                    © 2024 Harmonie — Cabinet Infirmier
                </p>
            </motion.div>
        </div>
    );
}
