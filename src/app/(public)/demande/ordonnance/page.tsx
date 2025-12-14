"use client";

import { Button } from "@/components/ui/Button";
import { FormNavigation } from "@/components/demande/FormNavigation";
import { useDemandeStore } from "@/stores/demandeStore";
import { motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type OrdonnanceOption =
  | "oui_domicile"
  | "oui_sans_domicile"
  | "non"
  | undefined;

export default function OrdonnancePage() {
  const router = useRouter();
  const { formData, setOrdonnance, nextStep, prevStep, goToStep } =
    useDemandeStore();

  // Local state initialized from store
  const [ordonnanceOption, setOrdonnanceOption] = useState<OrdonnanceOption>(
    formData.ordonnance?.choice
  );
  const [medecinNom, setMedecinNom] = useState(
    formData.ordonnance?.medecinPrescripteur || ""
  );
  const [medecinTraitant, setMedecinTraitant] = useState(
    formData.ordonnance?.medecinTraitant || ""
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Sync local state to store on changes
  useEffect(() => {
    setOrdonnance({
      choice: ordonnanceOption,
      medecinPrescripteur: medecinNom,
      medecinTraitant: medecinTraitant,
    });
  }, [ordonnanceOption, medecinNom, medecinTraitant, setOrdonnance]);

  const handleNext = () => {
    nextStep();
    goToStep(3);
    router.push("/demande/disponibilites");
  };

  const handlePrevious = () => {
    prevStep();
    goToStep(1);
    router.push("/demande/soins");
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setOrdonnance({
          url: URL.createObjectURL(file),
          nom: file.name,
          type: file.type,
        });
      }
    },
    [setOrdonnance]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrdonnance({
        url: URL.createObjectURL(file),
        nom: file.name,
        type: file.type,
      });
    }
  };

  const removeFile = () => {
    // Only remove file-related fields, keep other data
    setOrdonnance({
      url: undefined,
      nom: undefined,
      type: undefined,
    });
  };

  const radioOptions = [
    { value: "oui_domicile", label: 'Oui, avec mention "à domicile"' },
    { value: "oui_sans_domicile", label: 'Oui, sans mention "à domicile"' },
    { value: "non", label: "Non" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] mb-4">
          Avez-vous une ordonnance ?
        </h1>
        <p className="text-sm text-red-600">* Champs obligatoires</p>
      </div>

      {/* Navigation en haut */}
      <div className="mb-6">
        <FormNavigation
          onPrevious={handlePrevious}
          onNext={handleNext}
          canGoNext={true}
          nextLabel="Continuer"
          previousLabel="Retour"
        />
      </div>

      {/* Question principale avec radio buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
        <p className="text-sm font-medium text-[#1a1a1a] mb-4">
          Avez-vous une ordonnance ? *
        </p>
        <div className="space-y-3">
          {radioOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                ordonnanceOption === option.value
                  ? "border-[#927950] bg-[#927950]/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                  ordonnanceOption === option.value
                    ? "border-[#927950]"
                    : "border-gray-300"
                }`}
              >
                {ordonnanceOption === option.value && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#927950]" />
                )}
              </div>
              <input
                type="radio"
                name="ordonnance"
                value={option.value}
                checked={ordonnanceOption === option.value}
                onChange={() =>
                  setOrdonnanceOption(option.value as OrdonnanceOption)
                }
                className="sr-only"
              />
              <span className="text-sm text-[#1a1a1a]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section upload de document */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
        <h3 className="text-base font-medium text-[#1a1a1a] mb-2">
          Ajoutez votre ordonnance si vous l&apos;avez à disposition
          (facultatif)
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          0/5 document(s) · Au format JPG, PNG ou PDF · 6 Mo par fichier
        </p>

        {!formData.ordonnance?.nom ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragOver
                ? "border-[#927950] bg-[#927950]/5"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Plus className="w-4 h-4" />
              <span className="text-sm">Ajouter un document</span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-green-200 bg-green-50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1a1a1a]">
                    {formData.ordonnance?.nom}
                  </p>
                  <p className="text-xs text-green-600">
                    Fichier ajouté avec succès
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={removeFile}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Nom du médecin prescripteur */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm mb-6">
        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
          Prescrit par <span className="text-orange-500">(Nom du médecin)</span>
        </label>
        <input
          type="text"
          value={medecinNom}
          onChange={(e) => setMedecinNom(e.target.value)}
          placeholder="Dr. Martin Dupont"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
        />
      </div>

      {/* Nom du médecin traitant */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
          Nom du médecin traitant
        </label>
        <input
          type="text"
          value={medecinTraitant}
          onChange={(e) => setMedecinTraitant(e.target.value)}
          placeholder="Dr. Jean Dupont"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927950] text-[#1a1a1a]"
        />
      </div>
    </div>
  );
}
