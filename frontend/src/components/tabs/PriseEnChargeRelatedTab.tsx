import React from "react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  numeroSecu?: string;
}

interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
  serviceId?: string;
}

interface Service {
  id: string;
  nom: string;
}

interface PriseEnChargeRelatedTabProps {
  patient?: Patient;
  patientId: string;
  personnel?: Personnel;
  personnelId: string;
  service?: Service;
}

const PriseEnChargeRelatedTab: React.FC<PriseEnChargeRelatedTabProps> = ({
  patient,
  patientId,
  personnel,
  personnelId,
  service,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

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
                <p className="text-gray-600">
                  {patient.dateNaissance
                    ? `Né(e) le ${formatDate(patient.dateNaissance)}`
                    : ""}
                </p>
                {patient.numeroSecu && (
                  <p className="text-gray-600 text-sm">
                    N° SS: {patient.numeroSecu}
                  </p>
                )}
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
                to={`/patients/${patient.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Dossier complet
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

      {/* Information sur le personnel */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Personnel soignant
        </h2>

        {personnel ? (
          <div>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                {personnel.prenom.charAt(0)}
                {personnel.nom.charAt(0)}
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-medium">
                  {personnel.prenom} {personnel.nom}
                </h3>
                <p className="text-gray-600 font-medium">
                  {personnel.profession}
                </p>
                {service && (
                  <p className="text-gray-600 text-sm mt-1">
                    Service: {service.nom}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Relation</h4>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Patient
                </span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Soignant
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                to={`/personnels/${personnel.id}`}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Voir la fiche complète
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mb-2">Information personnel non disponible</p>
            <p className="text-sm font-mono">ID: {personnelId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriseEnChargeRelatedTab;
