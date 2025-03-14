import React from "react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface PriseEnCharge {
  id: string;
  patientId: string;
  patient?: Patient;
}

interface PersonnelPatientsTabProps {
  prisesEnCharge: PriseEnCharge[];
  personnelId: string;
}

const PersonnelPatientsTab: React.FC<PersonnelPatientsTabProps> = ({
  prisesEnCharge,
  personnelId,
}) => {
  if (prisesEnCharge.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID de suivi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prisesEnCharge.map((prise) => (
              <tr key={prise.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                  {prise.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {prise.patient ? (
                    <Link
                      to={`/patients/${prise.patientId}`}
                      className="flex items-center text-blue-600 hover:text-blue-900"
                    >
                      <span className="font-medium">
                        {prise.patient.nom} {prise.patient.prenom}
                      </span>
                    </Link>
                  ) : (
                    <span className="text-gray-500">
                      Patient ID: {prise.patientId}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <Link
                      to={`/prises-en-charge/${prise.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/patients/${prise.patientId}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Dossier patient
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-center">
          <Link
            to={`/prises-en-charge/create?personnelId=${personnelId}`}
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
        <p className="text-xl font-medium mb-2">Aucun patient suivi</p>
        <p className="mb-6">
          Ce membre du personnel ne suit actuellement aucun patient.
        </p>
        <Link
          to={`/prises-en-charge/create?personnelId=${personnelId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Ajouter une prise en charge
        </Link>
      </div>
    );
  }
};

export default PersonnelPatientsTab;
