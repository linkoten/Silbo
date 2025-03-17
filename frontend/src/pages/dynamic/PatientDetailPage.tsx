import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TransfertsTab from "@/components/tabs/TransfertsTab";
import PrisesEnChargeTab from "@/components/tabs/PrisesEnChargeTab";
import { usePatientStore } from "@/stores/patient-store";
import { useTransfertStore } from "@/stores/transfert-store";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";

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

  // Utiliser les stores Zustand pour les données
  const {
    patientSelectionne,
    isLoading: isLoadingPatient,
    error: patientError,
    fetchPatientDetails,
    deletePatient,
  } = usePatientStore();
  const {
    transferts,
    isLoading: isLoadingTransferts,
    error: transfertsError,
    fetchTransfertsPatient,
  } = useTransfertStore();
  const {
    prisesEnCharge,
    isLoading: isLoadingPEC,
    error: pecError,
    fetchPrisesEnChargePatient,
  } = usePriseEnChargeStore();

  const [activeTab, setActiveTab] = useState<
    "info" | "transferts" | "prisesEnCharge"
  >("info");

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Charger les données du patient et ses relations
  useEffect(() => {
    if (id) {
      fetchPatientDetails(id);
      fetchTransfertsPatient(id);
      fetchPrisesEnChargePatient(id);
    }
  }, [
    id,
    fetchPatientDetails,
    fetchTransfertsPatient,
    fetchPrisesEnChargePatient,
  ]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      return;
    }

    try {
      if (id) {
        const success = await deletePatient(id);
        if (success) {
          navigate("/patients");
        }
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  const calculateAge = (dateString: string) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // État de chargement combiné de tous les stores
  const isLoading = isLoadingPatient || isLoadingTransferts || isLoadingPEC;
  // Erreur combinée de tous les stores
  const error = patientError || transfertsError || pecError;

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
            Chargement des données du patient...
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

  if (!patientSelectionne) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Patient non trouvé</p>
        </div>
      </div>
    );
  }

  const patient = patientSelectionne;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {patient.nom.charAt(0)}
                  {patient.prenom.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {patient.nom} {patient.prenom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      {calculateAge(patient.dateNaissance!)} ans
                    </Badge>
                    <Badge
                      color={
                        patient.statut === "Hospitalisé"
                          ? "bg-green-200 text-green-800"
                          : patient.statut === "Sortant"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }
                    >
                      {patient.statut}
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
                Transferts ({transferts.length})
              </Tab>
              <Tab
                active={activeTab === "prisesEnCharge"}
                onClick={() => setActiveTab("prisesEnCharge")}
              >
                Prises en charge ({prisesEnCharge.length})
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
                        Nom et prénom
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {patient.nom} {patient.prenom}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date de naissance
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {formatDate(patient.dateNaissance!)} (
                        {calculateAge(patient.dateNaissance!)} ans)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.adresse || "Non renseignée"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Numéro de sécurité sociale
                      </dt>
                      <dd className="mt-1 text-gray-900 font-mono">
                        {patient.numeroSecu || "Non renseigné"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Contact
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        <div>
                          {patient.telephone || "Téléphone non renseigné"}
                        </div>
                        <div>{patient.email || "Email non renseigné"}</div>
                      </dd>
                    </div>
                  </dl>
                </Card>

                <Card title="Informations médicales" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Groupe sanguin
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.groupeSanguin || "Non renseigné"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Allergies
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.allergie || "Aucune allergie connue"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Antécédents médicaux
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.antecedents || "Aucun antécédent renseigné"}
                      </dd>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <dt className="text-sm font-medium text-gray-500">
                        Date d'admission
                      </dt>
                      <dd className="mt-1 text-gray-900 font-medium">
                        {formatDate(patient.dateAdmission!)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Date de sortie prévue
                      </dt>
                      <dd className="mt-1 text-gray-900">
                        {patient.dateSortie
                          ? formatDate(patient.dateSortie)
                          : "Non définie"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Statut
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-md text-sm font-medium 
                          ${
                            patient.statut === "Hospitalisé"
                              ? "bg-green-100 text-green-800"
                              : patient.statut === "Sortant"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {patient.statut}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </Card>
              </div>
            )}

            {/* Onglet Transferts - Utilisation du composant TransfertsTab */}
            {activeTab === "transferts" && (
              <TransfertsTab transferts={transferts} patientId={patient.id} />
            )}

            {/* Onglet Prises en charge - Utilisation du composant PrisesEnChargeTab */}
            {activeTab === "prisesEnCharge" && (
              <PrisesEnChargeTab
                prisesEnCharge={prisesEnCharge}
                patientId={patient.id}
              />
            )}
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
            Retour à la liste des patients
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/transferts/create?patientId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Créer un transfert
            </Link>
            <Link
              to={`/prises-en-charge/create?patientId=${id}`}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Créer une prise en charge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailPage;
