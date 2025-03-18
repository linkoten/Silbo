import { Personnel, Service } from "@/types/types";
import React from "react";
import { Link } from "react-router-dom";

interface PersonnelDetailsTabProps {
  personnel: Personnel;
  service?: Service;
}

const PersonnelDetailsTab: React.FC<PersonnelDetailsTabProps> = ({
  personnel,
  service,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Informations personnelles
        </h2>

        <dl className="grid grid-cols-1 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Nom complet</dt>
            <dd className="mt-1 text-lg text-gray-900 font-medium">
              {personnel.prenom} {personnel.nom}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Profession</dt>
            <dd className="mt-1 text-gray-900">{personnel.profession}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Identifiant</dt>
            <dd className="mt-1 text-gray-400 text-sm font-mono">
              {personnel.id}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Service d'affectation
        </h2>

        <div className="flex flex-col h-full">
          {service ? (
            <div>
              <div className="flex items-center mb-4">
                <span className="inline-block p-3 bg-green-100 text-green-700 rounded-full mr-4">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </span>
                <div>
                  <p className="text-gray-900 font-medium text-lg">
                    {service.nom}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <Link
                  to={`/services/${personnel.serviceId}`}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Voir les détails du service
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500">Aucun service associé</p>
              <div className="mt-3">
                <p className="text-sm text-gray-400">
                  ID: {personnel.serviceId || "Non défini"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetailsTab;
