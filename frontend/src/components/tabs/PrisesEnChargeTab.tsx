import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PriseEnCharge, Personnel, Service } from "@/types/types";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";

interface ExtendedPriseEnCharge extends PriseEnCharge {
  personnel?: Personnel & { service?: Service };
}

interface PrisesEnChargeTabProps {
  patientId: string;
  prisesEnCharge: ExtendedPriseEnCharge[];
}

const PrisesEnChargeTab: React.FC<PrisesEnChargeTabProps> = ({
  patientId,
  prisesEnCharge,
}) => {
  const { completePriseEnCharge, deletePriseEnCharge } =
    usePriseEnChargeStore();
  const [notes, setNotes] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const handleComplete = async (id: string) => {
    try {
      await completePriseEnCharge(id, notes);
      setActiveId(null);
      setNotes("");
    } catch (error) {
      alert("Erreur lors de la complétion de la prise en charge");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette prise en charge ?"
      )
    ) {
      try {
        await deletePriseEnCharge(id);
      } catch (error) {
        alert("Erreur lors de la suppression de la prise en charge");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Prises en charge du patient</h3>
        <Link
          to={`/prises-en-charge/create?patientId=${patientId}`}
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
        >
          Nouvelle prise en charge
        </Link>
      </div>

      {prisesEnCharge.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Aucune prise en charge pour ce patient
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel soignant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de fin
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
              {prisesEnCharge.map((pec) => {
                const isOngoing =
                  !pec.dateFin || new Date(pec.dateFin) > new Date();

                return (
                  <tr
                    key={pec.id}
                    className={`hover:bg-gray-50 ${
                      isOngoing ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.personnel ? (
                        <div>
                          <div>
                            {pec.personnel.nom} {pec.personnel.prenom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {pec.personnel.profession}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          Personnel ID: {pec.personnelId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.personnel?.service ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {pec.personnel.service.nom}
                        </span>
                      ) : (
                        <span className="text-gray-400">Non assigné</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {formatDate(pec.dateDebut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pec.dateFin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
                          {formatDate(pec.dateFin)}
                        </span>
                      ) : (
                        <span className="text-gray-500">En cours</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${
                          isOngoing
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isOngoing ? "En cours" : "Terminée"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/prises-en-charge/${pec.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Détails
                        </Link>
                        <Link
                          to={`/prises-en-charge/edit/${pec.id}`}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          Modifier
                        </Link>
                        {isOngoing && (
                          <button
                            onClick={() => setActiveId(pec.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Terminer
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(pec.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>

                      {/* Modal pour terminer une prise en charge */}
                      {activeId === pec.id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-xl font-medium mb-4">
                              Terminer la prise en charge
                            </h3>
                            <textarea
                              className="w-full border border-gray-300 rounded p-2 mb-4"
                              rows={3}
                              placeholder="Notes de clôture (optionnel)"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setActiveId(null);
                                  setNotes("");
                                }}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleComplete(pec.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                              >
                                Terminer
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Link
          to={`/prises-en-charge/create?patientId=${patientId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Ajouter une prise en charge
        </Link>
      </div>
    </div>
  );
};

export default PrisesEnChargeTab;
