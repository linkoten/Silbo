import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReservationLit } from "../../../backend/schema";

const ReservationsLitPage: React.FC = () => {
  const [reservationsLit, setReservationsLit] = useState<ReservationLit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationsLit = async (): Promise<void> => {
      try {
        const response = await fetch("http://localhost:3000/reservationsLit");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: ReservationLit[] = await response.json();
        setReservationsLit(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchReservationsLit();
  }, []);

  if (loading) return <div>Chargement des reservationsLit...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des ReservationsLit</h1>
        <Link
          to="/reservationsLit/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un reservationLit
        </Link>
      </div>

      {reservationsLit.length === 0 ? (
        <p>Aucun reservationLit trouvé.</p>
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
              {reservationsLit.map((reservationLit) => (
                <tr
                  key={reservationLit.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {reservationLit.id}
                  </td>
                  <td className="py-3 px-6 text-left">{reservationLit.id}</td>
                  <td className="py-3 px-6 text-left">
                    {reservationLit.litId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {reservationLit.patientId}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {reservationLit.etablissementDestinationId}
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

export default ReservationsLitPage;

//                   <td className="py-3 px-6 text-left">{reservationLit.dateDepart}</td>
// <td className="py-3 px-6 text-left">{reservationLit.dateArrivee}</td>
