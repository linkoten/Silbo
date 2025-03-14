import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";

// Interfaces pour les données
interface PriseEnCharge {
  id: string;
  patientId: string;
  personnelId: string;
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  numeroSecu: string;
}

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

interface PriseEnChargeDetails extends PriseEnCharge {
  patient?: Patient;
  personnel?: Personnel & { service?: Service };
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

const PriseEnChargeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [priseEnCharge, setPriseEnCharge] =
    useState<PriseEnChargeDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPriseDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données de la prise en charge
        const priseResponse = await fetch(
          `http://localhost:3000/prisesEnCharge/${id}`
        );

        if (!priseResponse.ok) {
          throw new Error(
            `Prise en charge non trouvée (${priseResponse.status})`
          );
        }

        const priseData: PriseEnCharge = await priseResponse.json();

        // Récupération des données du patient
        let patientData: Patient | undefined = undefined;
        try {
          const patientResponse = await fetch(
            `http://localhost:3000/patients/${priseData.patientId}`
          );
          if (patientResponse.ok) {
            patientData = await patientResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer les détails du patient:", err);
        }

        // Récupération des données du personnel
        let personnelData: (Personnel & { service?: Service }) | undefined =
          undefined;
        try {
          const personnelResponse = await fetch(
            `http://localhost:3000/personnels/${priseData.personnelId}`
          );
          if (personnelResponse.ok) {
            const personnel: Personnel = await personnelResponse.json();

            // Récupération du service du personnel
            try {
              if (personnel.serviceId) {
                const serviceResponse = await fetch(
                  `http://localhost:3000/services/${personnel.serviceId}`
                );
                if (serviceResponse.ok) {
                  const service = await serviceResponse.json();
                  personnelData = { ...personnel, service };
                } else {
                  personnelData = personnel;
                }
              } else {
                personnelData = personnel;
              }
            } catch (err) {
              console.warn(
                "Impossible de récupérer les détails du service:",
                err
              );
              personnelData = personnel;
            }
          }
        } catch (err) {
          console.warn(
            "Impossible de récupérer les détails du personnel:",
            err
          );
        }

        // Assemblage des données
        setPriseEnCharge({
          ...priseData,
          patient: patientData,
          personnel: personnelData,
        });
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données de la prise en charge:",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPriseDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette prise en charge ?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/prisesEnCharge/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/prisesEnCharge");
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
            Chargement des détails de la prise en charge...
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
            to="/prisesEnCharge"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des prises en charge
          </Link>
        </div>
      </div>
    );
  }

  if (!priseEnCharge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Prise en charge non trouvée</p>
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Prise en charge
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {priseEnCharge.patient && (
                      <Badge color="bg-blue-200 text-blue-800">
                        Patient: {priseEnCharge.patient.nom}{" "}
                        {priseEnCharge.patient.prenom}
                      </Badge>
                    )}
                    {priseEnCharge.personnel && (
                      <Badge color="bg-green-200 text-green-800">
                        Personnel: {priseEnCharge.personnel.profession}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/prisesEnCharge/edit/${id}`}
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

          {/* Contenu principal */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Détails généraux de la prise en charge */}
              <Card title="Informations générales" className="h-full">
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Identifiant de la prise en charge
                    </dt>
                    <dd className="mt-1 text-gray-900 font-mono">
                      {priseEnCharge.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Date de création
                    </dt>
                    <dd className="mt-1 text-gray-900">Non spécifiée</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Statut
                    </dt>
                    <dd className="mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        Actif
                      </span>
                    </dd>
                  </div>
                </dl>
              </Card>

              {/* Représentation visuelle de la relation */}
              <Card title="Relation soignant-patient" className="h-full">
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-2 shadow-md">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium">Patient</p>
                  </div>

                  <div className="mx-8 flex-grow max-w-xs">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-1 w-full bg-blue-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-sm text-blue-500">
                          Est pris en charge par
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-2 shadow-md">
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
                          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium">Soignant</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Détails du patient */}
              <Card title="Patient" className="h-full">
                {priseEnCharge.patient ? (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 mr-4">
                        {priseEnCharge.patient.prenom.charAt(0)}
                        {priseEnCharge.patient.nom.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {priseEnCharge.patient.prenom}{" "}
                          {priseEnCharge.patient.nom}
                        </h3>
                        <p className="text-gray-600">
                          Né(e) le{" "}
                          {formatDate(priseEnCharge.patient.dateNaissance)}
                        </p>
                      </div>
                    </div>
                    <dl className="mt-4 grid grid-cols-1 gap-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          N° de sécurité sociale
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {priseEnCharge.patient.numeroSecu}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-6">
                      <Link
                        to={`/patients/${priseEnCharge.patientId}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Dossier complet du patient
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
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
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <p className="mb-1">Information patient non disponible</p>
                    <p className="text-sm">ID: {priseEnCharge.patientId}</p>
                  </div>
                )}
              </Card>

              {/* Détails du personnel */}
              <Card title="Personnel soignant" className="h-full">
                {priseEnCharge.personnel ? (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700 mr-4">
                        {priseEnCharge.personnel.prenom.charAt(0)}
                        {priseEnCharge.personnel.nom.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {priseEnCharge.personnel.prenom}{" "}
                          {priseEnCharge.personnel.nom}
                        </h3>
                        <p className="text-gray-600">
                          {priseEnCharge.personnel.profession}
                        </p>
                      </div>
                    </div>

                    {priseEnCharge.personnel.service && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-500">
                          Service assigné
                        </p>
                        <div className="mt-2 flex items-center">
                          <svg
                            className="w-5 h-5 text-gray-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <Link
                            to={`/services/${priseEnCharge.personnel.service.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {priseEnCharge.personnel.service.nom}
                          </Link>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <Link
                        to={`/personnels/${priseEnCharge.personnelId}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Fiche du personnel
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="mb-1">
                      Information du personnel non disponible
                    </p>
                    <p className="text-sm">ID: {priseEnCharge.personnelId}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/prisesEnCharge"
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
            Retour à la liste
          </Link>

          <div className="flex space-x-3">
            {priseEnCharge.patient && (
              <Link
                to={`/patients/${priseEnCharge.patientId}`}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Voir le patient
              </Link>
            )}
            {priseEnCharge.personnel && (
              <Link
                to={`/personnels/${priseEnCharge.personnelId}`}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Voir le personnel
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriseEnChargeDetailPage;
