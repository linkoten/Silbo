import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LitsTab from "@/components/tabs/LitsTab";
import ServicePersonnelTab from "@/components/tabs/ServicePersonnelTab";
import { ServiceCapacityMetrics } from "@/components/service/ServiceCapacityMetrics";
import { ServiceAlertBanner } from "@/components/service/ServiceAlertBanner";
import { ServiceOccupationChart } from "@/components/service/ServiceOccupationChart";
import { Toaster } from "@/components/ui/toaster";
import { useServiceStore } from "@/stores/service-store";

// Composant Card réutilisable
const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "lits" | "personnel">(
    "info"
  );

  // Use the service store instead of local state
  const {
    serviceSelectionne: service,
    isLoading,
    error,
    fetchServiceDetails,
    deleteService,
  } = useServiceStore();

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
      fetchServiceDetails(id);
    }
  }, [id, fetchServiceDetails]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce service?")) {
      return;
    }

    try {
      if (id) {
        const success = await deleteService(id);
        if (success) {
          navigate("/services");
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
            Chargement des détails du service...
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

  console.log("Service:", service);
  console.log("Service lits:", service.lits);
  console.log("Est un tableau:", Array.isArray(service.lits));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Service {service.nom}
            </h1>
            <p className="text-gray-600 mt-1">
              {service.description || "Aucune description disponible"}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/services/edit/${id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "info"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab("lits")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "lits"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Lits ({service.lits?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("personnel")}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === "personnel"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              Personnel ({service.personnel?.length || 0})
            </button>
          </div>

          <div className="p-6">
            {/* Onglet Informations */}
            {activeTab === "info" && (
              <div>
                {/* Bannière d'alerte - apparaîtra uniquement si des conditions d'alerte sont remplies */}
                <ServiceAlertBanner
                  capaciteOccupee={
                    ((service.litsOccupes || 0) / service.capacite) * 100
                  }
                  capaciteActuelleLitsDisponibles={service.litsDisponibles || 0}
                  pourcentageLitsOccupes={service.tauxOccupation || 0}
                />

                {/* Grille des informations et métriques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Première colonne - Informations du service */}
                  <Card title="Informations du service" className="h-full">
                    <dl className="grid grid-cols-1 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Identifiant
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 font-mono">
                          {service.id}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Établissement
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {service.etablissement ? (
                            <Link
                              to={`/etablissements/${service.etablissementId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {service.etablissement.nom}
                            </Link>
                          ) : (
                            `ID: ${service.etablissementId}`
                          )}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Capacité
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {service.capacite} lits
                        </dd>
                      </div>

                      {service.etage && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Étage
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {service.etage}
                          </dd>
                        </div>
                      )}

                      {service.aile && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Aile
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {service.aile}
                          </dd>
                        </div>
                      )}

                      {service.specialite && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Spécialité
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {service.specialite}
                          </dd>
                        </div>
                      )}

                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Statut
                        </dt>
                        <dd className="mt-1">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              service.statut === "Fermé"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {service.statut || "Actif"}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </Card>

                  {/* Deuxième colonne - Métriques de capacité */}
                  <ServiceCapacityMetrics
                    capaciteTotal={service.capacite}
                    litsDisponibles={service.litsDisponibles || 0}
                    litsOccupes={service.litsOccupes || 0}
                  />
                </div>

                {/* Section pour le graphique d'occupation */}
                <div className="mt-8">
                  {/* Graphique d'occupation */}
                  <ServiceOccupationChart
                    capaciteTotal={service.capacite}
                    litsOccupes={service.litsOccupes || 0}
                    litsLibres={service.litsDisponibles || 0}
                    litsEnMaintenance={service.litsEnMaintenance || 0}
                  />
                </div>

                {/* Informations supplémentaires sur les types de lits */}
                <div className="mt-8">
                  <Card title="Distribution des lits par type">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        "Standard",
                        "Médical",
                        "Soins intensifs",
                        "Pédiatrique",
                        "Psychiatrique",
                      ].map((type) => {
                        // S'assurer que service.lits est un tableau et qu'il appartient bien à ce service
                        const lits = Array.isArray(service.lits)
                          ? service.lits.filter(
                              (lit) => lit.serviceId === service.id
                            )
                          : [];

                        // Calculer le compte et le pourcentage seulement si nous avons un tableau valide
                        const count = lits.filter(
                          (lit) => lit.type === type
                        ).length;
                        const percentage =
                          lits.length > 0
                            ? Math.round((count / lits.length) * 100)
                            : 0;

                        return (
                          <div
                            key={type}
                            className="bg-gray-50 p-3 rounded-lg text-center"
                          >
                            <div className="text-sm font-medium text-gray-600">
                              {type}
                            </div>
                            <div className="mt-2 text-2xl font-bold text-blue-600">
                              {count}
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage}% du total
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Onglet Lits - Utilisation du composant LitsTab */}
            {activeTab === "lits" && service && (
              <LitsTab
                lits={
                  Array.isArray(service.lits)
                    ? service.lits.filter((lit) => lit.serviceId === service.id)
                    : []
                }
                serviceId={service.id}
              />
            )}

            {/* Onglet Personnel - Utilisation du composant ServicePersonnelTab */}
            {activeTab === "personnel" && service && (
              <ServicePersonnelTab
                personnels={service.personnel || []}
                serviceId={service.id}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to="/services"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des services
          </Link>
        </div>

        {/* Ajouter le composant Toaster pour afficher les notifications */}
        <Toaster />
      </div>
    </div>
  );
};

export default ServiceDetailPage;
