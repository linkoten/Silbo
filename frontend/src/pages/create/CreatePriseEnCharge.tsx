"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  priseEnChargeFormSchema,
  type PatientFormValues,
  type PersonnelFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import PatientDialog from "@/components/dialogs/PatientDialog";
import PersonnelDialog from "@/components/dialogs/PersonnelDialog";

const CreatePriseEnChargePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  const personnelIdParam = searchParams.get("personnelId");
  const navigate = useNavigate();

  // États pour les listes de patients et personnels
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [personnels, setPersonnels] = useState<PersonnelFormValues[]>([]);

  // Accès au store dialog avec actions pour ouvrir les dialogs
  const { setShowPatientDialog, setShowPersonnelDialog } = useDialogStore();

  // Utilisation du store prise en charge pour la création
  const { createPriseEnCharge, isLoading } = usePriseEnChargeStore();

  const initialData = {
    patientId: patientIdParam || "",
    personnelId: personnelIdParam || "",
    dateDebut: new Date(),
    dateFin: new Date(),
    description: "",
    diagnostic: "",
    traitement: "",
    notes: "",
  };

  // Charger les patients et personnels au chargement de la page
  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        const response = await fetch("http://localhost:3000/personnels");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des personnels");
        const data = await response.json();
        setPersonnels(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchPersonnels();
    fetchPatients();
  }, []);

  const handleSubmit = async (data: typeof initialData) => {
    // Convert Date objects to ISO strings before submission
    const formDataForSubmit = {
      ...data,
      dateDebut: data.dateDebut ? data.dateDebut.toISOString() : "",
      dateFin: data.dateFin ? data.dateFin.toISOString() : "",
    };

    await createPriseEnCharge(formDataForSubmit);
    navigate("/prisesEnCharge");
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const handlePersonnelCreated = (newPersonnel: PersonnelFormValues) => {
    setPersonnels((prevPersonnels) => [...prevPersonnels, newPersonnel]);
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
          name: "personnelId",
          label: "Personnel soignant",
          type: "select",
          required: true,
          options: personnels.map((personnel) => ({
            value: personnel.id as string,
            label: `${personnel.nom} ${personnel.prenom} (${personnel.profession})`,
          })),
          addButton: {
            label: "+ Ajouter un personnel",
            onClick: () => setShowPersonnelDialog(true),
          },
        },
      ],
    },
    {
      fields: [
        {
          name: "dateDebut",
          label: "Date de début",
          type: "date",
          required: true,
        },
        {
          name: "dateFin",
          label: "Date de fin (optionnel)",
          type: "date",
        },
      ],
    },
    {
      fields: [
        {
          name: "diagnostic",
          label: "Diagnostic",
          type: "textarea",
          rows: 3,
        },
        {
          name: "traitement",
          label: "Traitement",
          type: "textarea",
          rows: 3,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          rows: 3,
        },
        {
          name: "notes",
          label: "Notes complémentaires",
          type: "textarea",
          rows: 3,
        },
      ],
    },
  ];

  return (
    <>
      <GenericForm
        title="Créer une nouvelle prise en charge"
        initialData={initialData}
        sections={formSections}
        schema={priseEnChargeFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        cancelPath="/prisesEnCharge"
        submitButtonText="Créer la prise en charge"
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <PersonnelDialog onPersonnelCreated={handlePersonnelCreated} />
    </>
  );
};

export default CreatePriseEnChargePage;
