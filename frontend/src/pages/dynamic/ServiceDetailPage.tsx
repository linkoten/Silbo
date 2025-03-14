import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Interfaces pour les données
interface Service {
  id: string;
  nom: string;
  capacite: number;
  etablissementId: string;
}

interface Etablissement {
  id: string;
  nom: string;
  adresse: string;
}

interface Lit {
  id: string;
  numeroLit: string;
  serviceId: string;
}

interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
  serviceId: string;
}

interface ServiceDetails extends Service {
  etablissement?: Etablissement;
  lits: Lit[];
  personnels: Personnel[];
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

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "lits" | "personnel">(
    "info"
  );

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données du service
        const serviceResponse = await fetch(
          `http://localhost:3000/services/${id}`
        );

        if (!serviceResponse.ok) {
          throw new Error(`Service non trouvé (${serviceResponse.status})`);
        }

        const serviceData: Service = await serviceResponse.json();

        // Récupération uniquement des lits associés à ce service spécifique
        const litsResponse = await fetch(
          `http://localhost:3000/lits?serviceId=${id}`
        );
        let lits: Lit[] = litsResponse.ok ? await litsResponse.json() : [];

        // Filtrage supplémentaire côté client pour s'assurer que seuls les lits du service actuel sont inclus
        lits = lits.filter((lit) => lit.serviceId === id);

        console.log("Lits filtrés pour le service", id, ":", lits);

        // Récupération du personnel associé à ce service
        const personnelsResponse = await fetch(
          `http://localhost:3000/personnels?serviceId=${id}`
        );
        const personnels: Personnel[] = personnelsResponse.ok
          ? await personnelsResponse.json()
          : [];

        // Récupération des détails de l'établissement
        let etablissementData: Etablissement | undefined = undefined;
        if (serviceData.etablissementId) {
          try {
            const etablissementResponse = await fetch(
              `http://localhost:3000/etablissements/${serviceData.etablissementId}`
            );
            if (etablissementResponse.ok) {
              etablissementData = await etablissementResponse.json();
            }
          } catch (err) {
            console.warn(
              "Impossible de récupérer les détails de l'établissement:",
              err
            );
          }
        }

        // Assemblage des données
        setService({
          ...serviceData,
          etablissement: etablissementData,
          lits,
          personnels,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données du service:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/services");
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
            Chargement des informations du service...
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
            to="/services"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Service non trouvé</p>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {service.nom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      Capacité: {service.capacite} lits
                    </Badge>
                    {service.etablissement && (
                      <Badge color="bg-green-200 text-green-800">
                        {service.etablissement.nom}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/services/edit/${id}`}
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
                active={activeTab === "lits"}
                onClick={() => setActiveTab("lits")}
              >
                Lits ({service.lits.length})
              </Tab>
              <Tab
                active={activeTab === "personnel"}
                onClick={() => setActiveTab("personnel")}
              >
                Personnel ({service.personnels.length})
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Informations du service" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Nom du service
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {service.nom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Capacité totale
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {service.capacite} lits
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Établissement
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {service.etablissement ? (
                          <Link
                            to={`/etablissements/${service.etablissementId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {service.etablissement.nom}
                          </Link>
                        ) : (
                          <span className="text-gray-500">
                            ID: {service.etablissementId}
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant du service
                      </dt>
                      <dd className="mt-1 text-gray-400 text-sm font-mono">
                        {service.id}
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Occupation et disponibilité" className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          Lits disponibles
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {service.lits.length}/{service.capacite}
                        </span>
                      </div>

                      <CapacityIndicator
                        total={service.capacite}
                        used={service.lits.length}
                      />

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">Disponible</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {service.capacite - service.lits.length}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <span className="text-sm">Occupé</span>
                          </div>
                          <span className="text-sm font-semibold">
                            {service.lits.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto text-center">
                      <Link
                        to={`/lits/create?serviceId=${id}`}
                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Ajouter un lit dans ce service
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Onglet Lits */}
            {activeTab === "lits" &&
              (service.lits.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Numéro de lit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {service.lits.map((lit) => (
                        <tr key={lit.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                            {lit.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {lit.numeroLit}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Disponible
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/lits/${lit.id}`}
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
                  <p className="text-xl font-medium mb-2">
                    Aucun lit disponible
                  </p>
                  <p className="mb-6">
                    Ce service n'a pas encore de lits enregistrés.
                  </p>
                  <Link
                    to={`/lits/create?serviceId=${id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Ajouter un lit
                  </Link>
                </div>
              ))}

            {/* Onglet Personnel */}
            {activeTab === "personnel" &&
              (service.personnels.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prénom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profession
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {service.personnels.map((personnel) => (
                        <tr key={personnel.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {personnel.nom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {personnel.prenom}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge color="bg-purple-100 text-purple-800">
                              {personnel.profession}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/personnels/${personnel.id}`}
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
                  <p className="text-xl font-medium mb-2">Aucun personnel</p>
                  <p className="mb-6">
                    Ce service n'a pas encore de personnel enregistré.
                  </p>
                  <Link
                    to={`/personnels/create?serviceId=${id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Ajouter du personnel
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/services"
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
            Retour à la liste des services
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/lits/create?serviceId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Ajouter un lit
            </Link>
            <Link
              to={`/personnels/create?serviceId=${id}`}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Ajouter du personnel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;
