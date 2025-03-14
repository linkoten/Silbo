import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate, truncateText } from "../utils/formatUtils";

const PersonnelsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="personnel"
      pluralName="personnels"
      apiEndpoint="/personnels"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "prenom", header: "Prénom" },
        {
          key: "profession",
          header: "Profession",
          render: (personnel) => {
            const profession = personnel.profession || "Non spécifiée";
            let badge = "bg-gray-100 text-gray-800";

            if (profession === "Médecin") badge = "bg-blue-100 text-blue-800";
            if (profession === "Infirmier" || profession === "Infirmière")
              badge = "bg-green-100 text-green-800";
            if (profession === "Chirurgien")
              badge = "bg-purple-100 text-purple-800";
            if (
              profession === "Aide-soignant" ||
              profession === "Aide-soignante"
            )
              badge = "bg-yellow-100 text-yellow-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
              >
                {profession}
              </span>
            );
          },
        },
        {
          key: "dateEmbauche",
          header: "Date d'embauche",
          render: (personnel) =>
            personnel.dateEmbauche
              ? formatDate(personnel.dateEmbauche)
              : "Non renseignée",
        },
        {
          key: "email",
          header: "Email",
          render: (personnel) => personnel.email || "Non renseigné",
        },
        {
          key: "telephone",
          header: "Téléphone",
          render: (personnel) => personnel.telephone || "Non renseigné",
        },
        {
          key: "specialite",
          header: "Spécialité",
          render: (personnel) => personnel.specialite || "Non spécifiée",
        },
        {
          key: "statut",
          header: "Statut",
          render: (personnel) => {
            const statut = personnel.statut || "Actif";
            let badge = "bg-green-100 text-green-800";

            if (statut === "En congé") badge = "bg-yellow-100 text-yellow-800";
            if (statut === "Indisponible") badge = "bg-red-100 text-red-800";
            if (statut === "Temps partiel") badge = "bg-blue-100 text-blue-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
              >
                {statut}
              </span>
            );
          },
        },
        {
          key: "serviceId",
          header: "Service",
          render: (personnel) =>
            personnel.serviceNom || personnel.serviceId || "Non assigné",
        },
        {
          key: "etablissementId",
          header: "Établissement",
          render: (personnel) =>
            personnel.etablissementNom ||
            personnel.etablissementId ||
            "Non assigné",
        },
        {
          key: "notes",
          header: "Notes",
          render: (personnel) =>
            truncateText(personnel.notes || "Aucune note", 50),
        },
      ]}
    />
  );
};

export default PersonnelsPage;
