import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/formatUtils";
import { ReservationLit, Patient } from "@/types/types";

// Type étendu pour les réservations avec les détails du patient
interface ExtendedReservationLit extends ReservationLit {
  patient?: Patient;
}

interface ReservationsTabProps {
  reservations: ExtendedReservationLit[];
  litId?: string;
  patientId?: string;
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({
  reservations,
  litId,
  patientId,
}) => {
  // Déterminer le bon lien pour ajouter une réservation
  const getAddReservationLink = () => {
    if (litId) {
      return `/reservations-lits/create?litId=${litId}`;
    } else if (patientId) {
      return `/reservations-lits/create?patientId=${patientId}`;
    }
    return `/reservations-lits/create`;
  };

  // Calculer la durée entre deux dates
  const calculateDuration = (dateDepart: string, dateArrivee: string) => {
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  };

  // Déterminer le statut actuel d'une réservation
  const getReservationStatus = (dateDepart: string, dateArrivee: string) => {
    const now = new Date();
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);

    if (now < start) {
      return { text: "À venir", class: "bg-blue-100 text-blue-800" };
    } else if (now > end) {
      return { text: "Terminée", class: "bg-gray-100 text-gray-800" };
    }
    return { text: "En cours", class: "bg-green-100 text-green-800" };
  };

  // Rendu du composant
  if (reservations.length === 0) {
    return (
      <div className="text-center py-10">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucune réservation
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Il n'y a actuellement aucune réservation pour ce{" "}
          {litId ? "lit" : "patient"}.
        </p>
        <div className="mt-6">
          <Link
            to={getAddReservationLink()}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Ajouter une réservation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mb-6">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {!litId && (
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Lit
                </th>
              )}
              {!patientId && (
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Patient
                </th>
              )}
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Période
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Durée
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th className="relative py-3.5 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {reservations.map((reservation) => {
              const status = getReservationStatus(
                reservation.dateDepart,
                reservation.dateArrivee
              );
              return (
                <tr key={reservation.id}>
                  {!litId && (
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                      {reservation.litId}
                    </td>
                  )}
                  {!patientId && (
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {reservation.patient ? (
                        <Link
                          to={`/patients/${reservation.patient.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {`${reservation.patient.prenom} ${reservation.patient.nom}`}
                        </Link>
                      ) : (
                        reservation.patientId
                      )}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div>Du {formatDate(reservation.dateDepart)}</div>
                    <div>au {formatDate(reservation.dateArrivee)}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {calculateDuration(
                      reservation.dateDepart,
                      reservation.dateArrivee
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${status.class}`}
                    >
                      {status.text}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm">
                    <Link
                      to={`/reservations-lits/${reservation.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center">
        <Link
          to={getAddReservationLink()}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Ajouter une réservation
        </Link>
      </div>
    </div>
  );
};

export default ReservationsTab;
