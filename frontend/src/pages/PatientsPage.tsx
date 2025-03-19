"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { usePatientStore } from "@/stores/patient-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { Patient } from "@/types/types";

const PatientsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patients, isLoading, error, fetchPatients, deletePatient } =
    usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Configuration des colonnes
  const columns: ColumnConfig<Patient>[] = [
    {
      key: "nom",
      header: "Nom",
      render: (patient) => (
        <div className="font-medium text-gray-900">{patient.nom}</div>
      ),
    },
    {
      key: "prenom",
      header: "Prénom",
      render: (patient) => (
        <div className="text-gray-900">{patient.prenom}</div>
      ),
    },
    {
      key: "dateNaissance",
      header: "Date de naissance",
      render: (patient) => (
        <div className="text-gray-900">{formatDate(patient.dateNaissance)}</div>
      ),
    },
    {
      key: "statut",
      header: "Statut",
      render: (patient) => {
        let statusClass = "bg-gray-100 text-gray-800";

        if (patient.statut === "Hospitalisé") {
          statusClass = "bg-green-100 text-green-800";
        } else if (patient.statut === "Sortant") {
          statusClass = "bg-yellow-100 text-yellow-800";
        } else if (patient.statut === "Sorti") {
          statusClass = "bg-blue-100 text-blue-800";
        }

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
          >
            {patient.statut}
          </span>
        );
      },
    },
    {
      key: "contact",
      header: "Contact",
      render: (patient) => (
        <div className="text-sm text-gray-500">
          <div>{patient.telephone || "Non renseigné"}</div>
          <div className="text-xs">{patient.email || "-"}</div>
        </div>
      ),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<Patient>[] = [
    {
      label: "Détails",
      to: "/patients/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/patients/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (patient) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
          deletePatient(patient.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "Le patient a été supprimé avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer le patient",
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
      title="Gestion des Patients"
      createPath="/patients/create"
      createButtonLabel="Ajouter un patient"
      data={patients}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchPatients}
      onRowClick={(patient) => navigate(`/patients/${patient.id}`)}
      searchPlaceholder="Rechercher par nom, prénom, statut..."
      searchKeys={["nom", "prenom", "statut", "email", "telephone"]}
      emptyStateMessage="Aucun patient disponible"
      loadingMessage="Chargement des patients..."
    />
  );
};

export default PatientsPage;
