"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, truncateText } from "../utils/formatUtils";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { PriseEnChargeWithRelations } from "@/types/types";

const PrisesEnChargePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    prisesEnCharge,
    isLoading,
    error,
    fetchPrisesEnCharge,
    deletePriseEnCharge,
  } = usePriseEnChargeStore();

  useEffect(() => {
    fetchPrisesEnCharge();
  }, [fetchPrisesEnCharge]);

  // Configuration des colonnes
  const columns: ColumnConfig<PriseEnChargeWithRelations>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (pec) =>
        pec.patient ? (
          <div>
            <div className="font-medium text-gray-900">
              {pec.patient.nom} {pec.patient.prenom}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">ID: {pec.patientId}</span>
        ),
    },
    {
      key: "personnel",
      header: "Personnel",
      render: (pec) =>
        pec.personnel ? (
          <div>
            <div className="font-medium text-gray-900">
              {pec.personnel.nom} {pec.personnel.prenom}
            </div>
            <div className="text-xs text-gray-500">
              {pec.personnel.profession}
            </div>
          </div>
        ) : (
          <span className="text-gray-500">ID: {pec.personnelId}</span>
        ),
    },
    {
      key: "dateDebut",
      header: "Date début",
      render: (pec) => formatDate(pec.dateDebut),
    },
    {
      key: "dateFin",
      header: "Date fin",
      render: (pec) =>
        pec.dateFin ? (
          formatDate(pec.dateFin)
        ) : (
          <span className="text-green-500">En cours</span>
        ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (pec) => {
        const isActive = !pec.dateFin || new Date(pec.dateFin) > new Date();
        const status = isActive ? "En cours" : "Terminée";
        const statusClass = isActive
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800";

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "diagnostic",
      header: "Diagnostic",
      render: (pec) => truncateText(pec.diagnostic || "Non renseigné", 50),
    },
    {
      key: "traitement",
      header: "Traitement",
      render: (pec) => truncateText(pec.traitement || "Non renseigné", 50),
    },
    {
      key: "description",
      header: "Description",
      render: (pec) => truncateText(pec.description || "Non renseignée", 50),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<PriseEnChargeWithRelations>[] = [
    {
      label: "Détails",
      to: "/prisesEnCharge/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/prisesEnCharge/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (pec) => {
        if (
          window.confirm(
            "Êtes-vous sûr de vouloir supprimer cette prise en charge ?"
          )
        ) {
          deletePriseEnCharge(pec.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "La prise en charge a été supprimée avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer la prise en charge",
                variant: "destructive",
              });
            });
        }
      },
      color: "red",
    },
  ];

  return (
    <GenericListPage
      title="Prises en charge"
      createPath="/prisesEnCharge/create"
      createButtonLabel="Nouvelle prise en charge"
      data={prisesEnCharge}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchPrisesEnCharge}
      onRowClick={(pec) => navigate(`/prisesEnCharge/${pec.id}`)}
      searchPlaceholder="Rechercher par patient, personnel, diagnostic..."
      searchKeys={["diagnostic", "traitement", "description"]}
      emptyStateMessage="Aucune prise en charge disponible"
      loadingMessage="Chargement des prises en charge..."
    />
  );
};

export default PrisesEnChargePage;
