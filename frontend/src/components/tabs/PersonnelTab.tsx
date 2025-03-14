import React from "react";
import { Link } from "react-router-dom";

interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
  etablissementId: string;
  serviceId?: string;
}

interface Service {
  id: string;
  nom: string;
}

interface PersonnelTabProps {
  personnels: Personnel[];
  services: Service[];
  etablissementId: string;
}

const PersonnelTab: React.FC<PersonnelTabProps> = ({
  personnels,
  services,
  etablissementId,
}) => {
  if (personnels.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profession
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {personnels.map((personnel) => (
              <tr key={personnel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{personnel.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {personnel.prenom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {personnel.profession}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {personnel.serviceId ? (
                    <Link
                      to={`/services/${personnel.serviceId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {services.find((s) => s.id === personnel.serviceId)
                        ?.nom || "Service"}
                    </Link>
                  ) : (
                    <span className="text-gray-500">Non assigné</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/personnels/${personnel.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Détails
                  </Link>
                  <Link
                    to={`/personnels/edit/${personnel.id}`}
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
            to={`/personnels/create?etablissementId=${etablissementId}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Ajouter du personnel
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
        <p className="text-xl font-medium mb-2">Aucun personnel</p>
        <p className="mb-6">
          Cet établissement n'a pas encore de personnel enregistré.
        </p>
        <Link
          to={`/personnels/create?etablissementId=${etablissementId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Ajouter du personnel
        </Link>
      </div>
    );
  }
};

export default PersonnelTab;
