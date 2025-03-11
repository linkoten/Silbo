import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";
import { formatDate } from "../utils/formatUtils";

const TransfertDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="transfert"
      pluralName="transferts"
      apiEndpoint="/transferts"
      title={(transfert) => `Transfert: ${transfert.id}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "patientId", label: "Identifiant du patient" },
        { key: "serviceDepartId", label: "Service de départ" },
        { key: "serviceArriveeId", label: "Service d'arrivée" },
        { key: "etablissementDepartId", label: "Établissement de départ" },
        { key: "etablissementArriveeId", label: "Établissement d'arrivée" },
        {
          key: "dateTransfert",
          label: "Date de transfert",
          render: (value) => formatDate(value),
        },
      ]}
    />
  );
};

export default TransfertDetailPage;
