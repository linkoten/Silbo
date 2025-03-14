import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";

interface TransfertDetail {
  id: string;
  dateTransfert: string;
  serviceDepartId: string;
  serviceArriveeId: string;
  etablissementDepartId: string;
  etablissementArriveeId: string;
  etablissementDepart?: {
    id: string;
    nom: string;
  };
  etablissementArrivee?: {
    id: string;
    nom: string;
  };
  serviceDepart?: {
    id: string;
    nom: string;
  };
  serviceArrivee?: {
    id: string;
    nom: string;
  };
}

interface TransfertDetailsTabProps {
  transfert: TransfertDetail;
}

const TransfertDetailsTab: React.FC<TransfertDetailsTabProps> = ({
  transfert,
}) => {
  // Déterminer si le transfert est dans le passé ou le futur
  const transfertDate = new Date(transfert.dateTransfert);
  const now = new Date();
  const isTransfertPast = transfertDate < now;
  const transfertStatus = isTransfertPast ? "Effectué" : "Planifié";
  const transfertStatusClass = isTransfertPast
    ? "bg-green-100 text-green-800"
    : "bg-blue-100 text-blue-800";

  return (
    <div className="space-y-8">
      {/* Transfert visuel */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Circuit de transfert
        </h2>

        <div className="my-6">
          <div className="flex flex-col md:flex-row items-center justify-between py-4">
            {/* Établissement/Service de départ */}
            <div className="md:w-5/12 mb-6 md:mb-0 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-blue-100 rounded-full mb-3">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>

                {/* Établissement de départ */}
                <h3 className="text-lg font-semibold">
                  {transfert.etablissementDepart ? (
                    <Link
                      to={`/etablissements/${transfert.etablissementDepartId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {transfert.etablissementDepart.nom}
                    </Link>
                  ) : (
                    <span className="text-gray-500">
                      ID: {transfert.etablissementDepartId}
                    </span>
                  )}
                </h3>

                {/* Service de départ */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">
                    {transfert.serviceDepart ? (
                      <Link
                        to={`/services/${transfert.serviceDepartId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {transfert.serviceDepart.nom}
                      </Link>
                    ) : (
                      <span className="text-gray-500">
                        ID: {transfert.serviceDepartId}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Flèche de transfert */}
            <div className="md:w-2/12 flex justify-center items-center mb-6 md:mb-0">
              <div className="hidden md:block w-full h-1 bg-blue-200 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:hidden">
                <svg
                  className="w-8 h-8 text-blue-500 transform rotate-90"
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
              </div>
            </div>

            {/* Établissement/Service d'arrivée */}
            <div className="md:w-5/12 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-green-100 rounded-full mb-3">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>

                {/* Établissement d'arrivée */}
                <h3 className="text-lg font-semibold">
                  {transfert.etablissementArrivee ? (
                    <Link
                      to={`/etablissements/${transfert.etablissementArriveeId}`}
                      className="text-green-600 hover:underline"
                    >
                      {transfert.etablissementArrivee.nom}
                    </Link>
                  ) : (
                    <span className="text-gray-500">
                      ID: {transfert.etablissementArriveeId}
                    </span>
                  )}
                </h3>

                {/* Service d'arrivée */}
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-medium">
                    {transfert.serviceArrivee ? (
                      <Link
                        to={`/services/${transfert.serviceArriveeId}`}
                        className="text-green-600 hover:underline"
                      >
                        {transfert.serviceArrivee.nom}
                      </Link>
                    ) : (
                      <span className="text-gray-500">
                        ID: {transfert.serviceArriveeId}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informations détaillées */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Informations détaillées
        </h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Date de transfert */}
          <div className="col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Date du transfert
            </dt>
            <dd className="mt-1 text-lg font-medium text-gray-900">
              {formatDate(transfert.dateTransfert)}
            </dd>
          </div>

          {/* Statut */}
          <div className="col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Statut du transfert
            </dt>
            <dd className="mt-1">
              <span
                className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${transfertStatusClass}`}
              >
                {transfertStatus}
              </span>
            </dd>
          </div>

          {/* ID du transfert */}
          <div className="col-span-2">
            <dt className="text-sm font-medium text-gray-500">
              Identifiant du transfert
            </dt>
            <dd className="mt-1 text-sm font-mono text-gray-400">
              {transfert.id}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TransfertDetailsTab;
