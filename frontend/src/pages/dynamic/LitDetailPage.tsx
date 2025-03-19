"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReservationsTab from "@/components/tabs/ReservationsTab";
import { useLitStore } from "@/stores/lit-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type ActionButton,
} from "@/components/GenericDetailPage";

const LitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Utilisation du store Zustand
  const { litSelectionne, isLoading, error, fetchLitDetails, deleteLit } =
    useLitStore();

  useEffect(() => {
    if (id) {
      fetchLitDetails(id);
    }
  }, [id, fetchLitDetails]);

  if (!litSelectionne && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Lit non trouvé</p>
        </div>
      </div>
    );
  }

  if (!litSelectionne) return null;

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Informations du lit" className="h-full">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Numéro de lit
                </dt>
                <dd className="mt-1 text-lg text-gray-900 font-medium">
                  {litSelectionne.numeroLit}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Service</dt>
                <dd className="mt-1 text-gray-900">
                  {litSelectionne.service ? (
                    <Link
                      to={`/services/${litSelectionne.serviceId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {litSelectionne.service.nom}
                    </Link>
                  ) : (
                    <span className="text-gray-500">
                      ID: {litSelectionne.serviceId}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Identifiant du lit
                </dt>
                <dd className="mt-1 text-gray-400 text-sm font-mono">
                  {litSelectionne.id}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Disponibilité" className="h-full">
            <div className="flex flex-col items-center justify-center h-full">
              {!litSelectionne.reservations?.length ? (
                <div>
                  <span className="inline-block p-3 bg-green-100 text-green-700 rounded-full mb-4">
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
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium text-lg">
                    Lit disponible
                  </p>
                  <p className="text-gray-500 mt-2">
                    Aucune réservation en cours
                  </p>
                  <Link
                    to={`/reservations-lits/create?litId=${id}`}
                    className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Réserver ce lit
                  </Link>
                </div>
              ) : (
                <div>
                  <span className="inline-block p-3 bg-yellow-100 text-yellow-700 rounded-full mb-4">
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
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </span>
                  <p className="text-gray-900 font-medium text-lg">
                    Lit réservé
                  </p>
                  <p className="text-gray-500 mt-2">
                    {litSelectionne.reservations.length} réservation(s)
                    active(s)
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "reservations",
      label: "Réservations",
      count: litSelectionne.reservations?.length || 0,
      content: (
        <ReservationsTab
          reservations={litSelectionne.reservations || []}
          litId={litSelectionne.id}
        />
      ),
    },
  ];

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [
    {
      label: "Réserver ce lit",
      to: `/reservations-lits/create?litId=${id}`,
      color: "blue",
    },
    {
      label: "Modifier ce lit",
      to: `/lits/edit/${id}`,
      color: "amber",
    },
  ];

  // Badges pour l'en-tête
  const badges = [];
  if (litSelectionne.service) {
    badges.push({
      label: `Service: ${litSelectionne.service.nom}`,
      color: "bg-green-200 text-green-800",
    });
  }

  return (
    <GenericDetailPage
      id={id || ""}
      title={`Lit n°${litSelectionne.numeroLit}`}
      initials={litSelectionne.numeroLit}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/lits/edit/${id}`}
      backPath="/lits"
      backLabel="Retour à la liste des lits"
      onDelete={id ? () => deleteLit(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer ce lit ?"
      footerActions={footerActions}
    />
  );
};

export default LitDetailPage;
