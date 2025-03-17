import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ServicesTab from "@/components/tabs/ServicesTab";
import PersonnelTab from "@/components/tabs/PersonnelTab";
import ReservationsTab from "@/components/tabs/ReservationsTab";
import { useEtablissementStore } from "@/stores/etablissement-store";

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

// Composant pour l'indicateur de capacité
const CapacityIndicator: React.FC<{ total: number; used: number }> = ({
  total,
  used,
}) => {
  const percentage = Math.min(100, Math.round((used / total) * 100)) || 0;
  let colorClass = "bg-green-500";

  if (percentage > 80) {
    colorClass = "bg-red-500";
  } else if (percentage > 50) {
    colorClass = "bg-yellow-500";
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{used} occupés</span>
        <span>{total} total</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClass} h-2 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-right text-xs text-gray-500 mt-1">
        {percentage}% d'occupation
      </div>
    </div>
  );
};

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

const EtablissementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "info" | "services" | "personnel" | "reservations"
  >("info");

  // Utiliser le store Zustand au lieu des états locaux
  const {
    etablissementSelectionne: etablissement,
    isLoading,
    error,
    fetchEtablissementDetails,
    deleteEtablissement,
  } = useEtablissementStore();

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
      fetchEtablissementDetails(id);
    }
  }, [id, fetchEtablissementDetails]);

  const handleDelete = async () => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet établissement ?")
    ) {
      return;
    }

    try {
      if (id) {
        const success = await deleteEtablissement(id);
        if (success) {
          navigate("/etablissements");
        }
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
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
            Chargement des données de l'établissement...
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
            to="/etablissements"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des établissements
          </Link>
        </div>
      </div>
    );
  }

  if (!etablissement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Établissement non trouvé</p>
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {etablissement.nom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      Établissement de santé
                    </Badge>
                    <Badge color="bg-green-200 text-green-800">
                      {etablissement.services.length} services
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/etablissements/edit/${id}`}
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
                active={activeTab === "services"}
                onClick={() => setActiveTab("services")}
              >
                Services ({etablissement?.services.length || 0})
              </Tab>
              <Tab
                active={activeTab === "personnel"}
                onClick={() => setActiveTab("personnel")}
              >
                Personnel ({etablissement?.personnels?.length || 0})
              </Tab>
              <Tab
                active={activeTab === "reservations"}
                onClick={() => setActiveTab("reservations")}
              >
                Réservations ({etablissement?.reservations?.length || 0})
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card
                  title="Informations de l'établissement"
                  className="h-full"
                >
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Nom de l'établissement
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {etablissement.nom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {etablissement.adresse}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant
                      </dt>
                      <dd className="mt-1 text-gray-400 text-sm font-mono">
                        {etablissement.id}
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Capacité d'accueil" className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Occupation des lits
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {etablissement.lits ? etablissement.lits.length : 0}/
                          {etablissement.capacite}
                        </span>
                      </div>

                      <CapacityIndicator
                        total={etablissement.capacite}
                        used={
                          etablissement.lits ? etablissement.lits.length : 0
                        }
                      />

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Disponible</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {etablissement.capacite -
                              (etablissement.lits
                                ? etablissement.lits.length
                                : 0)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Occupé</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {etablissement.lits ? etablissement.lits.length : 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col justify-center items-center">
                      {etablissement.services.length === 0 ? (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
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
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                          </div>
                          <p className="text-gray-500">
                            Aucun service enregistré
                          </p>
                          <Link
                            to={`/services/create?etablissementId=${id}`}
                            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                          >
                            Ajouter un service
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-green-600">
                              {etablissement.services.length}
                            </span>
                          </div>
                          <p className="text-gray-700 font-medium mb-2">
                            Services actifs
                          </p>
                          <Link
                            to={`/services/create?etablissementId=${id}`}
                            className="mt-2 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                          >
                            Ajouter un service
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Onglet Services - Remplacé par le composant ServicesTab */}
            {activeTab === "services" && etablissement && (
              <ServicesTab
                services={etablissement.services}
                etablissementId={etablissement.id}
              />
            )}

            {/* Onglet Personnel - Remplacé par le composant PersonnelTab */}
            {activeTab === "personnel" && etablissement && (
              <PersonnelTab
                personnels={etablissement.personnels || []}
                etablissementId={etablissement.id}
              />
            )}

            {/* Onglet Réservations - Remplacé par le composant ReservationsTab */}
            {activeTab === "reservations" && etablissement && (
              <ReservationsTab
                reservations={etablissement.reservations || []}
              />
            )}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/etablissements"
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
            Retour à la liste des établissements
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/services/create?etablissementId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Ajouter un service
            </Link>
            <Link
              to={`/personnels/create?etablissementId=${id}`}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Ajouter du personnel
            </Link>
            <Link
              to={`/reservations-lits/create`}
              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Créer une réservation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtablissementDetailPage;
