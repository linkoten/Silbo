"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ServicesTab from "@/components/tabs/ServicesTab";
import PersonnelTab from "@/components/tabs/PersonnelTab";
import ReservationsTab from "@/components/tabs/ReservationsTab";
import { useEtablissementStore } from "@/stores/etablissement-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type ActionButton,
} from "@/components/GenericDetailPage";

// Composant d'indicateur de capacité
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

const EtablissementDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Utiliser le store Zustand
  const {
    etablissementSelectionne: etablissement,
    isLoading,
    error,
    fetchEtablissementDetails,
    deleteEtablissement,
  } = useEtablissementStore();

  useEffect(() => {
    if (id) {
      fetchEtablissementDetails(id);
    }
  }, [id, fetchEtablissementDetails]);

  if (!etablissement && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Établissement non trouvé</p>
        </div>
      </div>
    );
  }

  if (!etablissement) return null;

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Informations de l'établissement" className="h-full">
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
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="mt-1 text-gray-900">{etablissement.adresse}</dd>
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
                  used={etablissement.lits ? etablissement.lits.length : 0}
                />

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm">Disponible</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {etablissement.capacite -
                        (etablissement.lits ? etablissement.lits.length : 0)}
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
                    <p className="text-gray-500">Aucun service enregistré</p>
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
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "services",
      label: "Services",
      count: etablissement.services.length,
      content: (
        <ServicesTab
          services={etablissement.services}
          etablissementId={etablissement.id}
        />
      ),
    },
    {
      id: "personnel",
      label: "Personnel",
      count: etablissement.personnels?.length || 0,
      content: (
        <PersonnelTab
          personnels={etablissement.personnels || []}
          etablissementId={etablissement.id}
        />
      ),
    },
    {
      id: "reservations",
      label: "Réservations",
      count: etablissement.reservations?.length || 0,
      content: (
        <ReservationsTab reservations={etablissement.reservations || []} />
      ),
    },
  ];

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [
    {
      label: "Ajouter un service",
      to: `/services/create?etablissementId=${id}`,
      color: "blue",
    },
    {
      label: "Ajouter du personnel",
      to: `/personnels/create?etablissementId=${id}`,
      color: "green",
    },
    {
      label: "Créer une réservation",
      to: `/reservations-lits/create`,
      color: "purple",
    },
  ];

  // Icône pour l'en-tête
  const headerIcon = (
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
  );

  // Badges pour l'en-tête
  const badges = [
    {
      label: "Établissement de santé",
      color: "bg-blue-200 text-blue-800",
    },
    {
      label: `${etablissement.services.length} services`,
      color: "bg-green-200 text-green-800",
    },
  ];

  return (
    <GenericDetailPage
      id={id || ""}
      title={etablissement.nom}
      icon={headerIcon}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/etablissements/edit/${id}`}
      backPath="/etablissements"
      backLabel="Retour à la liste des établissements"
      onDelete={id ? () => deleteEtablissement(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cet établissement ?"
      footerActions={footerActions}
    />
  );
};

export default EtablissementDetailPage;
