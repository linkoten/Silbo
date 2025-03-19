"use client";

import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericListPage,
  type ColumnConfig,
  type ActionConfig,
} from "@/components/GenericListPage";
import type { ReservationLitWithRelations } from "@/types/types";

const ReservationsLitPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    reservationsLit,
    isLoading,
    error,
    fetchReservationsLit,
    deleteReservationLit,
  } = useReservationLitStore();

  useEffect(() => {
    fetchReservationsLit();
  }, [fetchReservationsLit]);

  // Calcul de la durée du séjour
  const calculateDuration = (dateDepart: string, dateArrivee: string) => {
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
  };

  // Configuration des colonnes
  const columns: ColumnConfig<ReservationLitWithRelations>[] = [
    {
      key: "patient",
      header: "Patient",
      render: (reservation) =>
        reservation.patient ? (
          <a
            href={`/patients/${reservation.patientId}`}
            className="text-blue-600 hover:underline"
          >
            {reservation.patient.nom} {reservation.patient.prenom}
          </a>
        ) : (
          <span className="text-gray-500">ID: {reservation.patientId}</span>
        ),
    },
    {
      key: "lit",
      header: "Lit",
      render: (reservation) =>
        reservation.lit ? (
          <div>
            <div className="font-medium">
              <a
                href={`/lits/${reservation.litId}`}
                className="text-blue-600 hover:underline"
              >
                Lit n°{reservation.lit.numeroLit}
              </a>
            </div>
            {reservation.lit.chambre && (
              <div className="text-xs text-gray-500">{`Chambre ${reservation.lit.chambre}`}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-500">ID: {reservation.litId}</span>
        ),
    },
    {
      key: "dateDepart",
      header: "Date de départ",
      render: (reservation) => formatDate(reservation.dateDepart),
    },
    {
      key: "dateArrivee",
      header: "Date d'arrivée",
      render: (reservation) => formatDate(reservation.dateArrivee),
    },
    {
      key: "duree",
      header: "Durée du séjour",
      render: (reservation) =>
        calculateDuration(reservation.dateDepart, reservation.dateArrivee),
    },
    {
      key: "statut",
      header: "Statut",
      render: (reservation) => {
        const now = new Date();
        const departDate = new Date(reservation.dateDepart);
        const arriveeDate = new Date(reservation.dateArrivee);

        let status = "En cours";
        let statusClass = "bg-green-100 text-green-800";

        if (now < departDate) {
          status = "À venir";
          statusClass = "bg-blue-100 text-blue-800";
        } else if (now > arriveeDate) {
          status = "Terminée";
          statusClass = "bg-gray-100 text-gray-800";
        }

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
      key: "etablissement",
      header: "Établissement",
      render: (reservation) =>
        reservation.etablissementDestination ? (
          <a
            href={`/etablissements/${reservation.etablissementDestinationId}`}
            className="text-blue-600 hover:underline"
          >
            {reservation.etablissementDestination.nom}
          </a>
        ) : (
          <span className="text-gray-400">Non spécifié</span>
        ),
    },
  ];

  // Configuration des actions
  const actions: ActionConfig<ReservationLitWithRelations>[] = [
    {
      label: "Détails",
      to: "/reservationsLit/:id",
      color: "blue",
    },
    {
      label: "Modifier",
      to: "/reservationsLit/edit/:id",
      color: "indigo",
    },
    {
      label: "Supprimer",
      onClick: (reservation) => {
        if (
          window.confirm(
            "Êtes-vous sûr de vouloir supprimer cette réservation ?"
          )
        ) {
          deleteReservationLit(reservation.id)
            .then((success) => {
              if (success) {
                toast({
                  title: "Succès",
                  description: "La réservation a été supprimée avec succès",
                  variant: "success",
                });
              }
            })
            .catch(() => {
              toast({
                title: "Erreur",
                description: "Impossible de supprimer la réservation",
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
      title="Réservations de lits"
      createPath="/reservationsLit/create"
      createButtonLabel="Ajouter une réservation"
      data={reservationsLit}
      isLoading={isLoading}
      error={error}
      columns={columns}
      actions={actions}
      fetchData={fetchReservationsLit}
      onRowClick={(reservation) =>
        navigate(`/reservationsLit/${reservation.id}`)
      }
      searchPlaceholder="Rechercher par patient, lit, établissement..."
      searchKeys={[]}
      emptyStateMessage="Aucune réservation disponible"
      loadingMessage="Chargement des réservations..."
    />
  );
};

export default ReservationsLitPage;
