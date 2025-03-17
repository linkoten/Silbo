import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { truncateText } from "../utils/formatUtils";
import { useMaterielStore } from "@/stores/materiel-store";

const MaterielsPage: React.FC = () => {
  // Utiliser le store Zustand pour gérer l'état des matériels
  const { materiels, isLoading, error, fetchMateriels } = useMaterielStore();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchMateriels();
  }, [fetchMateriels]);

  // Fonction pour générer les badges de statut
  const getStatusBadge = (status: string) => {
    let badge = "bg-green-100 text-green-800";
    if (status === "En réparation") badge = "bg-yellow-100 text-yellow-800";
    if (status === "Hors service") badge = "bg-red-100 text-red-800";
    if (status === "En commande") badge = "bg-blue-100 text-blue-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
        {status}
      </span>
    );
  };

  // Fonction pour générer les badges de type
  const getTypeBadge = (type: string) => {
    let badge = "bg-gray-100 text-gray-800";
    if (type === "Médical") badge = "bg-blue-100 text-blue-800";
    if (type === "Chirurgical") badge = "bg-green-100 text-green-800";
    if (type === "Diagnostic") badge = "bg-purple-100 text-purple-800";
    if (type === "Mobilier") badge = "bg-yellow-100 text-yellow-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
        {type}
      </span>
    );
  };

  // Affichage de l'état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des matériels...
          </span>
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchMateriels()}
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
        <h1 className="text-2xl font-bold">Gestion des Matériels</h1>
        <Link
          to="/materiels/create"
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
          Ajouter un matériel
        </Link>
      </div>

      {materiels.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucun matériel disponible</p>
          <p className="text-gray-500 mt-2">
            Ajoutez du matériel pour commencer
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
                  Quantité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materiels.map((materiel) => (
                <tr key={materiel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {materiel.nom}
                    </div>
                    {materiel.description && (
                      <div className="text-sm text-gray-500">
                        {truncateText(materiel.description, 30)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`font-medium ${
                        materiel.quantite <= 0
                          ? "text-red-600"
                          : materiel.quantite < 5
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {materiel.quantite}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {materiel.type ? (
                      getTypeBadge(materiel.type)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {materiel.statut ? (
                      getStatusBadge(materiel.statut)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {materiel.serviceId ? (
                      <Link
                        to={`/services/${materiel.serviceId}`}
                        className="text-blue-600 hover:underline"
                      >
                        {materiel.serviceId || `Service #${materiel.serviceId}`}
                      </Link>
                    ) : (
                      <span className="text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/materiels/${materiel.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/materiels/edit/${materiel.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Êtes-vous sûr de vouloir supprimer ce matériel ?"
                          )
                        ) {
                          useMaterielStore
                            .getState()
                            .deleteMateriel(materiel.id);
                        }
                      }}
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

export default MaterielsPage;
