"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLitStore } from "@/stores/lit-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { Lit } from "@/types/types";

const LitsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lits, isLoading, error, fetchLits, deleteLit } = useLitStore();

  useEffect(() => {
    fetchLits().catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des lits",
        variant: "destructive",
      });
    });
  }, [fetchLits, toast]);

  // Configuration des colonnes
  const columns: ColumnConfig<Lit>[] = [
    {
      key: "numeroLit",
      header: "Numéro de lit",
      render: (lit) => <div className="font-medium">{lit.numeroLit}</div>,
    },
    {
      key: "chambre",
      header: "Chambre",
      render: (lit) => lit.chambre || "Non assignée",
    },
    {
      key: "etage",
      header: "Étage",
      render: (lit) => lit.etage || "-",
    },
    {
      key: "statut",
      header: "Statut",
      render: (lit) => {
        const statusClass = getStatusBadgeClass(lit.statut || "");
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
          >
            {lit.statut || "Inconnu"}
          </span>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (lit) => lit.type || "Standard",
    },
    {
      key: "serviceId",
      header: "Service",
      render: (lit) => lit.serviceId || "Non assigné",
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<Lit>[] = [
    {
      label: "Voir",
      to: "/lits/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/lits/edit/:id",
      color: "yellow",
    },
    {
      label: "Supprimer",
      onClick: (lit) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lit ?")) {
          deleteLit(lit.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le lit a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le lit",
                variant: "destructive",
              });
            });
        }
      },
      color: "red",
    },
  ];

  // Fonction pour obtenir la classe CSS du badge de statut
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "occupé":
        return "bg-red-100 text-red-800";
      case "disponible":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "réservé":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <GenericListPage
      title="Liste des Lits"
      createPath="/lits/create"
      createButtonLabel="Ajouter un lit"
      data={lits}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchLits}
      onRowClick={(lit) => navigate(`/lits/${lit.id}`)}
      searchPlaceholder="Rechercher par numéro, chambre, statut..."
      searchKeys={["numeroLit", "chambre", "statut", "type"]}
      emptyStateMessage="Aucun lit disponible"
      loadingMessage="Chargement des lits..."
    />
  );
};

export default LitsPage;
