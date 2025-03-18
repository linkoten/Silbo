import { ReservationLitWithRelations } from "@/stores/reservation-lit-store";
import React from "react";
import { Link } from "react-router-dom";

interface ReservationDetailTabProps {
  reservation: ReservationLitWithRelations;
}

const ReservationDetailTab: React.FC<ReservationDetailTabProps> = ({
  reservation,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  // Calculer la durée entre deux dates
  const getDurationDays = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Déterminer le statut actuel
  const now = new Date();
  const departDate = new Date(reservation.dateDepart);
  const arriveeDate = new Date(reservation.dateArrivee);

  let status = "En cours";
  let statusClass = "bg-green-100 text-green-800";

  if (now < departDate) {
    status = "À venir";
    statusClass = "bg-blue-100 text-blue-800";
  } else if (now > arriveeDate) {
    status = "Terminée";
    statusClass = "bg-gray-100 text-gray-800";
  }

  const duration = getDurationDays(
    reservation.dateDepart,
    reservation.dateArrivee
  );

  return (
    <div className="space-y-8">
      {/* Informations principales */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Informations générales
        </h2>

        <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg mb-6">
          <div>
            <p className="text-sm text-gray-500">Date de départ</p>
            <p className="font-medium">{formatDate(reservation.dateDepart)}</p>
          </div>
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <div>
            <p className="text-sm text-gray-500">Date d'arrivée</p>
            <p className="font-medium">{formatDate(reservation.dateArrivee)}</p>
          </div>
        </div>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Durée du séjour
            </dt>
            <dd className="mt-1 text-lg text-gray-900">
              {duration} jour{duration > 1 ? "s" : ""}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Statut actuel</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${statusClass}`}
              >
                {status}
              </span>
            </dd>
          </div>

          <div className="md:col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Établissement de destination
            </dt>
            <dd className="mt-1">
              {reservation.etablissementDestination ? (
                <Link
                  to={`/etablissements/${reservation.etablissementDestinationId}`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  {reservation.etablissementDestination.nom}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
              ) : (
                <span className="text-gray-500">
                  {reservation.etablissementDestinationId || "Non spécifié"}
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>

      {/* Timeline */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Chronologie de la réservation
        </h2>
        <div className="relative">
          {/* Ligne de temps */}
          <div className="absolute top-5 left-5 h-full w-1 bg-gray-200"></div>

          {/* Point de départ */}
          <div className="relative flex items-center mb-8">
            <div
              className={`z-10 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full ${
                now >= departDate ? "bg-green-500" : "bg-gray-300"
              } shadow`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Départ</h3>
              <time className="block text-sm text-gray-500">
                {formatDate(reservation.dateDepart)}
              </time>
              {now >= departDate && (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  Passé
                </span>
              )}
            </div>
          </div>

          {/* Point d'arrivée */}
          <div className="relative flex items-center">
            <div
              className={`z-10 w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full ${
                now >= arriveeDate
                  ? "bg-green-500"
                  : now >= departDate
                  ? "bg-blue-500"
                  : "bg-gray-300"
              } shadow`}
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">Arrivée</h3>
              <time className="block text-sm text-gray-500">
                {formatDate(reservation.dateArrivee)}
              </time>
              {now >= arriveeDate ? (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                  Passé
                </span>
              ) : now >= departDate ? (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  En cours
                </span>
              ) : (
                <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                  À venir
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailTab;
