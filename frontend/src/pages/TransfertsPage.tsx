import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, truncateText } from "../utils/formatUtils";
import { useTransfertStore } from "@/stores/transfert-store";
import { TransfertWithRelations } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";

const TransfertsPage: React.FC = () => {
  // Utiliser le store transfert
  const {
    transferts,
    isLoading,
    error,
    fetchTransferts,
    deleteTransfert,
    validateTransfert,
  } = useTransfertStore();

  const { toast } = useToast();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredTransferts, setFilteredTransferts] = useState<
    TransfertWithRelations[]
  >([]);

  // Charger les transferts au montage du composant
  useEffect(() => {
    fetchTransferts();
  }, [fetchTransferts]);

  // Mettre à jour les transferts filtrés lorsque la recherche ou les données changent
  useEffect(() => {
    if (!transferts) return;

    if (searchTerm === "") {
      setFilteredTransferts(transferts);
    } else {
      const filtered = transferts.filter((transfert) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          transfert.patient?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          transfert.patient?.prenom?.toLowerCase().includes(searchLower) ||
          false ||
          transfert.serviceDepart?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          transfert.serviceArrivee?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          transfert.motif?.toLowerCase().includes(searchLower) ||
          false
        );
      });
      setFilteredTransferts(filtered);
    }
  }, [searchTerm, transferts]);

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce transfert ?")) {
      try {
        const success = await deleteTransfert(id);
        if (success) {
          toast({
            title: "Succès",
            description: "Le transfert a été supprimé avec succès",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le transfert",
          variant: "destructive",
        });
      }
    }
  };

  // Fonction pour la validation d'un transfert
  const handleValidate = async (id: string) => {
    if (window.confirm("Voulez-vous valider ce transfert ?")) {
      try {
        const success = await validateTransfert(id);
        if (success) {
          toast({
            title: "Succès",
            description: "Le transfert a été validé avec succès",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de valider le transfert",
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
            Chargement des transferts...
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
          onClick={() => fetchTransferts()}
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
        <h1 className="text-2xl font-bold">Transferts de patients</h1>
        <Link
          to="/transferts/create"
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
          Nouveau transfert
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par patient, service, motif..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTransferts.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucun transfert disponible</p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Modifiez votre recherche ou " : ""}
            Créez un nouveau transfert pour commencer
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
                  Motif
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransferts.map((transfert) => {
                // Déterminer le statut à afficher et sa classe CSS
                const now = new Date();
                const transfertDate = new Date(transfert.date);

                let status =
                  transfert.statut ||
                  (transfertDate > now ? "Planifié" : "Effectué");
                let statusClass = "bg-gray-100 text-gray-800";

                if (status === "Validé")
                  statusClass = "bg-green-100 text-green-800";
                else if (status === "Planifié")
                  statusClass = "bg-blue-100 text-blue-800";
                else if (status === "En cours")
                  statusClass = "bg-yellow-100 text-yellow-800";
                else if (status === "Annulé")
                  statusClass = "bg-red-100 text-red-800";

                return (
                  <tr key={transfert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfert.patient ? (
                        <Link
                          to={`/patients/${transfert.patientId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {transfert.patient.nom} {transfert.patient.prenom}
                        </Link>
                      ) : (
                        <span className="text-gray-500">
                          ID: {transfert.patientId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(transfert.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transfert.serviceArrivee ? (
                        <Link
                          to={`/services/${transfert.serviceArriveeId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {transfert.serviceArrivee.nom}
                        </Link>
                      ) : (
                        <span className="text-gray-500">
                          ID: {transfert.serviceArriveeId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {truncateText(transfert.motif || "Non spécifié", 30)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/transferts/${transfert.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Détails
                      </Link>
                      <Link
                        to={`/transferts/edit/${transfert.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Modifier
                      </Link>
                      {status !== "Validé" && (
                        <button
                          onClick={() => handleValidate(transfert.id)}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Valider
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(transfert.id)}
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

export default TransfertsPage;
