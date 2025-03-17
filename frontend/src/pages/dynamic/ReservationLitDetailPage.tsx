import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ReservationDetailTab from "@/components/tabs/ReservationDetailTab";
import ReservationRelatedTab from "@/components/tabs/ReservationRelatedTab";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import { useToast } from "@/components/ui/use-toast";

// Composant Badge
const Badge: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
  >
    {children}
  </span>
);

// Composant Tab pour les onglets
const Tab: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm transition-all duration-200 
    ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-500 hover:text-blue-500"
    }`}
  >
    {children}
  </button>
);

// Calculer la durée entre deux dates
const getDurationDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ReservationLitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"details" | "related">("details");
  const { toast } = useToast();

  // Utiliser le store reservation-lit
  const {
    reservationLitSelectionnee: reservation,
    isLoading,
    error,
    fetchReservationLitDetails,
    deleteReservationLit,
  } = useReservationLitStore();

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (id) {
      fetchReservationLitDetails(id);
    }
  }, [id, fetchReservationLitDetails]);

  const handleDelete = async () => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      return;
    }

    try {
      if (id) {
        const success = await deleteReservationLit(id);
        if (success) {
          toast({
            title: "Succès",
            description: "La réservation a été supprimée avec succès",
            variant: "success",
          });
          navigate("/reservationsLit");
        }
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description:
          err instanceof Error ? err.message : "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className={`text-center ${
            pulse ? "opacity-70" : "opacity-100"
          } transition-opacity duration-500`}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des détails de la réservation...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <Link
            to="/reservationsLit"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des réservations
          </Link>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Réservation non trouvée</p>
        </div>
      </div>
    );
  }

  // Détermination du statut de la réservation
  const now = new Date();
  const departDate = new Date(reservation.dateDepart);
  const arriveeDate = new Date(reservation.dateArrivee);

  let status = "En cours";
  let statusColor = "bg-green-200 text-green-800";

  if (now < departDate) {
    status = "À venir";
    statusColor = "bg-blue-200 text-blue-800";
  } else if (now > arriveeDate) {
    status = "Terminée";
    statusColor = "bg-gray-200 text-gray-800";
  }

  const duration = getDurationDays(
    reservation.dateDepart,
    reservation.dateArrivee
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Réservation{" "}
                    {reservation.lit
                      ? `du lit n°${reservation.lit.numeroLit}`
                      : ""}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color={statusColor}>{status}</Badge>
                    <Badge color="bg-purple-200 text-purple-800">
                      {duration} jour{duration > 1 ? "s" : ""}
                    </Badge>
                    {reservation.patient && (
                      <Badge color="bg-green-200 text-green-800">
                        Patient: {reservation.patient.nom}{" "}
                        {reservation.patient.prenom}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/reservationsLit/edit/${id}`}
                  className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-white hover:bg-gray-100 text-red-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {/* Onglets de navigation */}
          <div className="border-b">
            <div className="flex overflow-x-auto">
              <Tab
                active={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              >
                Détails de la réservation
              </Tab>
              <Tab
                active={activeTab === "related"}
                onClick={() => setActiveTab("related")}
              >
                Éléments associés
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Détails */}
            {activeTab === "details" && (
              <ReservationDetailTab reservation={reservation} />
            )}

            {/* Onglet Éléments associés */}
            {activeTab === "related" && (
              <ReservationRelatedTab
                patient={reservation.patient}
                patientId={reservation.patientId}
                lit={reservation.lit}
                litId={reservation.litId}
                service={reservation.service}
              />
            )}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/reservationsLit"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste des réservations
          </Link>

          <div className="flex space-x-3">
            {reservation.patient && (
              <Link
                to={`/patients/${reservation.patientId}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Voir le patient
              </Link>
            )}
            {reservation.lit && (
              <Link
                to={`/lits/${reservation.litId}`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Voir le lit
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationLitDetailPage;
