import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate, truncateText } from "../utils/formatUtils";

const PatientsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="patient"
      pluralName="patients"
      apiEndpoint="/patients"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "prenom", header: "Prénom" },
        {
          key: "dateNaissance",
          header: "Date de naissance",
          render: (patient) => formatDate(patient.dateNaissance),
        },
        {
          key: "adresse",
          header: "Adresse",
          render: (patient) =>
            truncateText(patient.adresse || "Non renseignée", 30),
        },
        {
          key: "telephone",
          header: "Téléphone",
          render: (patient) => patient.telephone || "Non renseigné",
        },
        {
          key: "email",
          header: "Email",
          render: (patient) => patient.email || "Non renseigné",
        },
        {
          key: "numeroSecu",
          header: "Numéro Sécu",
          render: (patient) => patient.numeroSecu || "Non renseigné",
        },
        {
          key: "groupeSanguin",
          header: "Groupe sanguin",
          render: (patient) => patient.groupeSanguin || "Non renseigné",
        },
        {
          key: "allergie",
          header: "Allergies",
          render: (patient) =>
            truncateText(patient.allergie || "Aucune allergie", 30),
        },
        {
          key: "antecedents",
          header: "Antécédents",
          render: (patient) =>
            truncateText(patient.antecedents || "Aucun antécédent", 30),
        },
        {
          key: "dateAdmission",
          header: "Date d'admission",
          render: (patient) => formatDate(patient.dateAdmission),
        },
        {
          key: "dateSortie",
          header: "Date de sortie",
          render: (patient) =>
            patient.dateSortie ? formatDate(patient.dateSortie) : "Non définie",
        },
        {
          key: "statut",
          header: "Statut",
          render: (patient) => {
            const status = patient.statut || "Inconnu";
            let statusClass = "bg-gray-100 text-gray-800";

            if (status === "Hospitalisé") {
              statusClass = "bg-green-100 text-green-800";
            } else if (status === "Sortant") {
              statusClass = "bg-yellow-100 text-yellow-800";
            } else if (status === "Sorti") {
              statusClass = "bg-blue-100 text-blue-800";
            }

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
              >
                {status}
              </span>
            );
          },
        },
        {
          key: "dossierMedical",
          header: "Dossier médical",
          render: (patient) =>
            truncateText(patient.dossierMedical || "Pas d'information", 30),
        },
      ]}
    />
  );
};

export default PatientsPage;
