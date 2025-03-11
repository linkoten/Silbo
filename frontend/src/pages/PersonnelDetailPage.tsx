import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Interfaces pour les données
interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
  serviceId: string;
}

interface Service {
  id: string;
  nom: string;
}

interface PriseEnCharge {
  id: string;
  patientId: string;
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface PersonnelDetails extends Personnel {
  service?: Service;
  prisesEnCharge: Array<PriseEnCharge & { patient?: Patient }>;
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

const PersonnelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState<PersonnelDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "patients">("info");

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPersonnelDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données du personnel
        const personnelResponse = await fetch(
          `http://localhost:3000/personnels/${id}`
        );

        if (!personnelResponse.ok) {
          throw new Error(`Personnel non trouvé (${personnelResponse.status})`);
        }

        const personnelData: Personnel = await personnelResponse.json();

        // Récupération du service associé
        let serviceData: Service | undefined = undefined;
        try {
          const serviceResponse = await fetch(
            `http://localhost:3000/services/${personnelData.serviceId}`
          );
          if (serviceResponse.ok) {
            serviceData = await serviceResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer les détails du service:", err);
        }

        // Récupération des prises en charge
        const prisesResponse = await fetch(
          `http://localhost:3000/prisesEnCharge?personnelId=${id}`
        );
        let prisesEnCharge: Array<PriseEnCharge & { patient?: Patient }> = [];

        if (prisesResponse.ok) {
          const prisesData: PriseEnCharge[] = await prisesResponse.json();

          // Récupération des informations des patients pour chaque prise en charge
          prisesEnCharge = await Promise.all(
            prisesData.map(async (prise) => {
              let patient: Patient | undefined = undefined;
              try {
                const patientResponse = await fetch(
                  `http://localhost:3000/patients/${prise.patientId}`
                );
                if (patientResponse.ok) {
                  patient = await patientResponse.json();
                }
              } catch (err) {
                console.warn(
                  `Impossible de récupérer les détails du patient ${prise.patientId}:`,
                  err
                );
              }
              return { ...prise, patient };
            })
          );
        }

        // Assemblage des données
        setPersonnel({
          ...personnelData,
          service: serviceData,
          prisesEnCharge,
        });
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du personnel:",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersonnelDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce membre du personnel ?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/personnels/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/personnels");
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
            Chargement des informations du personnel...
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
            to="/personnels"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste du personnel
          </Link>
        </div>
      </div>
    );
  }

  if (!personnel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Personnel non trouvé</p>
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
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {personnel.prenom.charAt(0)}
                  {personnel.nom.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {personnel.prenom} {personnel.nom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      {personnel.profession}
                    </Badge>
                    {personnel.service && (
                      <Badge color="bg-green-200 text-green-800">
                        Service: {personnel.service.nom}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/personnels/edit/${id}`}
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
                active={activeTab === "patients"}
                onClick={() => setActiveTab("patients")}
              >
                Patients suivis ({personnel.prisesEnCharge.length})
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card title="Informations personnelles" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Nom complet
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {personnel.prenom} {personnel.nom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Profession
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {personnel.profession}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant
                      </dt>
                      <dd className="mt-1 text-gray-400 text-sm font-mono">
                        {personnel.id}
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Service d'affectation" className="h-full">
                  <div className="flex flex-col h-full">
                    {personnel.service ? (
                      <div>
                        <div className="flex items-center mb-4">
                          <span className="inline-block p-3 bg-green-100 text-green-700 rounded-full mr-4">
                            <svg
                              className="w-6 h-6"
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
                          </span>
                          <div>
                            <p className="text-gray-900 font-medium text-lg">
                              {personnel.service.nom}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Link
                            to={`/services/${personnel.serviceId}`}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Voir les détails du service
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
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
                        <p className="text-gray-500">Aucun service associé</p>
                        <div className="mt-3">
                          <p className="text-sm text-gray-400">
                            ID: {personnel.serviceId || "Non défini"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}

            {/* Onglet Patients suivis */}
            {activeTab === "patients" &&
              (personnel.prisesEnCharge.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID de suivi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {personnel.prisesEnCharge.map((prise) => (
                        <tr key={prise.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                            {prise.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {prise.patient ? (
                              <Link
                                to={`/patients/${prise.patientId}`}
                                className="flex items-center text-blue-600 hover:text-blue-900"
                              >
                                <span className="font-medium">
                                  {prise.patient.nom} {prise.patient.prenom}
                                </span>
                              </Link>
                            ) : (
                              <span className="text-gray-500">
                                Patient ID: {prise.patientId}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-3">
                              <Link
                                to={`/prisesEnCharge/${prise.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Détails
                              </Link>
                              <Link
                                to={`/patients/${prise.patientId}`}
                                className="text-green-600 hover:text-green-900"
                              >
                                Dossier patient
                              </Link>
                            </div>
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
                    Aucun patient suivi
                  </p>
                  <p className="mb-6">
                    Ce membre du personnel ne suit actuellement aucun patient.
                  </p>
                  <Link
                    to={`/prisesEnCharge/create?personnelId=${id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Ajouter une prise en charge
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/personnels"
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
            Retour à la liste du personnel
          </Link>

          <Link
            to={`/prisesEnCharge/create?personnelId=${id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Ajouter une prise en charge
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonnelDetailPage;
