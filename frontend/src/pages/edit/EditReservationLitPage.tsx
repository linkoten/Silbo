"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  reservationLitFormSchema,
  type PatientFormValues,
  type LitFormValues,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import PatientDialog from "@/components/dialogs/PatientDialog";
import LitDialog from "@/components/dialogs/LitDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";
import { useToast } from "@/components/ui/use-toast";

const EditReservationLitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    reservationLitSelectionnee,
    isLoading,
    error,
    fetchReservationLitDetails,
    updateReservationLit,
  } = useReservationLitStore();
  const { setShowPatientDialog, setShowLitDialog, setShowEtablissementDialog } =
    useDialogStore();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [lits, setLits] = useState<LitFormValues[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // Charger les détails de la réservation lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchReservationLitDetails(id);
    }
  }, [id, fetchReservationLitDetails]);

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchRelations = async () => {
      setLoadingRelations(true);
      try {
        // Charger les patients
        const patientsResponse = await fetch("http://localhost:3000/patients");
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatients(patientsData);
        }

        // Charger les lits
        const litsResponse = await fetch("http://localhost:3000/lits");
        if (litsResponse.ok) {
          const litsData = await litsResponse.json();
          setLits(litsData);
        }

        // Charger les établissements
        const etablissementsResponse = await fetch(
          "http://localhost:3000/etablissements"
        );
        if (etablissementsResponse.ok) {
          const etablissementsData = await etablissementsResponse.json();
          setEtablissements(etablissementsData);
        }

        // Charger les services (pour le dialog de création de lit)
        const servicesResponse = await fetch("http://localhost:3000/services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des relations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données associées",
          variant: "destructive",
        });
      } finally {
        setLoadingRelations(false);
      }
    };

    fetchRelations();
  }, [toast]);

  const initialData = {
    patientId: "",
    litId: "",
    dateArrivee: new Date(),
    dateDepart: new Date(new Date().setDate(new Date().getDate() + 1)), // Par défaut : jour suivant
    etablissementDestinationId: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    // Vérifier que les IDs requis ne sont pas null avant d'envoyer
    if (!data.patientId || !data.litId) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un patient et un lit",
        variant: "destructive",
      });
      throw new Error("Patient et lit sont obligatoires");
    }

    // Utiliser le store pour mettre à jour la réservation
    await updateReservationLit(id, {
      patientId: data.patientId,
      litId: data.litId,
      dateArrivee: data.dateArrivee.toISOString(),
      dateDepart: data.dateDepart.toISOString(),
      etablissementDestinationId: data.etablissementDestinationId || undefined,
    });
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const handleLitCreated = (newLit: LitFormValues) => {
    setLits((prevLits) => [...prevLits, newLit]);
  };

  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ) => {
    setEtablissements((prevEtablissements) => [
      ...prevEtablissements,
      newEtablissement,
    ]);
  };

  const formSections: FormSection[] = [
    {
      fields: [
        {
          name: "patientId",
          label: "Patient",
          type: "select",
          required: true,
          options: patients.map((patient) => ({
            value: patient.id as string,
            label: `${patient.nom} ${patient.prenom}`,
          })),
          addButton: {
            label: "+ Ajouter un patient",
            onClick: () => setShowPatientDialog(true),
          },
        },
        {
          name: "litId",
          label: "Lit",
          type: "select",
          required: true,
          options: lits.map((lit) => ({
            value: lit.id as string,
            label: `${lit.numeroLit} ${
              lit.chambre ? `- Chambre ${lit.chambre}` : ""
            }`,
          })),
          addButton: {
            label: "+ Ajouter un lit",
            onClick: () => setShowLitDialog(true),
          },
        },
      ],
    },
    {
      fields: [
        {
          name: "dateArrivee",
          label: "Date d'arrivée",
          type: "date",
          required: true,
        },
        {
          name: "dateDepart",
          label: "Date de départ",
          type: "date",
          required: true,
        },
        {
          name: "etablissementDestinationId",
          label: "Établissement de destination (optionnel)",
          type: "select",
          options: etablissements.map((etablissement) => ({
            value: etablissement.id as string,
            label: etablissement.nom,
          })),
          addButton: {
            label: "+ Ajouter un établissement",
            onClick: () => setShowEtablissementDialog(true),
          },
        },
      ],
    },
  ];

  return (
    <>
      <GenericEditForm
        title="Modifier la réservation de lit"
        entityName="de la réservation"
        id={id || ""}
        initialData={initialData}
        loadedData={reservationLitSelectionnee}
        isLoading={isLoading || loadingRelations}
        error={error}
        sections={formSections}
        schema={reservationLitFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/reservationsLit/${id}` : "/reservationsLit"}
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <LitDialog onLitCreated={handleLitCreated} services={services} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default EditReservationLitPage;
