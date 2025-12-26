"use client";

import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  authClient,
  isStaffFromSession,
  signIn,
  signInWithApple,
  signInWithGoogle,
  signUp,
} from "@/lib/auth-client";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Icônes SVG pour Google et Apple
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const router = useRouter();
  const { data: session } = authClient.useSession();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (session?.user) {
      const isStaff = isStaffFromSession(session);
      router.push(isStaff ? "/dashboard" : "/patient");
    }
  }, [session, router]);

  // Fonction pour déterminer la redirection après connexion
  const getRedirectUrl = (sessionData: typeof session) => {
    if (!sessionData?.user) return "/login";
    const isStaff = isStaffFromSession(sessionData);
    return isStaff ? "/dashboard" : "/patient";
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Erreur lors de la connexion avec Google");
      console.error(err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    setError(null);
    try {
      await signInWithApple();
    } catch (err) {
      setError("Erreur lors de la connexion avec Apple");
      console.error(err);
    } finally {
      setIsAppleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn.email({
          email,
          password,
          rememberMe,
        });

        if (error) {
          setError(error.message || "Erreur lors de la connexion");
          return;
        }

        router.push("/dashboard");
      } else {
        const { error } = await signUp.email({
          email,
          password,
          name: `${firstName} ${lastName}`.trim(),
        });

        if (error) {
          setError(error.message || "Erreur lors de l'inscription");
          return;
        }

        router.push("/dashboard");
      }
    } catch (err) {
      setError("Une erreur inattendue s'est produite");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <Header />
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-12 py-8 pt-24 md:pt-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1E211E] to-[#0a0a0a]" />

      {/* Gold accent lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#927950]/30 to-transparent" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#927950]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#927950]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-lg mx-auto relative z-10"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-[#927950] transition-colors text-xs uppercase tracking-[0.2em] font-medium mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Retour au site
        </Link>

        {/* Card */}
        <div className="bg-[#111111] border border-[#222222] p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">
              Harmonie
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#927950]" />
              <p className="text-[#927950] text-xs uppercase tracking-[0.3em]">
                Espace Patient
              </p>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#927950]" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#222222] mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-4 text-sm uppercase tracking-[0.15em] font-medium transition-all relative ${
                isLogin
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Connexion
              {isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#927950]"
                />
              )}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-4 text-sm uppercase tracking-[0.15em] font-medium transition-all relative ${
                !isLogin
                  ? "text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Inscription
              {!isLogin && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#927950]"
                />
              )}
            </button>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-800/50 text-red-400 px-4 py-3 text-sm mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                    Prénom
                  </label>
                  <Input
                    className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0 no-auto-focus not-focus"
                    placeholder="Jean"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required={!isLogin}
                    autoComplete="nope"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                    Nom
                  </label>
                  <Input
                    className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                    placeholder="Dupont"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required={!isLogin}
                    autoComplete="nope"
                  />
                </div>
              </div>
            )}

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
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                Mot de passe
              </label>
              <Input
                type="password"
                className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.15em] text-neutral-500">
                  Confirmer le mot de passe
                </label>
                <Input
                  type="password"
                  className="w-full bg-transparent border-0 border-b border-[#333333] rounded-none px-0 py-3 text-white placeholder:text-neutral-600 focus:border-[#927950] transition-colors focus:ring-0"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-[#333333] bg-transparent rounded-none accent-[#927950] cursor-pointer"
                  />
                  <span className="text-xs uppercase tracking-[0.1em] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    Se souvenir de moi
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs uppercase tracking-[0.1em] text-[#927950] hover:text-[#a8906a] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#927950] text-[#0a0a0a] hover:bg-[#a8906a] rounded-none uppercase tracking-[0.2em] text-sm font-semibold mt-8 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Se connecter"
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#222222]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#111111] px-4 text-neutral-500 tracking-[0.15em]">
                Ou continuer avec
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex items-center justify-center gap-3 h-12 border border-[#333333] hover:border-[#927950] text-white transition-all disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Google
                  </span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={isAppleLoading || isLoading}
              className="flex items-center justify-center gap-3 h-12 border border-[#333333] hover:border-[#927950] text-white transition-all disabled:opacity-50"
            >
              {isAppleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <AppleIcon className="w-5 h-5" />
                  <span className="text-xs uppercase tracking-[0.1em]">
                    Apple
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Phone verification option */}
          <div className="mt-8 pt-8 border-t border-[#222222]">
            <Link
              href="/verify-phone"
              className="flex items-center justify-center gap-3 text-neutral-500 hover:text-[#927950] transition-colors text-xs uppercase tracking-[0.15em]"
            >
              <Phone className="w-4 h-4" />
              Vérifier mon téléphone
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-600 text-xs mt-8 uppercase tracking-[0.1em]">
          © 2024 Harmonie — Cabinet Infirmier
        </p>
      </motion.div>
      </div>
    </div>
  );
}
