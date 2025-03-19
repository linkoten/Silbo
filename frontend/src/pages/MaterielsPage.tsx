"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../utils/formatUtils";
import { useMaterielStore } from "@/stores/materiel-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { MaterielWithRelations } from "@/types/types";

const MaterielsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { materiels, isLoading, error, fetchMateriels, deleteMateriel } =
    useMaterielStore();

  useEffect(() => {
    fetchMateriels();
  }, [fetchMateriels]);

  // Configuration des colonnes
  const columns: ColumnConfig<MaterielWithRelations>[] = [
    {
      key: "nom",
      header: "Nom",
      render: (materiel) => (
        <div>
          <div className="font-medium text-gray-900">{materiel.nom}</div>
          {materiel.description && (
            <div className="text-sm text-gray-500">
              {truncateText(materiel.description, 30)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "quantite",
      header: "Quantité",
      render: (materiel) => (
        <div
          className={`font-medium ${
            materiel.quantite <= 0
              ? "text-red-600"
              : materiel.quantite < 5
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {materiel.quantite}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (materiel) => {
        if (!materiel.type) return <span className="text-gray-400">-</span>;

        let badge = "bg-gray-100 text-gray-800";
        if (materiel.type === "Médical") badge = "bg-blue-100 text-blue-800";
        if (materiel.type === "Chirurgical")
          badge = "bg-green-100 text-green-800";
        if (materiel.type === "Diagnostic")
          badge = "bg-purple-100 text-purple-800";
        if (materiel.type === "Mobilier")
          badge = "bg-yellow-100 text-yellow-800";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
            {materiel.type}
          </span>
        );
      },
    },
    {
      key: "statut",
      header: "Statut",
      render: (materiel) => {
        if (!materiel.statut) return <span className="text-gray-400">-</span>;

        let badge = "bg-green-100 text-green-800";
        if (materiel.statut === "En réparation")
          badge = "bg-yellow-100 text-yellow-800";
        if (materiel.statut === "Hors service")
          badge = "bg-red-100 text-red-800";
        if (materiel.statut === "En commande")
          badge = "bg-blue-100 text-blue-800";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
            {materiel.statut}
          </span>
        );
      },
    },
    {
      key: "service",
      header: "Service",
      render: (materiel) =>
        materiel.serviceId ? (
          <a
            href={`/services/${materiel.serviceId}`}
            className="text-blue-600 hover:underline"
          >
            {materiel.serviceId || `Service #${materiel.serviceId}`}
          </a>
        ) : (
          <span className="text-gray-400">Non assigné</span>
        ),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<MaterielWithRelations>[] = [
    {
      label: "Détails",
      to: "/materiels/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/materiels/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (materiel) => {
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?")
        ) {
          deleteMateriel(materiel.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le matériel a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le matériel",
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
      title="Gestion des Matériels"
      createPath="/materiels/create"
      createButtonLabel="Ajouter un matériel"
      data={materiels}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchMateriels}
      onRowClick={(materiel) => navigate(`/materiels/${materiel.id}`)}
      searchPlaceholder="Rechercher par nom, type, statut..."
      searchKeys={["nom", "type", "statut", "description"]}
      emptyStateMessage="Aucun matériel disponible"
      loadingMessage="Chargement des matériels..."
    />
  );
};

export default MaterielsPage;
