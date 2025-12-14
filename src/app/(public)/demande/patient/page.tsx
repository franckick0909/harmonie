"use client";

import { FormNavigation } from "@/components/demande/FormNavigation";
import { useDemandeStore } from "@/stores/demandeStore";
import { useRouter } from "next/navigation";

export default function PatientPage() {
  const router = useRouter();
  const { formData, setPatient, nextStep, prevStep, isStepValid, goToStep } =
    useDemandeStore();

  const handleNext = () => {
    if (isStepValid(4)) {
      nextStep();
      goToStep(5);
      router.push("/demande/recapitulatif");
    }
  };

  const handlePrevious = () => {
    prevStep();
    goToStep(3);
    router.push("/demande/disponibilites");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4">
          Qui est le patient ?
        </h1>
        <p className="text-sm text-red-600">* Champs obligatoires</p>
      </div>

      {/* Boutons de navigation en haut */}
      <div className="mb-6">
        <FormNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={isStepValid(4)}
          nextLabel="Continuer"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <form className="space-y-6">
          {/* Identité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.patient.prenom}
                onChange={(e) => setPatient({ prenom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="Jean"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.patient.nom}
                onChange={(e) => setPatient({ nom: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
              Date de naissance *
            </label>
            <input
              title="Date de naissance"
              type="date"
              value={formData.patient.dateNaissance}
              onChange={(e) => setPatient({ dateNaissance: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
              required
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.patient.email}
                onChange={(e) => setPatient({ email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="jean.dupont@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                value={formData.patient.telephone}
                onChange={(e) => setPatient({ telephone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="06 12 34 56 78"
                required
              />
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
              Adresse *
            </label>
            <input
              type="text"
              value={formData.patient.adresse}
              onChange={(e) => setPatient({ adresse: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
              placeholder="123 rue de la Santé"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Code postal *
              </label>
              <input
                type="text"
                value={formData.patient.codePostal}
                onChange={(e) => setPatient({ codePostal: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="75001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Ville *
              </label>
              <input
                type="text"
                value={formData.patient.ville}
                onChange={(e) => setPatient({ ville: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
                placeholder="Paris"
                required
              />
            </div>
          </div>

          {/* Sécurité sociale */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
              Numéro de sécurité sociale
            </label>
            <input
              type="text"
              value={formData.patient.numeroSecu}
              onChange={(e) => setPatient({ numeroSecu: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
              placeholder="1 XX XX XX XXX XXX XX"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
