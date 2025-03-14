import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";

// Interfaces pour les données
interface Patient {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  numeroSecu: string;
  dossierMedical?: string;
}

interface Transfert {
  id: string;
  dateTransfert: string;
  serviceDepartId: string;
  serviceArriveeId: string;
  etablissementDepartId: string;
  etablissementArriveeId: string;
}

interface PriseEnCharge {
  id: string;
  personnelId: string;
}

interface ReservationLit {
  id: string;
  litId: string;
  dateDepart: string;
  dateArrivee: string;
  etablissementDestinationId: string;
}

interface PatientDetails extends Patient {
  transferts: Transfert[];
  prisesEnCharge: PriseEnCharge[];
  reservationsLit: ReservationLit[];
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

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "info" | "transferts" | "reservations" | "prises"
  >("info");

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);

        // Récupération des données du patient
        const patientResponse = await fetch(
          `http://localhost:3000/patients/${id}`
        );

        if (!patientResponse.ok) {
          throw new Error(`Patient non trouvé (${patientResponse.status})`);
        }

        const patientData: Patient = await patientResponse.json();

        // Récupération des transferts du patient
        const transfertsResponse = await fetch(
          `http://localhost:3000/transferts?patientId=${id}`
        );
        const transferts: Transfert[] = transfertsResponse.ok
          ? await transfertsResponse.json()
          : [];

        // Récupération des prises en charge
        const prisesResponse = await fetch(
          `http://localhost:3000/prisesEnCharge?patientId=${id}`
        );
        const prisesEnCharge: PriseEnCharge[] = prisesResponse.ok
          ? await prisesResponse.json()
          : [];

        // Récupération des réservations de lit
        const reservationsResponse = await fetch(
          `http://localhost:3000/reservationsLit?patientId=${id}`
        );
        const reservationsLit: ReservationLit[] = reservationsResponse.ok
          ? await reservationsResponse.json()
          : [];

        // Assemblage des données
        setPatient({
          ...patientData,
          transferts,
          prisesEnCharge,
          reservationsLit,
        });
      } catch (err) {
        console.error("Erreur lors du chargement des données patient:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate("/patients");
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
            Chargement du dossier patient...
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
            to="/patients"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des patients
          </Link>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Patient non trouvé</p>
        </div>
      </div>
    );
  }

  // Calcul de l'âge du patient
  const calculateAge = (dateNaissance: string) => {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const patientAge = calculateAge(patient.dateNaissance);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête avec photo et informations principales */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {patient.prenom.charAt(0)}
                  {patient.nom.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {patient.prenom} {patient.nom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      {patientAge} ans
                    </Badge>
                    <Badge color="bg-green-200 text-green-800">
                      N° Sécu: {patient.numeroSecu}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/patients/edit/${id}`}
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
                active={activeTab === "transferts"}
                onClick={() => setActiveTab("transferts")}
              >
                Transferts ({patient.transferts.length})
              </Tab>
              <Tab
                active={activeTab === "reservations"}
                onClick={() => setActiveTab("reservations")}
              >
                Réservations ({patient.reservationsLit.length})
              </Tab>
              <Tab
                active={activeTab === "prises"}
                onClick={() => setActiveTab("prises")}
              >
                Prises en charge ({patient.prisesEnCharge.length})
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
                        {patient.prenom} {patient.nom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date de naissance
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {formatDate(patient.dateNaissance)} ({patientAge} ans)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Numéro de sécurité sociale
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.numeroSecu}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Identifiant patient
                      </dt>
                      <dd className="mt-1 text-gray-400 text-sm font-mono">
                        {patient.id}
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Dossier médical" className="h-full">
                  {patient.dossierMedical ? (
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                      {patient.dossierMedical}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-gray-400 italic">
                      Aucune information médicale disponible
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Onglet Transferts */}
            {activeTab === "transferts" &&
              (patient.transferts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service départ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service arrivée
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.transferts.map((transfert) => (
                        <tr key={transfert.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(transfert.dateTransfert)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transfert.serviceDepartId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {transfert.serviceArriveeId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/transferts/${transfert.id}`}
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
                  Aucun transfert enregistré pour ce patient
                </div>
              ))}

            {/* Onglet Réservations */}
            {activeTab === "reservations" &&
              (patient.reservationsLit.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Lit
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
                      {patient.reservationsLit.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.litId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(reservation.dateDepart)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(reservation.dateArrivee)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {reservation.etablissementDestinationId}
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
                  Aucune réservation de lit pour ce patient
                </div>
              ))}

            {/* Onglet Prises en charge */}
            {activeTab === "prises" &&
              (patient.prisesEnCharge.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Personnel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.prisesEnCharge.map((prise) => (
                        <tr key={prise.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            {prise.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {prise.personnelId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/prisesEnCharge/${prise.id}`}
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
                  Aucune prise en charge pour ce patient
                </div>
              ))}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/patients"
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
            <Link
              to={`/prisesEnCharge/create?patientId=${id}`}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Nouvelle prise en charge
            </Link>
            <Link
              to={`/transferts/create?patientId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Nouveau transfert
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
