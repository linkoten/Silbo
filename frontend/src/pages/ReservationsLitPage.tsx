import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate } from "../utils/formatUtils";

const ReservationsLitPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="reservationLit"
      pluralName="reservationsLit"
      apiEndpoint="/reservationsLit"
      columns={[
        { key: "id", header: "ID" },
        { key: "litId", header: "Lit ID" },
        { key: "patientId", header: "Patient ID" },
        {
          key: "dateDepart",
          header: "Date de départ",
          render: (reservationLit) => formatDate(reservationLit.dateDepart),
        },
        {
          key: "dateArrivee",
          header: "Date d'arrivée",
          render: (reservationLit) => formatDate(reservationLit.dateArrivee),
        },
        {
          key: "etablissementDestinationId",
          header: "Établissement Destination ID",
        },
      ]}
    />
  );
};

export default ReservationsLitPage;
