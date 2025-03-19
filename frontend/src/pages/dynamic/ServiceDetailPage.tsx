"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LitsTab from "@/components/tabs/LitsTab";
import ServicePersonnelTab from "@/components/tabs/ServicePersonnelTab";
import { ServiceCapacityMetrics } from "@/components/service/ServiceCapacityMetrics";
import { ServiceAlertBanner } from "@/components/service/ServiceAlertBanner";
import { ServiceOccupationChart } from "@/components/service/ServiceOccupationChart";
import { useServiceStore } from "@/stores/service-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type HeaderBadge,
} from "@/components/GenericDetailPage";

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Use the service store
  const {
    serviceSelectionne: service,
    isLoading,
    error,
    fetchServiceDetails,
    deleteService,
  } = useServiceStore();

  useEffect(() => {
    if (id) {
      fetchServiceDetails(id);
    }
  }, [id, fetchServiceDetails]);

  if (!service && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Service non trouvé</p>
        </div>
      </div>
    );
  }

  if (!service) return null;

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
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
                    <dt className="text-sm font-medium text-gray-500">Étage</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {service.etage}
                    </dd>
                  </div>
                )}

                {service.aile && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Aile</dt>
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
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
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
                    ? service.lits.filter((lit) => lit.serviceId === service.id)
                    : [];

                  // Calculer le compte et le pourcentage seulement si nous avons un tableau valide
                  const count = lits.filter((lit) => lit.type === type).length;
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
      ),
    },
    {
      id: "lits",
      label: "Lits",
      count: service.lits?.length || 0,
      content: (
        <LitsTab
          lits={
            Array.isArray(service.lits)
              ? service.lits.filter((lit) => lit.serviceId === service.id)
              : []
          }
          serviceId={service.id}
        />
      ),
    },
    {
      id: "personnel",
      label: "Personnel",
      count: service.personnel?.length || 0,
      content: (
        <ServicePersonnelTab
          personnels={service.personnel || []}
          serviceId={service.id}
        />
      ),
    },
  ];

  // Configuration des badges pour l'en-tête
  const badges: HeaderBadge[] = [];

  if (service.specialite) {
    badges.push({
      label: service.specialite,
      color: "bg-blue-200 text-blue-800",
    });
  }

  if (service.statut) {
    badges.push({
      label: service.statut,
      color:
        service.statut === "Actif"
          ? "bg-green-200 text-green-800"
          : "bg-red-200 text-red-800",
    });
  }

  return (
    <GenericDetailPage
      id={id || ""}
      title={`Service ${service.nom}`}
      subtitle={service.description || "Aucune description disponible"}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/services/edit/${id}`}
      backPath="/services"
      backLabel="Retour à la liste des services"
      onDelete={id ? () => deleteService(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer ce service?"
    />
  );
};

export default ServiceDetailPage;
