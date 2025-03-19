"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { usePersonnelStore } from "@/stores/personnel-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { Personnel } from "@/types/types";

const PersonnelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { personnels, isLoading, error, fetchPersonnels, deletePersonnel } =
    usePersonnelStore();

  useEffect(() => {
    fetchPersonnels();
  }, [fetchPersonnels]);

  // Configuration des colonnes
  const columns: ColumnConfig<Personnel>[] = [
    {
      key: "nom",
      header: "Nom",
      render: (personnel) => (
        <div className="font-medium text-gray-900">{personnel.nom}</div>
      ),
    },
    {
      key: "prenom",
      header: "Prénom",
      render: (personnel) => (
        <div className="text-gray-900">{personnel.prenom}</div>
      ),
    },
    {
      key: "profession",
      header: "Profession",
      render: (personnel) => {
        const prof = personnel.profession || "Non spécifiée";
        let badge = "bg-gray-100 text-gray-800";

        if (prof === "Médecin") badge = "bg-blue-100 text-blue-800";
        if (prof === "Infirmier" || prof === "Infirmière")
          badge = "bg-green-100 text-green-800";
        if (prof === "Chirurgien") badge = "bg-purple-100 text-purple-800";
        if (prof === "Aide-soignant" || prof === "Aide-soignante")
          badge = "bg-yellow-100 text-yellow-800";

        return (
          <div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
              {prof}
            </span>
            {personnel.specialite && (
              <div className="text-xs text-gray-500 mt-1">
                {personnel.specialite}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "dateEmbauche",
      header: "Date d'embauche",
      render: (personnel) => (
        <div className="text-gray-900">
          {personnel.dateEmbauche
            ? formatDate(personnel.dateEmbauche.toString())
            : "Non spécifiée"}
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      render: (personnel) => (
        <div className="text-sm text-gray-500">
          {personnel.email && (
            <div className="mb-1">
              <a
                href={`mailto:${personnel.email}`}
                className="text-blue-600 hover:underline"
              >
                {personnel.email}
              </a>
            </div>
          )}
          {personnel.telephone && <div>{personnel.telephone}</div>}
          {!personnel.email && !personnel.telephone && "Non renseigné"}
        </div>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (personnel) => {
        const status = personnel.statut || "Actif";
        let badge = "bg-green-100 text-green-800";

        if (status === "En congé") badge = "bg-yellow-100 text-yellow-800";
        if (status === "Inactif") badge = "bg-red-100 text-red-800";
        if (status === "En formation") badge = "bg-blue-100 text-blue-800";

        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: "service",
      header: "Service",
      render: (personnel) =>
        personnel.serviceId ? (
          <a
            href={`/services/${personnel.serviceId}`}
            className="text-blue-600 hover:underline"
          >
            Voir service
          </a>
        ) : (
          <span className="text-gray-400">Non assigné</span>
        ),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<Personnel>[] = [
    {
      label: "Détails",
      to: "/personnels/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/personnels/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (personnel) => {
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")
        ) {
          deletePersonnel(personnel.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le personnel a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le personnel",
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
      title="Gestion des Personnels"
      createPath="/personnels/create"
      createButtonLabel="Ajouter un personnel"
      data={personnels}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchPersonnels}
      onRowClick={(personnel) => navigate(`/personnels/${personnel.id}`)}
      searchPlaceholder="Rechercher par nom, profession, spécialité..."
      searchKeys={["nom", "prenom", "profession", "specialite", "email"]}
      emptyStateMessage="Aucun personnel disponible"
      loadingMessage="Chargement des personnels..."
    />
  );
};

export default PersonnelsPage;
