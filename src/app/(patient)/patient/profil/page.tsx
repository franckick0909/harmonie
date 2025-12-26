"use client";

import { getPatientProfile, updatePatientProfile } from "@/actions/patient";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Edit2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface PatientData {
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

export default function ProfilPage() {
  const { data: session, isPending } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasPatientProfile, setHasPatientProfile] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState<PatientData>({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
  });

  // Données originales pour l'affichage
  const [originalData, setOriginalData] = useState<PatientData>({
    nom: "",
    prenom: "",
    telephone: "",
    adresse: "",
    ville: "",
    codePostal: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      const result = await getPatientProfile();
      if (result.success && result.data?.patient) {
        const patient = result.data.patient;
        const data: PatientData = {
          nom: patient.nom || "",
          prenom: patient.prenom || "",
          telephone: patient.telephone || "",
          adresse: patient.adresse || "",
          ville: patient.ville || "",
          codePostal: patient.codePostal || "",
        };
        setFormData(data);
        setOriginalData(data);
        setHasPatientProfile(true);
      }
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      loadProfile();
    }
  }, [session, loadProfile]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const result = await updatePatientProfile(formData);

      if (result.success) {
        setOriginalData(formData);
        setIsEditing(false);
        setSuccess("Profil mis à jour avec succès");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Une erreur est survenue");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setError(null);
  };

  if (isPending || isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#927950]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-3xl text-[#1E211E] mb-2">Mon profil</h1>
        <p className="text-[#6b6b6b]">Gérez vos informations personnelles</p>
      </motion.div>

      {/* Message de succès */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          {success}
        </motion.div>
      )}

      {/* Message d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {/* Info si pas de fiche patient */}
      {!hasPatientProfile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          Vous n&apos;avez pas encore de fiche patient. Faites une demande de
          soins pour créer votre fiche.
        </motion.div>
      )}

      {/* Carte profil */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-[#d5ccc0]/30 overflow-hidden"
      >
        {/* En-tête avec avatar */}
        <div className="bg-gradient-to-r from-[#927950]/10 to-[#927950]/5 p-4 sm:p-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#927950] flex items-center justify-center text-white text-xl sm:text-2xl font-serif shrink-0">
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-medium text-[#1E211E] truncate">
                {session?.user?.name || "Patient"}
              </h2>
              <p className="text-[#6b6b6b] text-sm sm:text-base truncate">{session?.user?.email}</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                aria-label="Modifier le profil"
                title="Modifier le profil"
                onClick={() => setIsEditing(true)}
                className="p-2 sm:p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all shrink-0"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#927950]" />
              </button>
            )}
          </div>
        </div>

        {/* Informations */}
        <div className="p-4 sm:p-8 space-y-6">
          {isEditing ? (
            // Mode édition
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#6b6b6b] mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    aria-label="Prénom"
                    title="Prénom"
                    value={formData.prenom}
                    onChange={(e) =>
                      setFormData({ ...formData, prenom: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6b6b] mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    aria-label="Nom"
                    title="Nom"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#6b6b6b] mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  aria-label="Téléphone"
                  title="Téléphone"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#6b6b6b] mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  aria-label="Adresse"
                  title="Adresse"
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#6b6b6b] mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    aria-label="Code postal"
                    title="Code postal"
                    value={formData.codePostal}
                    onChange={(e) =>
                      setFormData({ ...formData, codePostal: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6b6b] mb-2">
                    Ville
                  </label>
                  <input
                    type="text"
                    aria-label="Ville"
                    title="Ville"
                    value={formData.ville}
                    onChange={(e) =>
                      setFormData({ ...formData, ville: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#d5ccc0] rounded-xl focus:outline-none focus:border-[#927950] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#927950] text-white rounded-xl hover:bg-[#7a6443] transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 border border-[#d5ccc0] text-[#6b6b6b] rounded-xl hover:bg-[#F9F7F2] transition-colors"
                >
                  <X className="w-5 h-5" />
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            // Mode affichage
            <div className="space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F9F7F2] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#927950]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#6b6b6b]">Email</p>
                  <p className="text-[#1E211E] text-sm sm:text-base truncate">{session?.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F9F7F2] rounded-xl">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[#927950]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#6b6b6b]">Nom complet</p>
                  <p className="text-[#1E211E] text-sm sm:text-base">
                    {originalData.prenom && originalData.nom
                      ? `${originalData.prenom} ${originalData.nom}`
                      : session?.user?.name || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F9F7F2] rounded-xl ${
                  !originalData.telephone ? "opacity-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#927950]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#6b6b6b]">Téléphone</p>
                  <p className="text-[#1E211E] text-sm sm:text-base">
                    {originalData.telephone || "Non renseigné"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-[#F9F7F2] rounded-xl ${
                  !originalData.adresse ? "opacity-50" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#927950]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#6b6b6b]">Adresse</p>
                  <p className="text-[#1E211E] text-sm sm:text-base">
                    {originalData.adresse
                      ? `${originalData.adresse}${
                          originalData.codePostal
                            ? `, ${originalData.codePostal}`
                            : ""
                        }${originalData.ville ? ` ${originalData.ville}` : ""}`
                      : "Non renseignée"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sécurité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-[#d5ccc0]/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[#927950]" />
          <h3 className="font-medium text-[#1E211E]">Sécurité</h3>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-[#F9F7F2] rounded-xl hover:bg-[#927950]/10 transition-colors text-left">
            <div>
              <p className="font-medium text-[#1E211E]">
                Changer mon mot de passe
              </p>
              <p className="text-sm text-[#6b6b6b]">
                Modifiez votre mot de passe de connexion
              </p>
            </div>
            <Edit2 className="w-5 h-5 text-[#6b6b6b]" />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-[#F9F7F2] rounded-xl hover:bg-[#927950]/10 transition-colors text-left">
            <div>
              <p className="font-medium text-[#1E211E]">
                Vérifier mon téléphone
              </p>
              <p className="text-sm text-[#6b6b6b]">
                Ajoutez ou vérifiez votre numéro de téléphone
              </p>
            </div>
            <Phone className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
