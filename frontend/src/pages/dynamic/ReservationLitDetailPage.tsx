"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ReservationDetailTab from "@/components/tabs/ReservationDetailTab";
import ReservationRelatedTab from "@/components/tabs/ReservationRelatedTab";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import {
  GenericDetailPage,
  type TabConfig,
  type ActionButton,
  type HeaderBadge,
} from "@/components/GenericDetailPage";

// Calculer la durée entre deux dates
const getDurationDays = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const ReservationLitDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Utiliser le store reservation-lit
  const {
    reservationLitSelectionnee: reservation,
    isLoading,
    error,
    fetchReservationLitDetails,
    deleteReservationLit,
  } = useReservationLitStore();

  useEffect(() => {
    if (id) {
      fetchReservationLitDetails(id);
    }
  }, [id, fetchReservationLitDetails]);

  if (!reservation && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Réservation non trouvée</p>
        </div>
      </div>
    );
  }

  if (!reservation) return null;

  // Détermination du statut de la réservation
  const now = new Date();
  const departDate = new Date(reservation.dateDepart);
  const arriveeDate = new Date(reservation.dateArrivee);

  let status = "En cours";
  let statusColor = "bg-green-200 text-green-800";

  if (now < departDate) {
    status = "À venir";
    statusColor = "bg-blue-200 text-blue-800";
  } else if (now > arriveeDate) {
    status = "Terminée";
    statusColor = "bg-gray-200 text-gray-800";
  }

  const duration = getDurationDays(
    reservation.dateDepart,
    reservation.dateArrivee
  );

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "details",
      label: "Détails de la réservation",
      content: <ReservationDetailTab reservation={reservation} />,
    },
    {
      id: "related",
      label: "Éléments associés",
      content: (
        <ReservationRelatedTab
          patient={reservation.patient}
          patientId={reservation.patientId}
          lit={reservation.lit}
          litId={reservation.litId}
          service={reservation.service}
        />
      ),
    },
  ];

  // Configuration des badges pour l'en-tête
  const badges: HeaderBadge[] = [
    {
      label: status,
      color: statusColor,
    },
    {
      label: `${duration} jour${duration > 1 ? "s" : ""}`,
      color: "bg-purple-200 text-purple-800",
    },
  ];

  if (reservation.patient) {
    badges.push({
      label: `Patient: ${reservation.patient.nom} ${reservation.patient.prenom}`,
      color: "bg-green-200 text-green-800",
    });
  }

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [];

  if (reservation.patient) {
    footerActions.push({
      label: "Voir le patient",
      to: `/patients/${reservation.patientId}`,
      color: "green",
    });
  }

  if (reservation.lit) {
    footerActions.push({
      label: "Voir le lit",
      to: `/lits/${reservation.litId}`,
      color: "blue",
    });
  }

  // Icône pour l'en-tête
  const headerIcon = (
    <svg
      className="w-10 h-10 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  return (
    <GenericDetailPage
      id={id || ""}
      title={`Réservation ${
        reservation.lit ? `du lit n°${reservation.lit.numeroLit}` : ""
      }`}
      icon={headerIcon}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="details"
      editPath={`/reservationsLit/edit/${id}`}
      backPath="/reservationsLit"
      backLabel="Retour à la liste des réservations"
      onDelete={id ? () => deleteReservationLit(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer cette réservation ?"
      footerActions={footerActions}
    />
  );
};

export default ReservationLitDetailPage;
