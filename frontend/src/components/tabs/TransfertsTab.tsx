import React from "react";
import { Link } from "react-router-dom";
import { Transfert } from "@/types/types";
import { useTransfertStore } from "@/stores/transfert-store";

interface TransfertsTabProps {
  patientId: string;
  transferts: Transfert[];
}

const TransfertsTab: React.FC<TransfertsTabProps> = ({
  patientId,
  transferts,
}) => {
  const { deleteTransfert, validateTransfert } = useTransfertStore();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const handleValidate = async (id: string) => {
    if (window.confirm("Voulez-vous valider ce transfert ?")) {
      try {
        await validateTransfert(id);
      } catch (error) {
        alert("Erreur lors de la validation du transfert");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce transfert ?")) {
      try {
        await deleteTransfert(id);
      } catch (error) {
        alert("Erreur lors de la suppression du transfert");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Transferts du patient</h3>
        <Link
          to={`/transferts/create?patientId=${patientId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
        >
          Nouveau transfert
        </Link>
      </div>

      {transferts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucun transfert pour ce patient</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service départ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service arrivée
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transferts.map((transfert) => (
                <tr key={transfert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transfert.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfert.serviceDepartId ||
                      `Service #${transfert.serviceDepartId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfert.serviceArriveeId ||
                      `Service #${transfert.serviceArriveeId}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        transfert.statut === "Validé"
                          ? "bg-green-100 text-green-800"
                          : transfert.statut === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {transfert.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/transferts/${transfert.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Détails
                    </Link>
                    {transfert.statut !== "Validé" && (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransfertsTab;
