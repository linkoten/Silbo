"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../utils/formatUtils";
import { useEtablissementStore } from "@/stores/etablissement-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { Etablissement } from "@/types/types";

const EtablissementsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    etablissements,
    isLoading,
    error,
    fetchEtablissements,
    deleteEtablissement,
  } = useEtablissementStore();

  useEffect(() => {
    fetchEtablissements();
  }, [fetchEtablissements]);

  // Configuration des colonnes
  const columns: ColumnConfig<Etablissement>[] = [
    {
      key: "nom",
      header: "Nom",
      render: (etablissement) => (
        <div className="font-medium text-gray-900">{etablissement.nom}</div>
      ),
    },
    {
      key: "adresse",
      header: "Adresse",
      render: (etablissement) => (
        <div className="text-gray-500">
          {truncateText(etablissement.adresse || "Non renseignée", 40)}
        </div>
      ),
    },
    {
      key: "ville",
      header: "Ville",
      render: (etablissement) => (
        <div className="text-gray-500">
          {etablissement.ville || "Non renseignée"}
        </div>
      ),
    },
    {
      key: "codePostal",
      header: "Code postal",
      render: (etablissement) => (
        <div className="text-gray-500">
          {etablissement.codePostal || "Non renseigné"}
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Téléphone",
      render: (etablissement) => (
        <div className="text-gray-500">
          {etablissement.telephone || "Non renseigné"}
        </div>
      ),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<Etablissement>[] = [
    {
      label: "Détails",
      to: "/etablissements/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/etablissements/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (etablissement) => {
        if (
          window.confirm(
            "Êtes-vous sûr de vouloir supprimer cet établissement ?"
          )
        ) {
          deleteEtablissement(etablissement.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "L'établissement a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer l'établissement",
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
      title="Gestion des Établissements"
      createPath="/etablissements/create"
      createButtonLabel="Ajouter un établissement"
      data={etablissements}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchEtablissements}
      onRowClick={(etablissement) =>
        navigate(`/etablissements/${etablissement.id}`)
      }
      searchPlaceholder="Rechercher par nom, ville, code postal..."
      searchKeys={["nom", "ville", "codePostal", "adresse"]}
      emptyStateMessage="Aucun établissement disponible"
      loadingMessage="Chargement des établissements..."
    />
  );
};

export default EtablissementsPage;
