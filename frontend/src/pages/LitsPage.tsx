import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate } from "../utils/formatUtils";

// Service local pour formater l'affichage du statut du lit
const getStatusBadgeClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "occupé":
      return "bg-red-100 text-red-800";
    case "disponible":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "réservé":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const LitsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="lit"
      pluralName="lits"
      apiEndpoint="/lits"
      columns={[
        { key: "id", header: "ID" },
        { key: "numeroLit", header: "Numéro de lit" },
        {
          key: "chambre",
          header: "Chambre",
          render: (lit) => lit.chambre || "Non assignée",
        },
        {
          key: "etage",
          header: "Étage",
          render: (lit) => lit.etage || "-",
        },
        {
          key: "statut",
          header: "Statut",
          render: (lit) => (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                lit.statut
              )}`}
            >
              {lit.statut || "Inconnu"}
            </span>
          ),
        },
        {
          key: "type",
          header: "Type",
          render: (lit) => lit.type || "Standard",
        },
        {
          key: "dateCreation",
          header: "Date de création",
          render: (lit) =>
            lit.dateCreation ? formatDate(lit.dateCreation) : "-",
        },
        {
          key: "dateMaintenance",
          header: "Maintenance prévue",
          render: (lit) =>
            lit.dateMaintenance ? formatDate(lit.dateMaintenance) : "-",
        },
        {
          key: "equipements",
          header: "Équipements",
          render: (lit) => lit.equipements || "Aucun équipement spécifique",
        },
        {
          key: "notes",
          header: "Notes",
          render: (lit) => lit.notes || "-",
        },
        {
          key: "serviceId",
          header: "Service",
          render: (lit) => {
            // L'ID du service est affiché, mais idéalement on afficherait le nom du service
            // Cette information viendrait d'une jointure avec la table des services
            return lit.serviceId;
          },
        },
      ]}
    />
  );
};

export default LitsPage;
