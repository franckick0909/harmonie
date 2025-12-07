import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/lib/auth-actions";
import Link from "next/link";
import { Calendar, FileText, User } from "lucide-react";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen bg-[var(--background)] p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-[var(--border)]">
                    <div>
                        <p className="text-[var(--accent)] text-xs uppercase tracking-[0.3em] mb-2">
                            Espace Patient
                        </p>
                        <h1 className="font-serif text-3xl md:text-4xl text-[var(--foreground)]">
                            Bienvenue, {user?.name?.split(" ")[0] || "Patient"}
                        </h1>
                        <p className="text-[var(--muted)] text-sm mt-1">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 px-5 py-3 border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--background)] transition-colors uppercase tracking-wider text-xs font-medium"
                        >
                            <User className="w-4 h-4" />
                            Mon Profil
                        </Link>
                        <form action={signOutAction}>
                            <button
                                type="submit"
                                className="px-5 py-3 border border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] transition-colors uppercase tracking-wider text-xs font-medium"
                            >
                                Déconnexion
                            </button>
                        </form>
                    </div>
                </header>

                {/* Welcome card */}
                <div className="p-8 bg-[var(--beige-dark)] mb-8">
                    <h2 className="font-serif text-xl text-[var(--foreground)] mb-3">
                        Votre espace personnel
                    </h2>
                    <p className="text-[var(--muted)]">
                        Bienvenue dans votre espace Harmonie. Ici vous pourrez gérer vos rendez-vous,
                        accéder à vos documents médicaux et mettre à jour vos informations personnelles.
                    </p>
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rendez-vous */}
                    <div className="group p-6 bg-[var(--beige-dark)] border border-transparent hover:border-[var(--accent)] transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-[var(--accent)]" />
                            </div>
                            <h3 className="font-serif text-lg text-[var(--foreground)]">Rendez-vous</h3>
                        </div>
                        <p className="text-[var(--muted)] text-sm mb-4">
                            Consultez et gérez vos prochains rendez-vous.
                        </p>
                        <p className="text-[var(--muted-light)] text-xs uppercase tracking-wider">
                            Aucun rendez-vous à venir
                        </p>
                    </div>

                    {/* Documents */}
                    <div className="group p-6 bg-[var(--beige-dark)] border border-transparent hover:border-[var(--accent)] transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[var(--accent)]" />
                            </div>
                            <h3 className="font-serif text-lg text-[var(--foreground)]">Documents</h3>
                        </div>
                        <p className="text-[var(--muted)] text-sm mb-4">
                            Accédez à vos ordonnances et documents médicaux.
                        </p>
                        <p className="text-[var(--muted-light)] text-xs uppercase tracking-wider">
                            Aucun document disponible
                        </p>
                    </div>

                    {/* Profil */}
                    <Link href="/profile" className="group p-6 bg-[var(--beige-dark)] border border-transparent hover:border-[var(--accent)] transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[var(--accent)]/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-[var(--accent)]" />
                            </div>
                            <h3 className="font-serif text-lg text-[var(--foreground)]">Mon Profil</h3>
                        </div>
                        <p className="text-[var(--muted)] text-sm mb-4">
                            Modifiez vos informations personnelles et paramètres.
                        </p>
                        <p className="text-[var(--accent)] text-xs uppercase tracking-wider group-hover:underline">
                            Gérer mon profil →
                        </p>
                    </Link>
                </div>

                {/* Footer note */}
                <p className="text-center text-[var(--muted-light)] text-xs mt-12 uppercase tracking-[0.1em]">
                    Harmonie — Cabinet Infirmier
                </p>
            </div>
        </div>
    );
}
