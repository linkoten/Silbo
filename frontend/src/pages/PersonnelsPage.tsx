import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Personnel } from "../../../backend/schema";

const PersonnelsPage: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonnels = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/personnels");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: Personnel[] = await response.json();
        setPersonnels(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchPersonnels();
  }, []);

  if (loading) return <div>Chargement des personnels...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Personnels</h1>
        <Link
          to="/personnels/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un personnel
        </Link>
      </div>

      {personnels.length === 0 ? (
        <p>Aucun personnel trouvé.</p>
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
              {personnels.map((personnel) => (
                <tr
                  key={personnel.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {personnel.id}
                  </td>
                  <td className="py-3 px-6 text-left">{personnel.id}</td>
                  <td className="py-3 px-6 text-left">{personnel.nom}</td>
                  <td className="py-3 px-6 text-left">{personnel.prenom}</td>
                  <td className="py-3 px-6 text-left">
                    {personnel.profession}
                  </td>
                  <td className="py-3 px-6 text-left">{personnel.serviceId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PersonnelsPage;
