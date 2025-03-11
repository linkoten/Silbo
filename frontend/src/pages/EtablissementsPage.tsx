import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Etablissement } from "../../../backend/schema";

const EtablissementsPage: React.FC = () => {
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEtablissements = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/etablissements");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: Etablissement[] = await response.json();
        setEtablissements(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchEtablissements();
  }, []);

  if (loading) return <div>Chargement des etablissements...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Etablissements</h1>
        <Link
          to="/etablissements/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un etablissement
        </Link>
      </div>

      {etablissements.length === 0 ? (
        <p>Aucun etablissement trouvé.</p>
      ) : (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nom</th>
                <th className="py-3 px-6 text-left">Prénom</th>
                <th className="py-3 px-6 text-left">Adresse</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {etablissements.map((etablissement) => (
                <tr
                  key={etablissement.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {etablissement.id}
                  </td>
                  <td className="py-3 px-6 text-left">{etablissement.id}</td>
                  <td className="py-3 px-6 text-left">{etablissement.nom}</td>
                  <td className="py-3 px-6 text-left">
                    {etablissement.adresse}
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

export default EtablissementsPage;
