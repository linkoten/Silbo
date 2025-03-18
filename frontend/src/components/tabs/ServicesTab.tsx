import { Service } from "@/types/types";
import React from "react";
import { Link } from "react-router-dom";

interface ServicesTabProps {
  services: Service[];
  etablissementId: string;
}

const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  etablissementId,
}) => {
  if (services.length > 0) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{service.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {service.capacite} places
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/services/${service.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        <p className="text-xl font-medium mb-2">Aucun service</p>
        <p className="mb-6">
          Cet établissement n'a pas encore de services enregistrés.
        </p>
        <Link
          to={`/services/create?etablissementId=${etablissementId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Créer un service
        </Link>
      </div>
    );
  }
};

export default ServicesTab;
