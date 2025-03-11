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
          key: "dossierMedical",
          header: "Dossier médical",
          render: (patient) => truncateText(patient.dossierMedical, 30),
        },
        { key: "numeroSecu", header: "Numéro Sécu" },
      ]}
    />
  );
};

export default PatientsPage;
