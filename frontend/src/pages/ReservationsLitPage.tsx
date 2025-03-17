import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import { ReservationLitWithRelations } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";

const ReservationsLitPage: React.FC = () => {
  // Utiliser le store reservationLit
  const {
    reservationsLit,
    isLoading,
    error,
    fetchReservationsLit,
    deleteReservationLit,
  } = useReservationLitStore();

  const { toast } = useToast();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredReservations, setFilteredReservations] = useState<
    ReservationLitWithRelations[]
  >([]);

  // Charger les réservations au montage du composant
  useEffect(() => {
    fetchReservationsLit();
  }, [fetchReservationsLit]);

  // Mettre à jour les réservations filtrées lorsque la recherche ou les données changent
  useEffect(() => {
    if (!reservationsLit) return;

    if (searchTerm === "") {
      setFilteredReservations(reservationsLit);
    } else {
      const filtered = reservationsLit.filter((reservation) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          reservation.patient?.nom?.toLowerCase().includes(searchLower) ||
          false ||
          reservation.patient?.prenom?.toLowerCase().includes(searchLower) ||
          false ||
          reservation.lit?.numeroLit?.toLowerCase().includes(searchLower) ||
          false ||
          reservation.etablissementDestination?.nom
            ?.toLowerCase()
            .includes(searchLower) ||
          false
        );
      });
      setFilteredReservations(filtered);
    }
  }, [searchTerm, reservationsLit]);

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      try {
        const success = await deleteReservationLit(id);
        if (success) {
          toast({
            title: "Succès",
            description: "La réservation a été supprimée avec succès",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la réservation",
          variant: "destructive",
        });
      }
    }
  };

  // Calcul de la durée du séjour
  const calculateDuration = (dateDepart: string, dateArrivee: string) => {
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  };

  // Déterminer le statut actuel d'une réservation
  const getReservationStatus = (dateDepart: string, dateArrivee: string) => {
    const now = new Date();
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);

    if (now < start) {
      return { text: "À venir", class: "bg-blue-100 text-blue-800" };
    } else if (now > end) {
      return { text: "Terminée", class: "bg-gray-100 text-gray-800" };
    }
    return { text: "En cours", class: "bg-green-100 text-green-800" };
  };

  // Rendu pour l'état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des réservations...
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
          onClick={() => fetchReservationsLit()}
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
        <h1 className="text-2xl font-bold">Réservations de lits</h1>
        <Link
          to="/reservationsLit/create"
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
          Ajouter une réservation
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par patient, lit, établissement..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredReservations.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucune réservation disponible</p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Modifiez votre recherche ou " : ""}
            Ajoutez une réservation pour commencer
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
                  Lit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de départ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'arrivée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée du séjour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Établissement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map((reservation) => {
                const status = getReservationStatus(
                  reservation.dateDepart,
                  reservation.dateArrivee
                );

                return (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.patient ? (
                        <Link
                          to={`/patients/${reservation.patientId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {reservation.patient.nom} {reservation.patient.prenom}
                        </Link>
                      ) : (
                        <span className="text-gray-500">
                          ID: {reservation.patientId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.lit ? (
                        <div>
                          <div className="font-medium">
                            <Link
                              to={`/lits/${reservation.litId}`}
                              className="text-blue-600 hover:underline"
                            >
                              Lit n°{reservation.lit.numeroLit}
                            </Link>
                          </div>
                          {reservation.lit.chambre && (
                            <div className="text-xs text-gray-500">{`Chambre ${reservation.lit.chambre}`}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">
                          ID: {reservation.litId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(reservation.dateDepart)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(reservation.dateArrivee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {calculateDuration(
                        reservation.dateDepart,
                        reservation.dateArrivee
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${status.class}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.etablissementDestination ? (
                        <Link
                          to={`/etablissements/${reservation.etablissementDestinationId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {reservation.etablissementDestination.nom}
                        </Link>
                      ) : (
                        <span className="text-gray-400">Non spécifié</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/reservationsLit/${reservation.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Détails
                      </Link>
                      <Link
                        to={`/reservationsLit/edit/${reservation.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(reservation.id)}
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

export default ReservationsLitPage;
