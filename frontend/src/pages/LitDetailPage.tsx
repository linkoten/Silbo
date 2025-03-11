import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";

// Interfaces pour les données
interface Lit {
  id: string;
  numeroLit: string;
  serviceId: string;
}

interface Service {
  id: string;
  nom: string;
}

interface ReservationLit {
  id: string;
  patientId: string;
  dateDepart: string;
  dateArrivee: string;
  etablissementDestinationId: string;
}

interface LitDetails extends Lit {
  service?: Service;
  reservations: ReservationLit[];
}

// Composant Card réutilisable
const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
      <h3 className="text-white text-lg font-bold">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

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

const LitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lit, setLit] = useState<LitDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "reservations">("info");

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchLitDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données du lit
        const litResponse = await fetch(`http://localhost:3000/lits/${id}`);

        if (!litResponse.ok) {
          throw new Error(`Lit non trouvé (${litResponse.status})`);
        }

        const litData: Lit = await litResponse.json();

        // Récupération des données du service associé
        let serviceData: Service | undefined = undefined;
        try {
          const serviceResponse = await fetch(
            `http://localhost:3000/services/${litData.serviceId}`
          );
          if (serviceResponse.ok) {
            serviceData = await serviceResponse.json();
          }
        } catch (err) {
          // Gérer silencieusement les erreurs de relation
          console.warn("Impossible de récupérer les détails du service:", err);
        }

        // Récupération des réservations associées au lit
        const reservationsResponse = await fetch(
          `http://localhost:3000/reservationsLit?litId=${id}`
        );
        const reservations: ReservationLit[] = reservationsResponse.ok
          ? await reservationsResponse.json()
          : [];

        // Assemblage des données
        setLit({
          ...litData,
          service: serviceData,
          reservations,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données du lit:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLitDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce lit ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/lits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/lits");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className={`text-center ${
            pulse ? "opacity-70" : "opacity-100"
          } transition-opacity duration-500`}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du lit...
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
            to="/lits"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des lits
          </Link>
        </div>
      </div>
    );
  }

  if (!lit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Lit non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {lit.numeroLit}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Lit n°{lit.numeroLit}
                  </h1>
                  {lit.service && (
                    <Badge color="bg-green-200 text-green-800">
                      Service: {lit.service.nom}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/lits/edit/${id}`}
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
                active={activeTab === "info"}
                onClick={() => setActiveTab("info")}
              >
                Informations
              </Tab>
              <Tab
                active={activeTab === "reservations"}
                onClick={() => setActiveTab("reservations")}
              >
                Réservations ({lit.reservations.length})
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Informations du lit" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Numéro de lit
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {lit.numeroLit}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Service
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {lit.service ? (
                          <Link
                            to={`/services/${lit.serviceId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {lit.service.nom}
                          </Link>
                        ) : (
                          <span className="text-gray-500">
                            ID: {lit.serviceId}
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant du lit
                      </dt>
                      <dd className="mt-1 text-gray-400 text-sm font-mono">
                        {lit.id}
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Disponibilité" className="h-full">
                  <div className="flex flex-col items-center justify-center h-full">
                    {lit.reservations.length === 0 ? (
                      <div>
                        <span className="inline-block p-3 bg-green-100 text-green-700 rounded-full mb-4">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </span>
                        <p className="text-gray-900 font-medium text-lg">
                          Lit disponible
                        </p>
                        <p className="text-gray-500 mt-2">
                          Aucune réservation en cours
                        </p>
                        <Link
                          to={`/reservationsLit/create?litId=${id}`}
                          className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Réserver ce lit
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <span className="inline-block p-3 bg-yellow-100 text-yellow-700 rounded-full mb-4">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                        </span>
                        <p className="text-gray-900 font-medium text-lg">
                          Lit réservé
                        </p>
                        <p className="text-gray-500 mt-2">
                          {lit.reservations.length} réservation(s) active(s)
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Onglet Réservations */}
            {activeTab === "reservations" &&
              (lit.reservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Du
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Au
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Établissement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {lit.reservations.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/patients/${reservation.patientId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {reservation.patientId}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(reservation.dateDepart)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(reservation.dateArrivee)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/etablissements/${reservation.etablissementDestinationId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {reservation.etablissementDestinationId}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/reservationsLit/${reservation.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Détails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-xl font-medium mb-2">Aucune réservation</p>
                  <p className="mb-6">
                    Ce lit n'a aucune réservation actuellement.
                  </p>
                  <Link
                    to={`/reservationsLit/create?litId=${id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Créer une réservation
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/lits"
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
            Retour à la liste des lits
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/reservationsLit/create?litId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Réserver ce lit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LitDetailPage;
