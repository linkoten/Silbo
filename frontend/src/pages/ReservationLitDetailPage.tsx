import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";
import { formatDate } from "../utils/formatUtils";

const ReservationLitDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="reservationLit"
      pluralName="reservationsLit"
      apiEndpoint="/reservationsLit"
      title={(reservation) => `Réservation de lit: ${reservation.id}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "litId", label: "Identifiant du lit" },
        { key: "patientId", label: "Identifiant du patient" },
        {
          key: "dateDepart",
          label: "Date de départ",
          render: (value) => formatDate(value),
        },
        {
          key: "dateArrivee",
          label: "Date d'arrivée",
          render: (value) => formatDate(value),
        },
        {
          key: "etablissementDestinationId",
          label: "Identifiant de l'établissement de destination",
        },
      ]}
    />
  );
};

export default ReservationLitDetailPage;
