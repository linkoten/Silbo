"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, truncateText } from "../utils/formatUtils";
import { useTransfertStore } from "@/stores/transfert-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { TransfertWithRelations } from "@/types/types";

const TransfertsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    transferts,
    isLoading,
    error,
    fetchTransferts,
    deleteTransfert,
    validateTransfert,
  } = useTransfertStore();

  useEffect(() => {
    fetchTransferts();
  }, [fetchTransferts]);

  // Configuration des colonnes
  const columns: ColumnConfig<TransfertWithRelations>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (transfert) =>
        transfert.patient ? (
          <a
            href={`/patients/${transfert.patientId}`}
            className="text-blue-600 hover:underline"
          >
            {transfert.patient.nom} {transfert.patient.prenom}
          </a>
        ) : (
          <span className="text-gray-500">ID: {transfert.patientId}</span>
        ),
    },
    {
      key: "date",
      header: "Date",
      render: (transfert) => formatDate(transfert.date),
    },
    {
      key: "serviceDepart",
      header: "Service départ",
      render: (transfert) =>
        transfert.serviceDepart ? (
          <a
            href={`/services/${transfert.serviceDepartId}`}
            className="text-blue-600 hover:underline"
          >
            {transfert.serviceDepart.nom}
          </a>
        ) : (
          <span className="text-gray-500">ID: {transfert.serviceDepartId}</span>
        ),
    },
    {
      key: "serviceArrivee",
      header: "Service arrivée",
      render: (transfert) =>
        transfert.serviceArrivee ? (
          <a
            href={`/services/${transfert.serviceArriveeId}`}
            className="text-blue-600 hover:underline"
          >
            {transfert.serviceArrivee.nom}
          </a>
        ) : (
          <span className="text-gray-500">
            ID: {transfert.serviceArriveeId}
          </span>
        ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (transfert) => {
        // Déterminer le statut à afficher et sa classe CSS
        const now = new Date();
        const transfertDate = new Date(transfert.date);

        const status =
          transfert.statut || (transfertDate > now ? "Planifié" : "Effectué");
        let statusClass = "bg-gray-100 text-gray-800";

        if (status === "Validé") statusClass = "bg-green-100 text-green-800";
        else if (status === "Planifié")
          statusClass = "bg-blue-100 text-blue-800";
        else if (status === "En cours")
          statusClass = "bg-yellow-100 text-yellow-800";
        else if (status === "Annulé") statusClass = "bg-red-100 text-red-800";

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
      key: "motif",
      header: "Motif",
      render: (transfert) =>
        truncateText(transfert.motif || "Non spécifié", 30),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<TransfertWithRelations>[] = [
    {
      label: "Détails",
      to: "/transferts/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/transferts/edit/:id",
      color: "indigo",
    },
    {
      label: "Valider",
      onClick: (transfert) => {
        if (window.confirm("Voulez-vous valider ce transfert ?")) {
          validateTransfert(transfert.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le transfert a été validé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de valider le transfert",
                variant: "destructive",
              });
            });
        }
      },
      color: "green",
      showCondition: (transfert) => {
        const now = new Date();
        const transfertDate = new Date(transfert.date);
        const status =
          transfert.statut || (transfertDate > now ? "Planifié" : "Effectué");
        return status !== "Validé";
      },
    },
    {
      label: "Supprimer",
      onClick: (transfert) => {
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer ce transfert ?")
        ) {
          deleteTransfert(transfert.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le transfert a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le transfert",
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
      title="Transferts de patients"
      createPath="/transferts/create"
      createButtonLabel="Nouveau transfert"
      data={transferts}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchTransferts}
      onRowClick={(transfert) => navigate(`/transferts/${transfert.id}`)}
      searchPlaceholder="Rechercher par patient, service, motif..."
      searchKeys={["motif"]}
      emptyStateMessage="Aucun transfert disponible"
      loadingMessage="Chargement des transferts..."
    />
  );
};

export default TransfertsPage;
