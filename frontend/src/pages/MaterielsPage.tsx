import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate, truncateText } from "../utils/formatUtils";

const MaterielsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="materiel"
      pluralName="materiels"
      apiEndpoint="/materiels"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        {
          key: "quantite",
          header: "Quantité",
          render: (materiel) => {
            const quantite = materiel.quantite || 0;
            const disponible = materiel.disponible || 0;

            // Affiche la quantité et la disponibilité
            return (
              <div>
                <span
                  className={`font-medium ${
                    disponible === 0 ? "text-red-600" : "text-gray-700"
                  }`}
                >
                  {quantite}
                </span>
                {disponible !== undefined && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({disponible} disponible{disponible > 1 ? "s" : ""})
                  </span>
                )}
              </div>
            );
          },
        },
        {
          key: "type",
          header: "Type",
          render: (materiel) => {
            const type = materiel.type || "Standard";
            let badge = "bg-gray-100 text-gray-800";

            if (type === "Médical") badge = "bg-blue-100 text-blue-800";
            if (type === "Chirurgical") badge = "bg-green-100 text-green-800";
            if (type === "Diagnostic") badge = "bg-purple-100 text-purple-800";
            if (type === "Mobilier") badge = "bg-yellow-100 text-yellow-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
              >
                {type}
              </span>
            );
          },
        },
        {
          key: "status",
          header: "Statut",
          render: (materiel) => {
            const status = materiel.status || "Actif";
            let badge = "bg-green-100 text-green-800";

            if (status === "En réparation")
              badge = "bg-yellow-100 text-yellow-800";
            if (status === "Hors service") badge = "bg-red-100 text-red-800";
            if (status === "En commande") badge = "bg-blue-100 text-blue-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
              >
                {status}
              </span>
            );
          },
        },
        {
          key: "dateAchat",
          header: "Date d'achat",
          render: (materiel) =>
            materiel.dateAchat
              ? formatDate(materiel.dateAchat)
              : "Non renseignée",
        },
        {
          key: "fournisseur",
          header: "Fournisseur",
          render: (materiel) => materiel.fournisseur || "Non spécifié",
        },
        {
          key: "coutUnitaire",
          header: "Coût unitaire",
          render: (materiel) =>
            materiel.coutUnitaire
              ? `${materiel.coutUnitaire} €`
              : "Non spécifié",
        },
        {
          key: "description",
          header: "Description",
          render: (materiel) =>
            truncateText(materiel.description || "Aucune description", 50),
        },
        {
          key: "serviceId",
          header: "Service",
          render: (materiel) =>
            materiel.serviceNom || materiel.serviceId || "Non assigné",
        },
      ]}
    />
  );
};

export default MaterielsPage;
