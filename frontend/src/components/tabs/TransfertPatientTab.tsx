import React from "react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface TransfertPatientTabProps {
  patient?: Patient;
  patientId: string;
}

const TransfertPatientTab: React.FC<TransfertPatientTabProps> = ({
  patient,
  patientId,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">
        Informations du patient
      </h2>

      {patient ? (
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 mr-8 mb-6 md:mb-0 mx-auto md:mx-0">
            {patient.prenom.charAt(0)}
            {patient.nom.charAt(0)}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-medium mb-4">
              {patient.prenom} {patient.nom}
            </h3>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-600">
                Ce transfert a été effectué pour le patient ci-dessus. Vous
                pouvez accéder à son dossier complet pour voir ses antécédents
                médicaux, ses traitements en cours et son historique
                hospitalier.
              </p>
            </div>

            <div className="space-x-4">
              <Link
                to={`/patients/${patientId}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Voir le dossier patient
              </Link>

              <Link
                to={`/transferts/create?patientId=${patientId}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                Nouveau transfert
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <svg
            className="w-20 h-20 mb-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-xl font-medium mb-4">
            Information patient non disponible
          </p>
          <p className="mb-6">
            Les détails du patient associé à ce transfert ne sont pas
            accessibles.
          </p>
          <p className="text-sm font-mono mb-6">
            Identifiant patient: {patientId}
          </p>

          <Link
            to="/patients"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Rechercher un patient
          </Link>
        </div>
      )}
    </div>
  );
};

export default TransfertPatientTab;
