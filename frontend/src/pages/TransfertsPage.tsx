import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate, truncateText } from "../utils/formatUtils";

const TransfertsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="transfert"
      pluralName="transferts"
      apiEndpoint="/transferts"
      columns={[
        { key: "id", header: "ID" },
        {
          key: "patientId",
          header: "Patient",
          render: (transfert) => {
            if (transfert.patient) {
              return `${transfert.patient.prenom} ${transfert.patient.nom}`;
            }
            return transfert.patientId || "Non assigné";
          },
        },
        {
          key: "dateTransfert",
          header: "Date",
          render: (transfert) => formatDate(transfert.dateTransfert),
        },
        {
          key: "serviceDepartId",
          header: "Service départ",
          render: (transfert) => {
            if (transfert.serviceDepart) {
              return transfert.serviceDepart.nom;
            }
            return transfert.serviceDepartId || "Non renseigné";
          },
        },
        {
          key: "serviceArriveeId",
          header: "Service arrivée",
          render: (transfert) => {
            if (transfert.serviceArrivee) {
              return transfert.serviceArrivee.nom;
            }
            return transfert.serviceArriveeId || "Non renseigné";
          },
        },
        {
          key: "etablissementDepartId",
          header: "Établissement départ",
          render: (transfert) => {
            if (transfert.etablissementDepart) {
              return transfert.etablissementDepart.nom;
            }
            return transfert.etablissementDepartId || "Non renseigné";
          },
        },
        {
          key: "etablissementArriveeId",
          header: "Établissement arrivée",
          render: (transfert) => {
            if (transfert.etablissementArrivee) {
              return transfert.etablissementArrivee.nom;
            }
            return transfert.etablissementArriveeId || "Non renseigné";
          },
        },
        {
          key: "statut",
          header: "Statut",
          render: (transfert) => {
            const now = new Date();
            const transfertDate = new Date(transfert.dateTransfert);

            let status =
              transfert.statut ||
              (transfertDate > now ? "Planifié" : "Effectué");
            let statusClass = "bg-gray-100 text-gray-800";

            if (status === "Effectué")
              statusClass = "bg-green-100 text-green-800";
            else if (status === "Planifié")
              statusClass = "bg-blue-100 text-blue-800";
            else if (status === "En cours")
              statusClass = "bg-yellow-100 text-yellow-800";
            else if (status === "Annulé")
              statusClass = "bg-red-100 text-red-800";

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
          key: "raison",
          header: "Motif",
          render: (transfert) =>
            truncateText(transfert.raison || "Non spécifié", 40),
        },
      ]}
    />
  );
};

export default TransfertsPage;
