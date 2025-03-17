import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../utils/formatUtils";
import { useServiceStore } from "@/stores/service-store";

const ServicesPage: React.FC = () => {
  // Use the service store instead of direct API calls
  const { services, isLoading, error, fetchServices, deleteService } =
    useServiceStore();

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service?")) {
      deleteService(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des services...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchServices()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Services</h1>
        <Link
          to="/services/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Ajouter un service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucun service disponible</p>
          <p className="text-gray-500 mt-2">
            Ajoutez un service pour commencer
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {service.nom}
                    </div>
                    <div className="text-sm text-gray-500">
                      {truncateText(service.description || "", 30)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.etablissementId ? (
                      <Link
                        to={`/etablissements/${service.etablissementId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {service.etablissementId}
                      </Link>
                    ) : (
                      <span className="text-gray-500">
                        ID: {service.etablissementId}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {service.capacite} lits
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {service.etage ? `Étage ${service.etage}` : ""}
                    {service.aile ? `, Aile ${service.aile}` : ""}
                    {!service.etage && !service.aile ? "Non spécifié" : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.specialite ? (
                      <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {service.specialite}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                        service.statut === "Actif"
                          ? "bg-green-100 text-green-800"
                          : service.statut === "En maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {service.statut || "Actif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/services/${service.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/services/edit/${service.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
