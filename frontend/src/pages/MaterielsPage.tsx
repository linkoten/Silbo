import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Materiel } from "../../../backend/schema";

const MaterielsPage: React.FC = () => {
  const [materiels, setMateriels] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMateriels = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/materiels");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: Materiel[] = await response.json();
        setMateriels(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchMateriels();
  }, []);

  if (loading) return <div>Chargement des materiels...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Materiels</h1>
        <Link
          to="/materiels/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un materiel
        </Link>
      </div>

      {materiels.length === 0 ? (
        <p>Aucun materiel trouvé.</p>
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
              {materiels.map((materiel) => (
                <tr
                  key={materiel.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {materiel.id}
                  </td>
                  <td className="py-3 px-6 text-left">{materiel.id}</td>
                  <td className="py-3 px-6 text-left">{materiel.nom}</td>
                  <td className="py-3 px-6 text-left">{materiel.quantite}</td>
                  <td className="py-3 px-6 text-left">
                    {materiel.description}
                  </td>
                  <td className="py-3 px-6 text-left">{materiel.serviceId}</td>
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
