"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { truncateText } from "../utils/formatUtils";
import { useServiceStore } from "@/stores/service-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { Service } from "@/types/types";

const ServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { services, isLoading, error, fetchServices, deleteService } =
    useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Configuration des colonnes
  const columns: ColumnConfig<Service>[] = [
    {
      key: "nom",
      header: "Nom",
      render: (service) => (
        <div>
          <div className="font-medium text-gray-900">{service.nom}</div>
          <div className="text-sm text-gray-500">
            {truncateText(service.description || "", 30)}
          </div>
        </div>
      ),
    },
    {
      key: "etablissement",
      header: "Établissement",
      render: (service) =>
        service.etablissementId ? (
          <a
            href={`/etablissements/${service.etablissementId}`}
            className="text-blue-600 hover:underline"
          >
            {service.etablissementId}
          </a>
        ) : (
          <span className="text-gray-500">ID: {service.etablissementId}</span>
        ),
    },
    {
      key: "capacite",
      header: "Capacité",
      render: (service) => `${service.capacite} lits`,
    },
    {
      key: "emplacement",
      header: "Emplacement",
      render: (service) => (
        <span className="text-gray-500">
          {service.etage ? `Étage ${service.etage}` : ""}
          {service.aile ? `, Aile ${service.aile}` : ""}
          {!service.etage && !service.aile ? "Non spécifié" : ""}
        </span>
      ),
    },
    {
      key: "specialite",
      header: "Spécialité",
      render: (service) =>
        service.specialite ? (
          <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {service.specialite}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (service) => {
        const statusClass =
          service.statut === "Actif"
            ? "bg-green-100 text-green-800"
            : service.statut === "En maintenance"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800";

        return (
          <span
            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${statusClass}`}
          >
            {service.statut || "Actif"}
          </span>
        );
      },
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<Service>[] = [
    {
      label: "Détails",
      to: "/services/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/services/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (service) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
          deleteService(service.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le service a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le service",
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
      title="Gestion des Services"
      createPath="/services/create"
      createButtonLabel="Ajouter un service"
      data={services}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchServices}
      onRowClick={(service) => navigate(`/services/${service.id}`)}
      searchPlaceholder="Rechercher par nom, spécialité, statut..."
      searchKeys={["nom", "specialite", "statut", "description"]}
      emptyStateMessage="Aucun service disponible"
      loadingMessage="Chargement des services..."
    />
  );
};

export default ServicesPage;
