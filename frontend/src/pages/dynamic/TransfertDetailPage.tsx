"use client";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/formatUtils";
import TransfertDetailsTab from "@/components/tabs/TransfertDetailsTab";
import TransfertPatientTab from "@/components/tabs/TransfertPatientTab";
import { useTransfertStore } from "@/stores/transfert-store";
import { useToast } from "@/components/ui/use-toast";
import {
  GenericDetailPage,
  type TabConfig,
  type ActionButton,
  type HeaderBadge,
} from "@/components/GenericDetailPage";

const TransfertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  // Utiliser le store transfert
  const {
    transfertSelectionne: transfert,
    isLoading,
    error,
    fetchTransfertDetails,
    deleteTransfert,
    validateTransfert,
  } = useTransfertStore();

  useEffect(() => {
    if (id) {
      fetchTransfertDetails(id);
    }
  }, [id, fetchTransfertDetails]);

  if (!transfert && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Transfert non trouvé</p>
        </div>
      </div>
    );
  }

  if (!transfert) return null;

  // Détermination du statut du transfert
  const transfertDate = new Date(transfert.date);
  const now = new Date();

  // Le statut explicite du transfert a priorité, sinon on le détermine par la date
  const transfertStatus =
    transfert.statut || (transfertDate > now ? "Planifié" : "Effectué");

  const transfertStatusColor =
    transfertStatus === "Validé"
      ? "bg-green-200 text-green-800"
      : transfertStatus === "Planifié"
      ? "bg-blue-200 text-blue-800"
      : transfertStatus === "En cours"
      ? "bg-yellow-200 text-yellow-800"
      : transfertStatus === "Annulé"
      ? "bg-red-200 text-red-800"
      : "bg-gray-200 text-gray-800";

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "details",
      label: "Détails du transfert",
      content: <TransfertDetailsTab transfert={transfert} />,
    },
    {
      id: "patient",
      label: "Patient",
      content: (
        <TransfertPatientTab
          patient={transfert.patient}
          patientId={transfert.patientId}
        />
      ),
    },
  ];

  // Configuration des badges pour l'en-tête
  const badges: HeaderBadge[] = [
    {
      label: transfertStatus,
      color: transfertStatusColor,
    },
    {
      label: formatDate(transfert.date),
      color: "bg-purple-200 text-purple-800",
    },
  ];

  // Configuration des actions du header
  const headerActions: ActionButton[] = [];

  if (transfert.statut !== "Validé") {
    headerActions.push({
      label: "Valider",
      onClick: async () => {
        if (window.confirm("Voulez-vous valider ce transfert ?")) {
          try {
            const success = await validateTransfert(id || "");
            if (success) {
              toast({
                title: "Succès",
                description: "Le transfert a été validé avec succès",
                variant: "success",
              });
            }
          } catch (err) {
            toast({
              title: "Erreur",
              description:
                err instanceof Error
                  ? err.message
                  : "Erreur lors de la validation",
              variant: "destructive",
            });
          }
        }
      },
      color: "green",
      icon: (
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    });
  }

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [];

  if (transfert.patient) {
    footerActions.push({
      label: "Voir le dossier patient",
      to: `/patients/${transfert.patientId}`,
      color: "blue",
    });
  }

  footerActions.push({
    label: "Nouveau transfert",
    to: "/transferts/create",
    color: "green",
  });

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
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );

  return (
    <GenericDetailPage
      id={id || ""}
      title={`Transfert ${
        transfert.patient
          ? `de ${transfert.patient.prenom} ${transfert.patient.nom}`
          : ""
      }`}
      icon={headerIcon}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="details"
      editPath={`/transferts/edit/${id}`}
      backPath="/transferts"
      backLabel="Retour à la liste des transferts"
      onDelete={id ? () => deleteTransfert(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer ce transfert ?"
      headerActions={headerActions}
      footerActions={footerActions}
    />
  );
};

export default TransfertDetailPage;
