"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type ActionButton,
  type HeaderBadge,
} from "@/components/GenericDetailPage";

// Fonction pour calculer la durée entre deux dates
const calculateDuration = (
  startDate: string,
  endDate?: string | null
): string => {
  if (!endDate) return "En cours";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Moins d'un jour";
  if (diffDays === 1) return "1 jour";
  if (diffDays < 30) return `${diffDays} jours`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 mois";
  if (diffMonths < 12) return `${diffMonths} mois`;

  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  if (remainingMonths === 0) {
    return diffYears === 1 ? "1 an" : `${diffYears} ans`;
  }
  return diffYears === 1
    ? `1 an et ${remainingMonths} mois`
    : `${diffYears} ans et ${remainingMonths} mois`;
};

const PriseEnChargeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Utiliser le store prise-en-charge
  const {
    priseEnChargeSelectionnee,
    isLoading,
    error,
    fetchPriseEnChargeDetails,
    deletePriseEnCharge,
  } = usePriseEnChargeStore();

  useEffect(() => {
    if (id) {
      fetchPriseEnChargeDetails(id);
    }
  }, [id, fetchPriseEnChargeDetails]);

  if (!priseEnChargeSelectionnee && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Prise en charge non trouvée</p>
        </div>
      </div>
    );
  }

  if (!priseEnChargeSelectionnee) return null;

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Détails généraux de la prise en charge */}
          <Card title="Informations générales" className="h-full">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Identifiant de la prise en charge
                </dt>
                <dd className="mt-1 text-gray-900 font-mono">
                  {priseEnChargeSelectionnee.id}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date de création
                </dt>
                <dd className="mt-1 text-gray-900">Non spécifiée</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
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
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-center flex-grow">
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
                  <p className="font-medium">
                    {priseEnChargeSelectionnee.patient?.nom}{" "}
                    {priseEnChargeSelectionnee.patient?.prenom}
                  </p>
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
                  <p className="font-medium">
                    {priseEnChargeSelectionnee.personnel?.nom}{" "}
                    {priseEnChargeSelectionnee.personnel?.prenom}
                  </p>
                </div>
              </div>

              {/* Section des dates de prise en charge */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-center items-center">
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-500">
                      Date de début
                    </div>
                    <div className="text-base font-semibold mt-1">
                      {formatDate(priseEnChargeSelectionnee.dateDebut)}
                    </div>
                  </div>

                  {/* Flèche indiquant la durée */}
                  <div className="mx-6 flex items-center">
                    <div
                      className={`px-4 py-1 rounded-full text-sm ${
                        priseEnChargeSelectionnee.dateFin
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {priseEnChargeSelectionnee.dateFin
                        ? "En cours"
                        : "Terminée"}
                    </div>
                    <svg
                      className="w-6 h-6 text-gray-400 mx-2"
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

                  <div className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-500">
                      Date de fin
                    </div>
                    <div className="text-base font-semibold mt-1">
                      {priseEnChargeSelectionnee.dateFin
                        ? formatDate(priseEnChargeSelectionnee.dateFin)
                        : "Non définie"}
                    </div>
                  </div>
                </div>

                {/* Durée totale de la prise en charge */}
                {priseEnChargeSelectionnee.dateFin && (
                  <div className="text-center mt-4 text-sm text-gray-500">
                    Durée totale:{" "}
                    {calculateDuration(
                      priseEnChargeSelectionnee.dateDebut,
                      priseEnChargeSelectionnee.dateFin
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "patient",
      label: "Patient",
      content: (
        <Card title="Patient" className="h-full">
          {priseEnChargeSelectionnee.patient ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-700 mr-4">
                  {priseEnChargeSelectionnee.patient.prenom.charAt(0)}
                  {priseEnChargeSelectionnee.patient.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-medium">
                    {priseEnChargeSelectionnee.patient.prenom}{" "}
                    {priseEnChargeSelectionnee.patient.nom}
                  </h3>
                  <p className="text-gray-600">
                    Né(e) le{" "}
                    {formatDate(
                      priseEnChargeSelectionnee.patient.dateNaissance
                    )}
                  </p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-1 gap-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    N° de sécurité sociale
                  </dt>
                  <dd className="mt-1 text-gray-900">
                    {priseEnChargeSelectionnee.patient.numeroSecu}
                  </dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link
                  to={`/patients/${priseEnChargeSelectionnee.patientId}`}
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
              <p className="text-sm">
                ID: {priseEnChargeSelectionnee.patientId}
              </p>
            </div>
          )}
        </Card>
      ),
    },
    {
      id: "personnel",
      label: "Personnel",
      content: (
        <Card title="Personnel soignant" className="h-full">
          {priseEnChargeSelectionnee.personnel ? (
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700 mr-4">
                  {priseEnChargeSelectionnee.personnel.prenom.charAt(0)}
                  {priseEnChargeSelectionnee.personnel.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-medium">
                    {priseEnChargeSelectionnee.personnel.prenom}{" "}
                    {priseEnChargeSelectionnee.personnel.nom}
                  </h3>
                  <p className="text-gray-600">
                    {priseEnChargeSelectionnee.personnel.profession}
                  </p>
                </div>
              </div>

              {priseEnChargeSelectionnee.personnel.service && (
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
                      to={`/services/${priseEnChargeSelectionnee.personnel.service.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {priseEnChargeSelectionnee.personnel.service.nom}
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Link
                  to={`/personnels/${priseEnChargeSelectionnee.personnelId}`}
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
              <p className="mb-1">Information du personnel non disponible</p>
              <p className="text-sm">
                ID: {priseEnChargeSelectionnee.personnelId}
              </p>
            </div>
          )}
        </Card>
      ),
    },
  ];

  // Configuration des badges pour l'en-tête
  const badges: HeaderBadge[] = [];

  if (priseEnChargeSelectionnee.patient) {
    badges.push({
      label: `Patient: ${priseEnChargeSelectionnee.patient.nom} ${priseEnChargeSelectionnee.patient.prenom}`,
      color: "bg-blue-200 text-blue-800",
    });
  }

  if (priseEnChargeSelectionnee.personnel) {
    badges.push({
      label: `Personnel: ${priseEnChargeSelectionnee.personnel.profession}`,
      color: "bg-green-200 text-green-800",
    });
  }

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [];

  if (priseEnChargeSelectionnee.patient) {
    footerActions.push({
      label: "Voir le patient",
      to: `/patients/${priseEnChargeSelectionnee.patientId}`,
      color: "blue",
    });
  }

  if (priseEnChargeSelectionnee.personnel) {
    footerActions.push({
      label: "Voir le personnel",
      to: `/personnels/${priseEnChargeSelectionnee.personnelId}`,
      color: "green",
    });
  }

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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );

  return (
    <GenericDetailPage
      id={id || ""}
      title="Prise en charge"
      icon={headerIcon}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/prisesEnCharge/edit/${id}`}
      backPath="/prisesEnCharge"
      backLabel="Retour à la liste"
      onDelete={id ? () => deletePriseEnCharge(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cette prise en charge ?"
      footerActions={footerActions}
    />
  );
};

export default PriseEnChargeDetailPage;
