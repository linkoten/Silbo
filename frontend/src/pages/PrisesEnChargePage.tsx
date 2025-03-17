import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, truncateText } from "../utils/formatUtils";
import {
  usePriseEnChargeStore,
  PriseEnChargeWithRelations,
} from "@/stores/prise-en-charge-store";
import { useToast } from "@/components/ui/use-toast";

const PrisesEnChargePage: React.FC = () => {
  // Utiliser le store prise en charge
  const {
    prisesEnCharge,
    isLoading,
    error,
    fetchPrisesEnCharge,
    deletePriseEnCharge,
  } = usePriseEnChargeStore();

  const { toast } = useToast();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPrisesEnCharge, setFilteredPrisesEnCharge] = useState<
    PriseEnChargeWithRelations[]
  >([]);

  // Charger les prises en charge au montage du composant
  useEffect(() => {
    fetchPrisesEnCharge();
  }, [fetchPrisesEnCharge]);

  // Mettre à jour les prises en charge filtrées lorsque la recherche ou les données changent
  useEffect(() => {
    if (!prisesEnCharge) return;

    if (searchTerm === "") {
      setFilteredPrisesEnCharge(prisesEnCharge);
    } else {
      const filtered = prisesEnCharge.filter((pec) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          pec.patient?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          pec.patient?.prenom?.toLowerCase().includes(searchLower) ||
          false ||
          pec.personnel?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          pec.personnel?.prenom?.toLowerCase().includes(searchLower) ||
          false ||
          pec.diagnostic?.toLowerCase().includes(searchLower) ||
          false ||
          pec.traitement?.toLowerCase().includes(searchLower) ||
          false
        );
      });
      setFilteredPrisesEnCharge(filtered);
    }
  }, [searchTerm, prisesEnCharge]);

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette prise en charge ?"
      )
    ) {
      try {
        const success = await deletePriseEnCharge(id);
        if (success) {
          toast({
            title: "Succès",
            description: "La prise en charge a été supprimée avec succès",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la prise en charge",
          variant: "destructive",
        });
      }
    }
  };

  // Rendu pour l'état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des prises en charge...
          </span>
        </div>
      </div>
    );
  }

  // Rendu pour l'état d'erreur
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchPrisesEnCharge()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  console.log("filteredPrisesEnCharge", filteredPrisesEnCharge);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prises en charge</h1>
        <Link
          to="/prisesEnCharge/create"
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
          Nouvelle prise en charge
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par patient, personnel, diagnostic..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPrisesEnCharge.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">
            Aucune prise en charge disponible
          </p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Modifiez votre recherche ou " : ""}
            Ajoutez une prise en charge pour commencer
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnostic
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Traitement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrisesEnCharge.map((pec) => {
                const isActive =
                  !pec.dateFin || new Date(pec.dateFin) > new Date();
                const status = isActive ? "En cours" : "Terminée";
                const statusClass = isActive
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800";

                return (
                  <tr key={pec.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.patient ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {pec.patient.nom} {pec.patient.prenom}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          ID: {pec.patientId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.personnel ? (
                        <div>
                          <div className="font-medium text-gray-900">
                            {pec.personnel.nom} {pec.personnel.prenom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {pec.personnel.profession}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          ID: {pec.personnelId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(pec.dateDebut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.dateFin ? (
                        formatDate(pec.dateFin)
                      ) : (
                        <span className="text-green-500">En cours</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {truncateText(pec.diagnostic || "Non renseigné", 50)}
                    </td>
                    <td className="px-6 py-4">
                      {truncateText(pec.traitement || "Non renseigné", 50)}
                    </td>
                    <td className="px-6 py-4">
                      {truncateText(pec.description || "Non renseignée", 50)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/prisesEnCharge/${pec.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Détails
                      </Link>
                      <Link
                        to={`/prisesEnCharge/edit/${pec.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(pec.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrisesEnChargePage;
