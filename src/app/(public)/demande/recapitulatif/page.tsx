"use client";

import { submitPublicDemande } from "@/actions/public";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { Button } from "@/components/ui/Button";
import { useDemandeStore } from "@/stores/demandeStore";
import { motion } from "framer-motion";
import { Calendar, Edit, FileText, Stethoscope, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecapitulatifPage() {
  const router = useRouter();
  const { formData, prevStep, goToStep, resetForm } = useDemandeStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePrevious = () => {
    prevStep();
    goToStep(4);
    router.push("/demande/disponibilites");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Appel à l'action serveur
      const result = await submitPublicDemande({
        ...formData,
        // On pourrait passer plus de détails ici si nécessaire
      });

      if (result.success) {
        resetForm();
        router.push("/demande/confirmation");
      } else {
        setError(result.error || "Erreur lors de l'envoi de la demande");
      }
    } catch (e) {
      console.error(e);
      setError("Une erreur inattendue est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPatientName = () => {
    if (formData.patient.prenom && formData.patient.nom) {
      return `${formData.patient.prenom} ${formData.patient.nom}`;
    }
    return "Non renseigné";
  };

  const getPatientAddress = () => {
    if (
      formData.patient.adresse &&
      formData.patient.codePostal &&
      formData.patient.ville
    ) {
      return `${formData.patient.adresse}, ${formData.patient.codePostal} ${formData.patient.ville}`;
    }
    return "Non renseigné";
  };

  const sections = [
    {
      icon: Stethoscope,
      title: "Type de soin",
      editPath: "/demande/soins",
      content: [
        { label: "Soin", value: formData.typeSoin || "Non renseigné" },
        { label: "Urgence", value: formData.urgence || "Non renseigné" },
      ],
    },
    {
      icon: User,
      title: "Patient",
      editPath: "/demande/patient",
      content: [
        { label: "Nom", value: getPatientName() },
        { label: "Email", value: formData.patient.email || "Non renseigné" },
        {
          label: "Téléphone",
          value: formData.patient.telephone || "Non renseigné",
        },
        { label: "Adresse", value: getPatientAddress() },
      ],
    },
    {
      icon: FileText,
      title: "Ordonnance",
      editPath: "/demande/ordonnance",
      content: [
        {
          label: "Document",
          value: formData.ordonnance?.nom || "Aucun document ajouté",
        },
      ],
    },
    {
      icon: Calendar,
      title: "Rendez-vous",
      editPath: "/demande/disponibilites",
      content: [
        {
          label: "Date",
          value: formData.dateRdv
            ? new Date(formData.dateRdv).toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Non renseigné",
        },
        { label: "Heure", value: formData.heureRdv || "Non renseigné" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4">
          Récapitulatif de votre demande
        </h1>
        <p className="text-sm text-gray-500">
          Vérifiez les informations avant de confirmer
        </p>
      </div>

      {/* Boutons de navigation en haut */}
      <div className="mb-6">
        <FormNavigation
          onPrevious={handlePrevious}
          onNext={handleSubmit}
          canGoNext={true}
          nextLabel={
            isSubmitting ? "Envoi en cours..." : "Confirmer la demande"
          }
          isLoading={isSubmitting}
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4 mb-8">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#927950]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#927950]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a]">
                    {section.title}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Step mapping: Soins=1, Ordonnance=2, Disponibilites=3, Patient=4
                    const stepMapping: Record<string, number> = {
                      "/demande/soins": 1,
                      "/demande/ordonnance": 2,
                      "/demande/disponibilites": 3,
                      "/demande/patient": 4,
                    };
                    goToStep(stepMapping[section.editPath] || 1);
                    router.push(section.editPath);
                  }}
                  className="text-[#927950]"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.content.map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="text-sm text-[#1a1a1a] font-medium">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
