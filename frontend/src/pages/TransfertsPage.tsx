import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate } from "../utils/formatUtils";

const TransfertsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="transfert"
      pluralName="transferts"
      apiEndpoint="/transferts"
      columns={[
        { key: "id", header: "ID" },
        { key: "patientId", header: "Patient ID" },
        { key: "serviceDepartId", header: "Service Départ ID" },
        { key: "serviceArriveeId", header: "Service Arrivée ID" },
        { key: "etablissementDepartId", header: "Établissement Départ ID" },
        { key: "etablissementArriveeId", header: "Établissement Arrivée ID" },
        {
          key: "dateTransfert",
          header: "Date de transfert",
          render: (transfert) => formatDate(transfert.dateTransfert),
        },
      ]}
    />
  );
};

export default TransfertsPage;
