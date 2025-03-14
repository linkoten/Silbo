import React from "react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface Lit {
  id: string;
  numeroLit: string;
  serviceId: string;
}

interface Service {
  id: string;
  nom: string;
}

interface ReservationRelatedTabProps {
  patient?: Patient;
  patientId: string;
  lit?: Lit;
  litId: string;
  service?: Service;
}

const ReservationRelatedTab: React.FC<ReservationRelatedTabProps> = ({
  patient,
  patientId,
  lit,
  litId,
  service,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Information sur le patient */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Patient</h2>

        {patient ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700">
                {patient.prenom.charAt(0)}
                {patient.nom.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">
                  {patient.prenom} {patient.nom}
                </h3>
                <Link
                  to={`/patients/${patient.id}`}
                  className="text-blue-600 hover:underline inline-flex items-center mt-1"
                >
                  Voir le dossier complet
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="flex justify-center mt-4 space-x-4">
              <Link
                to={`/transferts/create?patientId=${patient.id}`}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Créer un transfert
              </Link>
              <Link
                to={`/prises-en-charge/create?patientId=${patient.id}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Ajouter une prise en charge
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
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
            <p className="mb-2">Information patient non disponible</p>
            <p className="text-sm font-mono">ID: {patientId}</p>
          </div>
        )}
      </div>

      {/* Information sur le lit */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Lit assigné
        </h2>

        {lit ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-10 h-10 text-green-700"
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
                <h3 className="text-xl font-medium">Lit n°{lit.numeroLit}</h3>
                {service && (
                  <p className="text-gray-600">Service: {service.nom}</p>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-1 gap-y-4 mt-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-gray-900">
                  {service ? (
                    <Link
                      to={`/services/${service.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {service.nom}
                    </Link>
                  ) : (
                    <span className="text-gray-500">ID: {lit.serviceId}</span>
                  )}
                </dd>
              </div>

              <div className="flex justify-center mt-4">
                <Link
                  to={`/lits/${litId}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Voir les détails du lit
                </Link>
              </div>
            </dl>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <p className="mb-2">Information sur le lit non disponible</p>
            <p className="text-sm font-mono">ID: {litId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationRelatedTab;
