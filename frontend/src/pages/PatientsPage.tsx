import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { usePatientStore } from "@/stores/patient-store";

const PatientsPage: React.FC = () => {
  // Utiliser le store Zustand pour gérer l'état des patients
  const { patients, isLoading, error, fetchPatients, deletePatient } =
    usePatientStore();

  // Charger les données au montage du composant
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Fonction pour générer les badges de statut
  const getStatusBadge = (status: string) => {
    let statusClass = "bg-gray-100 text-gray-800";

    if (status === "Hospitalisé") {
      statusClass = "bg-green-100 text-green-800";
    } else if (status === "Sortant") {
      statusClass = "bg-yellow-100 text-yellow-800";
    } else if (status === "Sorti") {
      statusClass = "bg-blue-100 text-blue-800";
    }

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
        {status}
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
            Chargement des patients...
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
          onClick={() => fetchPatients()}
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
        <h1 className="text-2xl font-bold">Gestion des Patients</h1>
        <Link
          to="/patients/create"
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
          Ajouter un patient
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucun patient disponible</p>
          <p className="text-gray-500 mt-2">
            Ajoutez un patient pour commencer
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
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de naissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {patient.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{patient.prenom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {formatDate(patient.dateNaissance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(patient.statut!)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{patient.telephone || "Non renseigné"}</div>
                    <div className="text-xs">{patient.email || "-"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/patients/${patient.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/patients/edit/${patient.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Êtes-vous sûr de vouloir supprimer ce patient ?"
                          )
                        ) {
                          deletePatient(patient.id);
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

export default PatientsPage;
