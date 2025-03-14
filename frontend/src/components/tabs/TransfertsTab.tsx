import React from "react";
import { Link } from "react-router-dom";

interface Transfert {
  id: string;
  patientId: string;
  date: string;
  serviceDepartId: string;
  serviceArriveeId: string;
  motif: string | null;
  statut: string;
  autorisePar?: string;
  realiseePar?: string;
  serviceDepartNom?: string;
  serviceArriveeNom?: string;
}

interface TransfertsTabProps {
  transferts: Transfert[];
  patientId: string;
}

const TransfertsTab: React.FC<TransfertsTabProps> = ({
  transferts,
  patientId,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  if (transferts.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service départ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service arrivée
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
            {transferts.map((transfert) => (
              <tr key={transfert.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(transfert.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transfert.serviceDepartNom || (
                    <span className="text-gray-500">
                      ID: {transfert.serviceDepartId}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {transfert.serviceArriveeNom || (
                    <span className="text-gray-500">
                      ID: {transfert.serviceArriveeId}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      transfert.statut === "Terminé"
                        ? "bg-green-100 text-green-800"
                        : transfert.statut === "En cours"
                        ? "bg-blue-100 text-blue-800"
                        : transfert.statut === "Planifié"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transfert.statut}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/transferts/${transfert.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Détails
                  </Link>
                  <Link
                    to={`/transferts/edit/${transfert.id}`}
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
            to={`/transferts/create?patientId=${patientId}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Créer un nouveau transfert
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
        <p className="text-xl font-medium mb-2">Aucun transfert</p>
        <p className="mb-6">
          Ce patient n'a pas encore de transferts enregistrés.
        </p>
        <Link
          to={`/transferts/create?patientId=${patientId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Créer un transfert
        </Link>
      </div>
    );
  }
};

export default TransfertsTab;
