import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Transfert } from "../../../backend/schema";

const TransfertsPage: React.FC = () => {
  const [transferts, setTransferts] = useState<Transfert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransferts = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/transferts");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: Transfert[] = await response.json();
        setTransferts(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchTransferts();
  }, []);

  if (loading) return <div>Chargement des transferts...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Transferts</h1>
        <Link
          to="/transferts/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un transfert
        </Link>
      </div>

      {transferts.length === 0 ? (
        <p>Aucun transfert trouvé.</p>
      ) : (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nom</th>
                <th className="py-3 px-6 text-left">Prénom</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {transferts.map((transfert) => (
                <tr
                  key={transfert.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {transfert.id}
                  </td>
                  <td className="py-3 px-6 text-left">{transfert.id}</td>
                  <td className="py-3 px-6 text-left">{transfert.patientId}</td>
                  <td className="py-3 px-6 text-left">
                    {transfert.serviceDepartId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {transfert.serviceArriveeId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {transfert.etablissementDepartId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {transfert.etablissementArriveeId}
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

export default TransfertsPage;

//                   <td className="py-3 px-6 text-left">{transfert.dateTransfert}</td>
