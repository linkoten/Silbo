import React from "react";
import { Link } from "react-router-dom";

interface PriseEnCharge {
  id: string;
  patientId: string;
  personnelId: string;
  dateDebut: string;
  dateFin?: string;
  description?: string;
  diagnostic?: string;
  traitement?: string;
  notes?: string;
  personnel?: {
    id: string;
    nom: string;
    prenom: string;
    profession: string;
  };
}

interface PrisesEnChargeTabProps {
  prisesEnCharge: PriseEnCharge[];
  patientId: string;
}

const PrisesEnChargeTab: React.FC<PrisesEnChargeTabProps> = ({
  prisesEnCharge,
  patientId,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const isOngoing = (pec: PriseEnCharge) => {
    return !pec.dateFin || new Date(pec.dateFin) > new Date();
  };

  if (prisesEnCharge.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personnel soignant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de début
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de fin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prisesEnCharge.map((pec) => (
              <tr
                key={pec.id}
                className={`hover:bg-gray-50 ${
                  isOngoing(pec) ? "bg-green-50" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {pec.personnel ? (
                    <div>
                      <div>
                        {pec.personnel.nom} {pec.personnel.prenom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {pec.personnel.profession}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      Personnel ID: {pec.personnelId}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    {formatDate(pec.dateDebut)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pec.dateFin ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                      {formatDate(pec.dateFin)}
                    </span>
                  ) : (
                    <span className="text-gray-500">En cours</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      isOngoing(pec)
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {isOngoing(pec) ? "En cours" : "Terminée"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/prises-en-charge/${pec.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Détails
                  </Link>
                  <Link
                    to={`/prises-en-charge/edit/${pec.id}`}
                    className="text-amber-600 hover:text-amber-900"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center">
          <Link
            to={`/prises-en-charge/create?patientId=${patientId}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Ajouter une prise en charge
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
        <p className="text-xl font-medium mb-2">Aucune prise en charge</p>
        <p className="mb-6">
          Ce patient n'a pas encore de prises en charge enregistrées.
        </p>
        <Link
          to={`/prises-en-charge/create?patientId=${patientId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Ajouter une prise en charge
        </Link>
      </div>
    );
  }
};

export default PrisesEnChargeTab;
