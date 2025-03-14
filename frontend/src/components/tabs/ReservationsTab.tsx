import React from "react";
import { Link } from "react-router-dom";

interface Reservation {
  id: string;
  patientId: string;
  litId: string;
  dateArrivee: string;
  dateDepart: string;
  etablissementDestinationId?: string;
  patient?: {
    id: string;
    nom: string;
    prenom: string;
  };
  lit?: {
    id: string;
    numeroLit: string;
    serviceId: string;
    chambre?: string;
  };
  service?: {
    id: string;
    nom: string;
  };
}

interface ReservationsTabProps {
  reservations: Reservation[];
  litId?: string; // Ajout du paramètre litId optionnel
}

const ReservationsTab: React.FC<ReservationsTabProps> = ({
  reservations,
  litId,
}) => {
  if (reservations.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lit / Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'arrivée
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de départ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((reservation) => {
              // Formater les dates pour l'affichage
              const dateArrivee = new Date(reservation.dateArrivee);
              const dateDepart = new Date(reservation.dateDepart);
              const formattedDateArrivee = new Intl.DateTimeFormat(
                "fr-FR"
              ).format(dateArrivee);
              const formattedDateDepart = new Intl.DateTimeFormat(
                "fr-FR"
              ).format(dateDepart);

              // Calculer si la réservation est en cours
              const now = new Date();
              const isActive = dateArrivee <= now && dateDepart >= now;

              return (
                <tr
                  key={reservation.id}
                  className={`hover:bg-gray-50 ${
                    isActive ? "bg-green-50" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.patient ? (
                      <Link
                        to={`/patients/${reservation.patient.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {reservation.patient.nom} {reservation.patient.prenom}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Patient inconnu</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reservation.lit ? (
                      <div>
                        <div>
                          {reservation.lit.numeroLit}{" "}
                          {reservation.lit.chambre
                            ? `- Chambre ${reservation.lit.chambre}`
                            : ""}
                        </div>
                        {reservation.service && (
                          <div className="text-xs text-gray-500">
                            {reservation.service.nom}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Lit inconnu</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                      {formattedDateArrivee}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                      {formattedDateDepart}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/reservations-lits/${reservation.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/reservations-lits/edit/${reservation.id}`}
                      className="text-amber-600 hover:text-amber-900"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center">
          <Link
            to={
              litId
                ? `/reservations-lits/create?litId=${litId}`
                : `/reservations-lits/create`
            }
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Créer une nouvelle réservation
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-center py-10 text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <p className="text-xl font-medium mb-2">Aucune réservation</p>
        <p className="mb-6">
          {litId ? "Ce lit" : "Cet établissement"} n'a pas encore de
          réservations.
        </p>
        <Link
          to={
            litId
              ? `/reservations-lits/create?litId=${litId}`
              : `/reservations-lits/create`
          }
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Créer une réservation
        </Link>
      </div>
    );
  }
};

export default ReservationsTab;
