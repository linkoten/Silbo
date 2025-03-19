"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import TransfertsTab from "@/components/tabs/TransfertsTab";
import PrisesEnChargeTab from "@/components/tabs/PrisesEnChargeTab";
import { usePatientStore } from "@/stores/patient-store";
import { useTransfertStore } from "@/stores/transfert-store";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type ActionButton,
} from "@/components/GenericDetailPage";

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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

  // État de chargement combiné de tous les stores
  const isLoading = isLoadingPatient || isLoadingTransferts || isLoadingPEC;
  // Erreur combinée de tous les stores
  const error = patientError || transfertsError || pecError;

  if (!patientSelectionne && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Patient non trouvé</p>
        </div>
      </div>
    );
  }

  if (!patientSelectionne) return null;

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

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Informations personnelles" className="h-full">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Nom et prénom
                </dt>
                <dd className="mt-1 text-lg text-gray-900 font-medium">
                  {patientSelectionne.nom} {patientSelectionne.prenom}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date de naissance
                </dt>
                <dd className="mt-1 text-gray-900">
                  {formatDate(patientSelectionne.dateNaissance!)} (
                  {calculateAge(patientSelectionne.dateNaissance!)} ans)
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="mt-1 text-gray-900">
                  {patientSelectionne.adresse || "Non renseignée"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Numéro de sécurité sociale
                </dt>
                <dd className="mt-1 text-gray-900 font-mono">
                  {patientSelectionne.numeroSecu || "Non renseigné"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact</dt>
                <dd className="mt-1 text-gray-900">
                  <div>
                    {patientSelectionne.telephone || "Téléphone non renseigné"}
                  </div>
                  <div>{patientSelectionne.email || "Email non renseigné"}</div>
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
                  {patientSelectionne.groupeSanguin || "Non renseigné"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                <dd className="mt-1 text-gray-900">
                  {patientSelectionne.allergie || "Aucune allergie connue"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Antécédents médicaux
                </dt>
                <dd className="mt-1 text-gray-900">
                  {patientSelectionne.antecedents ||
                    "Aucun antécédent renseigné"}
                </dd>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <dt className="text-sm font-medium text-gray-500">
                  Date d'admission
                </dt>
                <dd className="mt-1 text-gray-900 font-medium">
                  {formatDate(patientSelectionne.dateAdmission!)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date de sortie prévue
                </dt>
                <dd className="mt-1 text-gray-900">
                  {patientSelectionne.dateSortie
                    ? formatDate(patientSelectionne.dateSortie)
                    : "Non définie"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium 
                    ${
                      patientSelectionne.statut === "Hospitalisé"
                        ? "bg-green-100 text-green-800"
                        : patientSelectionne.statut === "Sortant"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {patientSelectionne.statut}
                  </span>
                </dd>
              </div>
            </dl>
          </Card>
        </div>
      ),
    },
    {
      id: "transferts",
      label: "Transferts",
      count: transferts.length,
      content: (
        <TransfertsTab
          transferts={transferts}
          patientId={patientSelectionne.id}
        />
      ),
    },
    {
      id: "prisesEnCharge",
      label: "Prises en charge",
      count: prisesEnCharge.length,
      content: (
        <PrisesEnChargeTab
          prisesEnCharge={prisesEnCharge}
          patientId={patientSelectionne.id}
        />
      ),
    },
  ];

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [
    {
      label: "Créer un transfert",
      to: `/transferts/create?patientId=${id}`,
      color: "blue",
    },
    {
      label: "Créer une prise en charge",
      to: `/prisesEnCharge/create?patientId=${id}`,
      color: "green",
    },
  ];

  // Badges pour l'en-tête
  const badges = [
    {
      label: `${calculateAge(patientSelectionne.dateNaissance!)} ans`,
      color: "bg-blue-200 text-blue-800",
    },
    {
      label: patientSelectionne.statut as string,
      color:
        patientSelectionne.statut === "Hospitalisé"
          ? "bg-green-200 text-green-800"
          : patientSelectionne.statut === "Sortant"
          ? "bg-yellow-200 text-yellow-800"
          : "bg-gray-200 text-gray-800",
    },
  ];

  return (
    <GenericDetailPage
      id={id || ""}
      title={`${patientSelectionne.nom} ${patientSelectionne.prenom}`}
      initials={`${patientSelectionne.nom.charAt(
        0
      )}${patientSelectionne.prenom.charAt(0)}`}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/patients/edit/${id}`}
      backPath="/patients"
      backLabel="Retour à la liste des patients"
      onDelete={id ? () => deletePatient(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer ce patient ?"
      footerActions={footerActions}
    />
  );
};

export default PatientDetailPage;
