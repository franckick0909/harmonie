import type { Demande, Patient } from "@/types/demande";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Configuration des couleurs du thème
const COLORS = {
  primary: [146, 121, 80] as [number, number, number], // #927950
  text: [30, 33, 30] as [number, number, number], // #1E211E
  lightBg: [249, 247, 242] as [number, number, number], // #F9F7F2
  gray: [107, 107, 107] as [number, number, number], // #6b6b6b
};

/**
 * Ajoute l'en-tête du document PDF
 */
function addHeader(doc: jsPDF, title: string) {
  // Logo/Titre
  doc.setFontSize(24);
  doc.setTextColor(...COLORS.primary);
  doc.text("Harmonie", 20, 25);

  // Sous-titre
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.gray);
  doc.text("Cabinet Infirmier", 20, 32);

  // Titre du document
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.text);
  doc.text(title, 20, 50);

  // Date d'export
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.gray);
  doc.text(
    `Exporté le ${new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    20,
    58
  );

  // Ligne de séparation
  doc.setDrawColor(...COLORS.primary);
  doc.setLineWidth(0.5);
  doc.line(20, 63, 190, 63);

  return 70; // Retourne la position Y après l'en-tête
}

/**
 * Ajoute le pied de page
 */
function addFooter(doc: jsPDF, pageNumber: number) {
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.gray);
  doc.text(
    `Page ${pageNumber}`,
    doc.internal.pageSize.width / 2,
    pageHeight - 10,
    { align: "center" }
  );
  doc.text("Harmonie - Cabinet Infirmier", 20, pageHeight - 10);
  doc.text(
    new Date().toLocaleDateString("fr-FR"),
    doc.internal.pageSize.width - 20,
    pageHeight - 10,
    { align: "right" }
  );
}

/**
 * Export du planning en PDF
 */
export function exportPlanningToPDF(
  demandes: Demande[],
  weekStart: Date,
  viewType: "week" | "month" = "week"
) {
  const doc = new jsPDF();

  // Titre selon la vue
  const title =
    viewType === "week"
      ? `Planning - Semaine du ${weekStart.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        })}`
      : `Planning - ${weekStart.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        })}`;

  let yPos = addHeader(doc, title);

  // Statistiques rapides
  const stats = {
    total: demandes.length,
    confirmees: demandes.filter((d) => d.statut === "CONFIRMEE").length,
    enAttente: demandes.filter((d) => d.statut === "EN_ATTENTE").length,
    urgentes: demandes.filter((d) => d.urgence === "URGENTE").length,
  };

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text(`Total: ${stats.total} RDV`, 20, yPos);
  doc.text(`Confirmés: ${stats.confirmees}`, 70, yPos);
  doc.text(`En attente: ${stats.enAttente}`, 120, yPos);
  doc.text(`Urgents: ${stats.urgentes}`, 170, yPos);

  yPos += 15;

  // Trier les demandes par date
  const sortedDemandes = [...demandes].sort((a, b) => {
    if (!a.dateRdv) return 1;
    if (!b.dateRdv) return -1;
    return new Date(a.dateRdv).getTime() - new Date(b.dateRdv).getTime();
  });

  // Préparer les données du tableau
  const tableData = sortedDemandes.map((demande) => [
    demande.dateRdv
      ? new Date(demande.dateRdv).toLocaleDateString("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : "À définir",
    demande.heureRdv || "-",
    `${demande.patient.prenom} ${demande.patient.nom}`,
    demande.typeSoin,
    demande.statut === "EN_ATTENTE"
      ? "En attente"
      : demande.statut === "CONFIRMEE"
      ? "Confirmé"
      : demande.statut === "TERMINEE"
      ? "Terminé"
      : demande.statut,
    demande.urgence === "URGENTE"
      ? "⚠️ Urgent"
      : demande.urgence === "ELEVEE"
      ? "Élevée"
      : "Normale",
  ]);

  // Créer le tableau
  autoTable(doc, {
    startY: yPos,
    head: [["Date", "Heure", "Patient", "Soin", "Statut", "Urgence"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: COLORS.text,
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightBg,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 20 },
      2: { cellWidth: 40 },
      3: { cellWidth: 40 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    },
  });

  // Sauvegarder le PDF
  const fileName = `planning_${viewType}_${
    weekStart.toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);

  return fileName;
}

/**
 * Export de la liste des patients en PDF
 */
export function exportPatientsToPDF(patients: Patient[], demandes: Demande[]) {
  const doc = new jsPDF();

  let yPos = addHeader(doc, "Liste des Patients");

  // Statistiques
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text(`Total: ${patients.length} patients`, 20, yPos);
  yPos += 15;

  // Préparer les données
  const tableData = patients.map((patient) => {
    const patientDemandes = demandes.filter((d) => d.patient.id === patient.id);
    const lastDemande = patientDemandes.sort((a, b) => {
      const dateA = a.dateRdv ? new Date(a.dateRdv).getTime() : 0;
      const dateB = b.dateRdv ? new Date(b.dateRdv).getTime() : 0;
      return dateB - dateA;
    })[0];

    return [
      `${patient.prenom} ${patient.nom}`,
      patient.telephone || "-",
      patient.email,
      patient.ville || "-",
      patientDemandes.length.toString(),
      lastDemande?.dateRdv
        ? new Date(lastDemande.dateRdv).toLocaleDateString("fr-FR")
        : "-",
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [["Nom", "Téléphone", "Email", "Ville", "RDV", "Dernier RDV"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      textColor: COLORS.text,
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: COLORS.lightBg,
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 30 },
      2: { cellWidth: 45 },
      3: { cellWidth: 25 },
      4: { cellWidth: 15 },
      5: { cellWidth: 25 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      addFooter(doc, data.pageNumber);
    },
  });

  const fileName = `patients_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);

  return fileName;
}

/**
 * Export d'une fiche patient détaillée en PDF
 */
export function exportPatientDetailToPDF(
  patient: Patient,
  demandes: Demande[]
) {
  const doc = new jsPDF();

  let yPos = addHeader(doc, `Fiche Patient - ${patient.prenom} ${patient.nom}`);

  // Informations du patient
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text("Informations personnelles", 20, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  const infos = [
    `Nom complet: ${patient.prenom} ${patient.nom}`,
    `Email: ${patient.email}`,
    `Téléphone: ${patient.telephone || "Non renseigné"}`,
    `Adresse: ${patient.adresse || "Non renseignée"}${
      patient.ville ? `, ${patient.codePostal} ${patient.ville}` : ""
    }`,
    `Date de naissance: ${new Date(patient.dateNaissance).toLocaleDateString(
      "fr-FR"
    )}`,
    `N° Sécurité Sociale: ${patient.numeroSecu || "Non renseigné"}`,
  ];

  infos.forEach((info) => {
    doc.text(info, 25, yPos);
    yPos += 6;
  });

  yPos += 10;

  // Historique des demandes
  const patientDemandes = demandes
    .filter((d) => d.patient.id === patient.id)
    .sort((a, b) => {
      const dateA = a.dateRdv ? new Date(a.dateRdv).getTime() : 0;
      const dateB = b.dateRdv ? new Date(b.dateRdv).getTime() : 0;
      return dateB - dateA;
    });

  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text(`Historique des soins (${patientDemandes.length})`, 20, yPos);
  yPos += 10;

  if (patientDemandes.length > 0) {
    const tableData = patientDemandes.map((d) => [
      d.dateRdv ? new Date(d.dateRdv).toLocaleDateString("fr-FR") : "À définir",
      d.heureRdv || "-",
      d.typeSoin,
      d.statut === "EN_ATTENTE"
        ? "En attente"
        : d.statut === "CONFIRMEE"
        ? "Confirmé"
        : d.statut === "TERMINEE"
        ? "Terminé"
        : d.statut,
      d.notes ? d.notes.substring(0, 30) + "..." : "-",
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [["Date", "Heure", "Type de soin", "Statut", "Notes"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: COLORS.primary,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: {
        textColor: COLORS.text,
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: COLORS.lightBg,
      },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        addFooter(doc, data.pageNumber);
      },
    });
  } else {
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.gray);
    doc.text("Aucun soin enregistré", 25, yPos);
  }

  const fileName = `patient_${patient.nom}_${patient.prenom}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);

  return fileName;
}

/**
 * Fonction d'impression (ouvre la boîte de dialogue d'impression)
 */
export function printElement(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Impression - Harmonie</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            color: #1E211E;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #d5ccc0;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #927950;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #F9F7F2;
          }
          .header {
            border-bottom: 2px solid #927950;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h1 {
            color: #927950;
            margin: 0;
          }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Harmonie</h1>
          <p>Cabinet Infirmier - ${new Date().toLocaleDateString("fr-FR")}</p>
        </div>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
