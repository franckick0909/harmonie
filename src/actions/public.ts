"use server";

import { createDemande } from "@/actions/dashboard";
import { createPatient } from "@/actions/patientStats";

export async function submitPublicDemande(formData: any) {
  try {
    // 1. Créer ou récupérer le patient
    // Pour l'instant, on crée un nouveau patient à chaque fois pour éviter les conflits
    // Dans une version future, on pourrait rechercher un patient existant par email/sécu

    // Convertir la date de naissance string en Date
    const dateNaissance = new Date(formData.patient.dateNaissance);

    const patientResult = await createPatient({
      nom: formData.patient.nom,
      prenom: formData.patient.prenom,
      email: formData.patient.email,
      telephone: formData.patient.telephone,
      dateNaissance: dateNaissance,
      adresse: formData.patient.adresse,
      ville: formData.patient.ville,
      codePostal: formData.patient.codePostal,
      numeroSecu: formData.patient.numeroSecu || undefined,
    });

    if (!patientResult.success || !patientResult.data) {
      throw new Error(
        patientResult.error || "Erreur lors de la création du patient"
      );
    }

    const patient = patientResult.data;

    // 2. Créer la demande
    // Gérer la date de RDV si elle existe
    let dateRdv = undefined;
    if (formData.dateRdv) {
      dateRdv = new Date(formData.dateRdv);
    }

    // Construire une description enrichie avec les détails des soins
    let description = formData.typeSoin;

    // TODO: Si on avait accès aux `soinsDetails` ici, on pourrait enrichir la description
    // ou les notes avec les détails spécifiques (fréquence, type de pansement, etc.)
    // Actuellement le store zustand a ces infos mais on passe que formData ici ?
    // On verra comment passer tout l'état.

    const demandeResult = await createDemande({
      patientId: patient.id,
      typeSoin: formData.typeSoin,
      description: description,
      dateRdv: dateRdv,
      heureRdv: formData.heureRdv,
      urgence: formData.urgence || "NORMALE",
      // On peut ajouter d'autres infos dans les notes
      notes:
        `Ordonnance: ${formData.ordonnance?.nom || "Non fournie"}\n` +
        `Prescrit par: ${
          formData.ordonnance?.medecinPrescripteur || "Non renseigné"
        }\n` +
        `Médecin traitant: ${
          formData.ordonnance?.medecinTraitant || "Non renseigné"
        }\n` +
        `Choix ordonnance: ${formData.ordonnance?.choice || "Non spécifié"}\n` +
        `Créé depuis le formulaire public.`,
    });

    if (!demandeResult.success || !demandeResult.data) {
      throw new Error(
        demandeResult.error || "Erreur lors de la création de la demande"
      );
    }

    return { success: true, demandeId: demandeResult.data.id };
  } catch (error) {
    console.error("Erreur détaillée lors de la soumission publique:", error);
    
    // Logger plus de détails pour le débogage
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    } else {
      console.error("Erreur complète:", JSON.stringify(error, null, 2));
    }
    
    // Retourner un message d'erreur plus informatif
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue lors de l'enregistrement de votre demande.";
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}
