"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  priseEnChargeFormSchema,
  type PatientFormValues,
  type PersonnelFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import PatientDialog from "@/components/dialogs/PatientDialog";
import PersonnelDialog from "@/components/dialogs/PersonnelDialog";
import { useToast } from "@/components/ui/use-toast";

const EditPriseEnChargePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    priseEnChargeSelectionnee,
    isLoading,
    error,
    fetchPriseEnChargeDetails,
    updatePriseEnCharge,
  } = usePriseEnChargeStore();
  const { setShowPatientDialog, setShowPersonnelDialog } = useDialogStore();

  // États pour les listes de patients et personnels
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [personnels, setPersonnels] = useState<PersonnelFormValues[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // Charger les détails de la prise en charge lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPriseEnChargeDetails(id);
    }
  }, [id, fetchPriseEnChargeDetails]);

  // Charger les patients et personnels
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

        // Charger les personnels
        const personnelsResponse = await fetch(
          "http://localhost:3000/personnels"
        );
        if (personnelsResponse.ok) {
          const personnelsData = await personnelsResponse.json();
          setPersonnels(personnelsData);
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
    personnelId: "",
    dateDebut: new Date(),
    dateFin: new Date(),
    description: "",
    diagnostic: "",
    traitement: "",
    notes: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    // Convert Date objects to ISO strings before submission
    const formDataForSubmit = {
      ...data,
      dateDebut: data.dateDebut ? data.dateDebut.toISOString() : "",
      dateFin: data.dateFin ? data.dateFin.toISOString() : null,
    };

    await updatePriseEnCharge(id, formDataForSubmit);
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues): void => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const handlePersonnelCreated = (newPersonnel: PersonnelFormValues): void => {
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
      <GenericEditForm
        title="Modifier la prise en charge"
        entityName="de la prise en charge"
        id={id || ""}
        initialData={initialData}
        loadedData={priseEnChargeSelectionnee}
        isLoading={isLoading || loadingRelations}
        error={error}
        sections={formSections}
        schema={priseEnChargeFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/prisesEnCharge/${id}` : "/prisesEnCharge"}
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <PersonnelDialog onPersonnelCreated={handlePersonnelCreated} />
    </>
  );
};

export default EditPriseEnChargePage;
