import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PriseEnCharge } from "../../../backend/schema";

const PrisesEnChargePage: React.FC = () => {
  const [prisesEnCharge, setPrisesEnCharge] = useState<PriseEnCharge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrisesEnCharge = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/prisesEnCharge");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: PriseEnCharge[] = await response.json();
        setPrisesEnCharge(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchPrisesEnCharge();
  }, []);

  if (loading) return <div>Chargement des prisesEnCharge...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des PrisesEnCharge</h1>
        <Link
          to="/prisesEnCharge/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter une priseEnCharge
        </Link>
      </div>

      {prisesEnCharge.length === 0 ? (
        <p>Aucun priseEnCharge trouvé.</p>
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
              {prisesEnCharge.map((priseEnCharge) => (
                <tr
                  key={priseEnCharge.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {priseEnCharge.id}
                  </td>
                  <td className="py-3 px-6 text-left">{priseEnCharge.id}</td>
                  <td className="py-3 px-6 text-left">
                    {priseEnCharge.patientId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {priseEnCharge.personnelId}
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

export default PrisesEnChargePage;

//                   <td className="py-3 px-6 text-left">{priseEnCharge.datePriseEnCharge}</td>
