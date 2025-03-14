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
        {
          key: "patientId",
          header: "Patient",
          render: (reservation) => {
            if (reservation.patient) {
              return `${reservation.patient.prenom} ${reservation.patient.nom}`;
            }
            return reservation.patientId || "Non assigné";
          },
        },
        {
          key: "litId",
          header: "Lit",
          render: (reservation) => {
            if (reservation.lit) {
              return (
                <div>
                  <div>{`N° ${reservation.lit.numeroLit}`}</div>
                  {reservation.lit.chambre && (
                    <div className="text-xs text-gray-500">{`Chambre ${reservation.lit.chambre}`}</div>
                  )}
                </div>
              );
            }
            return reservation.litId || "Non assigné";
          },
        },
        {
          key: "dateDepart",
          header: "Date de départ",
          render: (reservation) => formatDate(reservation.dateDepart),
        },
        {
          key: "dateArrivee",
          header: "Date d'arrivée",
          render: (reservation) => formatDate(reservation.dateArrivee),
        },
        {
          key: "duree",
          header: "Durée du séjour",
          render: (reservation) => {
            const depart = new Date(reservation.dateDepart);
            const arrivee = new Date(reservation.dateArrivee);
            const diffTime = Math.abs(arrivee.getTime() - depart.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
          },
        },
        {
          key: "status",
          header: "Statut",
          render: (reservation) => {
            const now = new Date();
            const depart = new Date(reservation.dateDepart);
            const arrivee = new Date(reservation.dateArrivee);

            let status = "En cours";
            let statusClass = "bg-green-100 text-green-800";

            if (now < depart) {
              status = "À venir";
              statusClass = "bg-blue-100 text-blue-800";
            } else if (now > arrivee) {
              status = "Terminée";
              statusClass = "bg-gray-100 text-gray-800";
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
          key: "raison",
          header: "Motif",
          render: (reservation) => reservation.raison || "Non spécifié",
        },
        {
          key: "etablissementDestinationId",
          header: "Établissement",
          render: (reservation) => {
            if (reservation.etablissementDestination) {
              return reservation.etablissementDestination.nom;
            }
            return reservation.etablissementDestinationId || "Non spécifié";
          },
        },
      ]}
    />
  );
};

export default ReservationsLitPage;
