"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  reservationLitFormSchema,
  type PatientFormValues,
  type LitFormValues,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import PatientDialog from "@/components/dialogs/PatientDialog";
import LitDialog from "@/components/dialogs/LitDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";
import { useToast } from "@/components/ui/use-toast";

const CreateReservationLitPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [lits, setLits] = useState<LitFormValues[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<any[]>([]);

  // Accès aux stores
  const { setShowPatientDialog, setShowLitDialog, setShowEtablissementDialog } =
    useDialogStore();
  const { createReservationLit, isLoading } = useReservationLitStore();

  const initialData = {
    patientId: "",
    litId: "",
    dateArrivee: new Date(),
    dateDepart: new Date(new Date().setDate(new Date().getDate() + 1)), // Par défaut : jour suivant
    etablissementDestinationId: "",
  };

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les patients",
          variant: "destructive",
        });
      }
    };

    const fetchLits = async () => {
      try {
        const response = await fetch("http://localhost:3000/lits");
        if (!response.ok) throw new Error("Erreur lors du chargement des lits");
        const data = await response.json();
        setLits(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les lits",
          variant: "destructive",
        });
      }
    };

    const fetchEtablissements = async () => {
      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des établissements");
        const data = await response.json();
        setEtablissements(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements",
          variant: "destructive",
        });
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      }
    };

    fetchPatients();
    fetchLits();
    fetchEtablissements();
    fetchServices();
  }, [toast]);

  const handleSubmit = async (data: typeof initialData) => {
    // Vérifier que les IDs requis ne sont pas null avant d'envoyer
    if (!data.patientId || !data.litId) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner un patient et un lit",
        variant: "destructive",
      });
      return;
    }

    // Utiliser le store pour créer la réservation
    await createReservationLit({
      patientId: data.patientId,
      litId: data.litId,
      dateArrivee: data.dateArrivee.toISOString(),
      dateDepart: data.dateDepart.toISOString(),
      etablissementDestinationId: data.etablissementDestinationId || "",
    });

    navigate("/reservationsLit");
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
      <GenericForm
        title="Créer une réservation de lit"
        initialData={initialData}
        sections={formSections}
        schema={reservationLitFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        cancelPath="/reservationsLit"
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <LitDialog onLitCreated={handleLitCreated} services={services} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default CreateReservationLitPage;
