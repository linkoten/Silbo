import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";

// Interfaces pour les données
interface Transfert {
  id: string;
  patientId: string;
  dateTransfert: string;
  serviceDepartId: string;
  serviceArriveeId: string;
  etablissementDepartId: string;
  etablissementArriveeId: string;
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface Service {
  id: string;
  nom: string;
}

interface Etablissement {
  id: string;
  nom: string;
}

interface TransfertDetails extends Transfert {
  patient?: Patient;
  serviceDepart?: Service;
  serviceArrivee?: Service;
  etablissementDepart?: Etablissement;
  etablissementArrivee?: Etablissement;
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

const TransfertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transfert, setTransfert] = useState<TransfertDetails | null>(null);
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
    const fetchTransfertDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données du transfert
        const transfertResponse = await fetch(
          `http://localhost:3000/transferts/${id}`
        );

        if (!transfertResponse.ok) {
          throw new Error(`Transfert non trouvé (${transfertResponse.status})`);
        }

        const transfertData: Transfert = await transfertResponse.json();

        // Récupération des données du patient
        let patientData: Patient | undefined = undefined;
        try {
          const patientResponse = await fetch(
            `http://localhost:3000/patients/${transfertData.patientId}`
          );
          if (patientResponse.ok) {
            patientData = await patientResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer les détails du patient:", err);
        }

        // Récupération des données du service de départ
        let serviceDepartData: Service | undefined = undefined;
        try {
          const serviceDepartResponse = await fetch(
            `http://localhost:3000/services/${transfertData.serviceDepartId}`
          );
          if (serviceDepartResponse.ok) {
            serviceDepartData = await serviceDepartResponse.json();
          }
        } catch (err) {
          console.warn(
            "Impossible de récupérer les détails du service de départ:",
            err
          );
        }

        // Récupération des données du service d'arrivée
        let serviceArriveeData: Service | undefined = undefined;
        try {
          const serviceArriveeResponse = await fetch(
            `http://localhost:3000/services/${transfertData.serviceArriveeId}`
          );
          if (serviceArriveeResponse.ok) {
            serviceArriveeData = await serviceArriveeResponse.json();
          }
        } catch (err) {
          console.warn(
            "Impossible de récupérer les détails du service d'arrivée:",
            err
          );
        }

        // Récupération des données de l'établissement de départ
        let etablissementDepartData: Etablissement | undefined = undefined;
        try {
          const etablissementDepartResponse = await fetch(
            `http://localhost:3000/etablissements/${transfertData.etablissementDepartId}`
          );
          if (etablissementDepartResponse.ok) {
            etablissementDepartData = await etablissementDepartResponse.json();
          }
        } catch (err) {
          console.warn(
            "Impossible de récupérer les détails de l'établissement de départ:",
            err
          );
        }

        // Récupération des données de l'établissement d'arrivée
        let etablissementArriveeData: Etablissement | undefined = undefined;
        try {
          const etablissementArriveeResponse = await fetch(
            `http://localhost:3000/etablissements/${transfertData.etablissementArriveeId}`
          );
          if (etablissementArriveeResponse.ok) {
            etablissementArriveeData =
              await etablissementArriveeResponse.json();
          }
        } catch (err) {
          console.warn(
            "Impossible de récupérer les détails de l'établissement d'arrivée:",
            err
          );
        }

        // Assemblage des données
        setTransfert({
          ...transfertData,
          patient: patientData,
          serviceDepart: serviceDepartData,
          serviceArrivee: serviceArriveeData,
          etablissementDepart: etablissementDepartData,
          etablissementArrivee: etablissementArriveeData,
        });
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du transfert:",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTransfertDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce transfert ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/transferts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/transferts");
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
            Chargement des détails du transfert...
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
            to="/transferts"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des transferts
          </Link>
        </div>
      </div>
    );
  }

  if (!transfert) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Transfert non trouvé</p>
        </div>
      </div>
    );
  }

  // Déterminer si le transfert est dans le passé ou le futur
  const transfertDate = new Date(transfert.dateTransfert);
  const now = new Date();
  const isTransfertPast = transfertDate < now;
  const transfertStatus = isTransfertPast ? "Effectué" : "Planifié";
  const transfertStatusColor = isTransfertPast
    ? "bg-green-200 text-green-800"
    : "bg-blue-200 text-blue-800";

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
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Transfert{" "}
                    {transfert.patient &&
                      `de ${transfert.patient.prenom} ${transfert.patient.nom}`}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color={transfertStatusColor}>
                      {transfertStatus}
                    </Badge>
                    <Badge color="bg-purple-200 text-purple-800">
                      {formatDate(transfert.dateTransfert)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/transferts/edit/${id}`}
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
            <div className="grid grid-cols-1 gap-8 mb-8">
              {/* Transfert visuel */}
              <Card title="Informations générales">
                <div className="my-6">
                  <div className="flex flex-col md:flex-row items-center justify-between py-4">
                    {/* Établissement/Service de départ */}
                    <div className="md:w-5/12 mb-6 md:mb-0 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-100 rounded-full mb-3">
                          <svg
                            className="w-8 h-8 text-blue-600"
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
                        </div>

                        {/* Établissement de départ */}
                        <h3 className="text-lg font-semibold">
                          {transfert.etablissementDepart ? (
                            <Link
                              to={`/etablissements/${transfert.etablissementDepartId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {transfert.etablissementDepart.nom}
                            </Link>
                          ) : (
                            <span className="text-gray-500">
                              {transfert.etablissementDepartId}
                            </span>
                          )}
                        </h3>

                        {/* Service de départ */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-medium">
                            {transfert.serviceDepart ? (
                              <Link
                                to={`/services/${transfert.serviceDepartId}`}
                                className="text-blue-600 hover:underline"
                              >
                                {transfert.serviceDepart.nom}
                              </Link>
                            ) : (
                              <span className="text-gray-500">
                                {transfert.serviceDepartId}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Flèche de transfert */}
                    <div className="md:w-2/12 flex justify-center items-center mb-6 md:mb-0">
                      <div className="hidden md:block w-full h-1 bg-blue-200 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4">
                          <svg
                            className="w-6 h-6 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="md:hidden">
                        <svg
                          className="w-8 h-8 text-blue-500 transform rotate-90"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Établissement/Service d'arrivée */}
                    <div className="md:w-5/12 text-center">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-green-100 rounded-full mb-3">
                          <svg
                            className="w-8 h-8 text-green-600"
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
                        </div>

                        {/* Établissement d'arrivée */}
                        <h3 className="text-lg font-semibold">
                          {transfert.etablissementArrivee ? (
                            <Link
                              to={`/etablissements/${transfert.etablissementArriveeId}`}
                              className="text-green-600 hover:underline"
                            >
                              {transfert.etablissementArrivee.nom}
                            </Link>
                          ) : (
                            <span className="text-gray-500">
                              {transfert.etablissementArriveeId}
                            </span>
                          )}
                        </h3>

                        {/* Service d'arrivée */}
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-medium">
                            {transfert.serviceArrivee ? (
                              <Link
                                to={`/services/${transfert.serviceArriveeId}`}
                                className="text-green-600 hover:underline"
                              >
                                {transfert.serviceArrivee.nom}
                              </Link>
                            ) : (
                              <span className="text-gray-500">
                                {transfert.serviceArriveeId}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Date de transfert */}
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Date du transfert
                      </dt>
                      <dd className="mt-1 text-lg font-medium text-gray-900">
                        {formatDate(transfert.dateTransfert)}
                      </dd>
                    </div>

                    {/* Statut */}
                    <div className="col-span-1">
                      <dt className="text-sm font-medium text-gray-500">
                        Statut du transfert
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${transfertStatusColor}`}
                        >
                          {transfertStatus}
                        </span>
                      </dd>
                    </div>

                    {/* ID du transfert */}
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant du transfert
                      </dt>
                      <dd className="mt-1 text-sm font-mono text-gray-400">
                        {transfert.id}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card>

              {/* Information du patient */}
              <Card title="Patient concerné" className="h-full">
                {transfert.patient ? (
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 mr-5">
                      {transfert.patient.prenom.charAt(0)}
                      {transfert.patient.nom.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium">
                        {transfert.patient.prenom} {transfert.patient.nom}
                      </h3>
                      <div className="mt-3">
                        <Link
                          to={`/patients/${transfert.patientId}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center text-sm"
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
                          Voir le dossier patient
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-400">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <p className="mb-1">Information patient non disponible</p>
                    <p className="text-sm">ID: {transfert.patientId}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/transferts"
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
            Retour à la liste des transferts
          </Link>

          {transfert.patient && (
            <Link
              to={`/patients/${transfert.patientId}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Voir le patient
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransfertDetailPage;
