"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Phone } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Step = "phone" | "otp" | "success";

export default function VerifyPhonePage() {
    const [step, setStep] = useState<Step>("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            return '+33' + cleaned.substring(1);
        }
        if (!cleaned.startsWith('33') && cleaned.length > 0) {
            return '+33' + cleaned;
        }
        return '+' + cleaned;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formattedPhone = formatPhoneNumber(phoneNumber);

        try {
            const { error } = await authClient.phoneNumber.sendOtp({
                phoneNumber: formattedPhone,
            });

            if (error) {
                setError(error.message || "Erreur lors de l'envoi du code");
                return;
            }

            setPhoneNumber(formattedPhone);
            setStep("otp");
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await authClient.phoneNumber.verify({
                phoneNumber,
                code: otp,
            });

            if (error) {
                setError(error.message || "Code invalide");
                return;
            }

            setStep("success");
            setTimeout(() => {
                router.push("/dashboard");
            }, 2000);
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { error } = await authClient.phoneNumber.sendOtp({
                phoneNumber,
            });

            if (error) {
                setError(error.message || "Erreur lors du renvoi du code");
            }
        } catch (err) {
            setError("Une erreur inattendue s'est produite");
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
            <div className="absolute top-40 left-20 w-72 h-72 bg-[#927950]/5 rounded-full blur-3xl" />

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
                                {step === "phone" && "Vérification téléphone"}
                                {step === "otp" && "Entrez le code"}
                                {step === "success" && "Vérifié"}
                            </p>
                            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#927950]" />
                        </div>
                    </div>

                    {step === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#927950]/20 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-[#927950]" />
                            </div>
                            <div>
                                <h2 className="text-xl text-white font-medium mb-2">Numéro vérifié !</h2>
                                <p className="text-neutral-400 text-sm">
                                    Redirection vers le tableau de bord...
                                </p>
                            </div>
                        </motion.div>
                    ) : step === "otp" ? (
                        <>
                            <div className="flex items-center gap-3 text-neutral-400 mb-8">
                                <Phone className="w-5 h-5 text-[#927950]" />
                                <p className="text-sm">
                                    Code envoyé au <span className="text-[#927950]">{phoneNumber}</span>
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

                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                                        Code de vérification
                                    </label>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white text-2xl tracking-[0.5em] text-center placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || otp.length !== 6}
                                    className="w-full h-14 bg-[#927950] text-[#0a0a0a] hover:bg-[#a8906a] rounded-none uppercase tracking-[0.2em] text-sm font-semibold disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Vérifier"
                                    )}
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="w-full text-xs uppercase tracking-[0.15em] text-neutral-500 hover:text-[#927950] transition-colors disabled:opacity-50"
                                >
                                    Renvoyer le code
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-3 text-neutral-400 mb-8">
                                <Phone className="w-5 h-5 text-[#927950]" />
                                <p className="text-sm">
                                    Entrez votre numéro pour recevoir un code SMS.
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

                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                                        Numéro de téléphone
                                    </label>
                                    <Input
                                        type="tel"
                                        className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                                        placeholder="06 12 34 56 78"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                    <p className="text-xs text-neutral-600">Format: 06 12 34 56 78</p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#927950] text-[#0a0a0a] hover:bg-[#a8906a] rounded-none uppercase tracking-[0.2em] text-sm font-semibold mt-8 disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        "Envoyer le code"
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
