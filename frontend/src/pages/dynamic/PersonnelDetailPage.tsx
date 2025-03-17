import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";
import { usePersonnelStore } from "@/stores/personnel-store";
import { Toaster } from "@/components/ui/toaster";

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
  const [activeTab, setActiveTab] = useState<
    "info" | "prisesEnCharge" | "services"
  >("info");

  // Utiliser le store personnel
  const {
    personnelSelectionne: personnel,
    isLoading,
    error,
    fetchPersonnelDetails,
    deletePersonnel,
  } = usePersonnelStore();

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
      fetchPersonnelDetails(id);
    }
  }, [id, fetchPersonnelDetails]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      return;
    }

    try {
      if (id) {
        const success = await deletePersonnel(id);
        if (success) {
          navigate("/personnels");
        }
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Calculer l'âge à partir de la date de naissance
  const calculateAge = (dateString?: Date) => {
    if (!dateString) return null;
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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
            Chargement des détails du personnel...
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
            Retour à la liste des personnels
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
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {personnel.nom.charAt(0)}
                  {personnel.prenom.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {personnel.nom} {personnel.prenom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge color="bg-blue-200 text-blue-800">
                      {personnel.profession}
                    </Badge>
                    {personnel.specialite && (
                      <Badge color="bg-purple-200 text-purple-800">
                        {personnel.specialite}
                      </Badge>
                    )}
                    {personnel.dateNaissance && (
                      <Badge color="bg-green-200 text-green-800">
                        {calculateAge(personnel.dateNaissance)} ans
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
                active={activeTab === "prisesEnCharge"}
                onClick={() => setActiveTab("prisesEnCharge")}
              >
                Prises en charge ({personnel.prisesEnCharge?.length || 0})
              </Tab>
              <Tab
                active={activeTab === "services"}
                onClick={() => setActiveTab("services")}
              >
                Services ({personnel.servicesResponsable?.length || 0})
              </Tab>
            </div>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Informations personnelles */}
                <Card title="Informations personnelles" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Nom complet
                      </dt>
                      <dd className="mt-1 text-lg text-gray-900 font-medium">
                        {personnel.nom} {personnel.prenom}
                      </dd>
                    </div>

                    {personnel.dateNaissance && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date de naissance
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {formatDate(personnel.dateNaissance.toString())} (
                          {calculateAge(personnel.dateNaissance)} ans)
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Contact
                      </dt>
                      <dd className="mt-1">
                        <div className="flex items-center mb-1">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {personnel.email || "Email non renseigné"}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {personnel.telephone || "Téléphone non renseigné"}
                        </div>
                      </dd>
                    </div>

                    {personnel.matricule && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Matricule
                        </dt>
                        <dd className="mt-1 text-gray-900 font-mono">
                          {personnel.matricule}
                        </dd>
                      </div>
                    )}
                  </dl>
                </Card>

                {/* Informations professionnelles */}
                <Card title="Informations professionnelles" className="h-full">
                  <dl className="grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Profession
                      </dt>
                      <dd className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                          {personnel.profession}
                        </span>
                      </dd>
                    </div>

                    {personnel.specialite && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Spécialité
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {personnel.specialite}
                        </dd>
                      </div>
                    )}

                    {personnel.service && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Service affecté
                        </dt>
                        <dd className="mt-1">
                          <Link
                            to={`/services/${personnel.serviceId}`}
                            className="text-blue-600 hover:underline flex items-center"
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
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {personnel.service.nom}
                          </Link>
                        </dd>
                      </div>
                    )}

                    {personnel.etablissement && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Établissement
                        </dt>
                        <dd className="mt-1">
                          <Link
                            to={`/etablissements/${personnel.etablissementId}`}
                            className="text-blue-600 hover:underline flex items-center"
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
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                            {personnel.etablissement.nom}
                          </Link>
                        </dd>
                      </div>
                    )}

                    {personnel.dateEmbauche && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Date d'embauche
                        </dt>
                        <dd className="mt-1 text-gray-900">
                          {formatDate(personnel.dateEmbauche.toString())}
                        </dd>
                      </div>
                    )}

                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Statut
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium
                        ${
                          personnel.statut === "Actif"
                            ? "bg-green-100 text-green-800"
                            : personnel.statut === "En congé"
                            ? "bg-yellow-100 text-yellow-800"
                            : personnel.statut === "Inactif"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                        >
                          {personnel.statut || "Non défini"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </Card>
              </div>
            )}

            {/* Onglet Prises en charge */}
            {activeTab === "prisesEnCharge" && (
              <div>
                {personnel.prisesEnCharge?.length > 0 ? (
                  <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date début
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date fin
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
                        {personnel.prisesEnCharge.map((pec) => (
                          <tr key={pec.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pec.patient ? (
                                <Link
                                  to={`/patients/${pec.patientId}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {pec.patient.nom} {pec.patient.prenom}
                                </Link>
                              ) : (
                                <span className="text-gray-500">
                                  ID: {pec.patientId}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {formatDate(pec.dateDebut)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {pec.dateFin ? (
                                formatDate(pec.dateFin)
                              ) : (
                                <span className="text-green-500">En cours</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium 
                                ${
                                  !pec.dateFin
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {!pec.dateFin ? "Active" : "Terminée"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/prises-en-charge/${pec.id}`}
                                className="text-blue-600 hover:text-blue-900 mr-3"
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
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-4">
                      Aucune prise en charge pour ce personnel
                    </p>
                    <Link
                      to={`/prises-en-charge/create?personnelId=${id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Ajouter une prise en charge
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Services responsable */}
            {activeTab === "services" && (
              <div>
                {personnel.servicesResponsable &&
                personnel.servicesResponsable.length > 0 ? (
                  <div className="overflow-x-auto bg-white rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nom du service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Établissement
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Capacité
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
                        {personnel.servicesResponsable.map((service) => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                to={`/services/${service.id}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {service.nom}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {service.etablissementId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {service.capacite} lits
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium 
                                ${
                                  service.statut === "Actif"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {service.statut || "Actif"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link
                                to={`/services/${service.id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Voir le service
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      Ce personnel n'est responsable d'aucun service
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
            Retour à la liste des personnels
          </Link>

          <div className="flex space-x-3">
            <Link
              to={`/prises-en-charge/create?personnelId=${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Nouvelle prise en charge
            </Link>
          </div>
        </div>

        <Toaster />
      </div>
    </div>
  );
};

export default PersonnelDetailPage;
