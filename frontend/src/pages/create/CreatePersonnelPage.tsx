"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  personnelFormSchema,
  type ServiceFormValues,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { usePersonnelStore } from "@/stores/personnel-store";
import { useDialogStore } from "@/stores/dialog-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

const CreatePersonnelPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPersonnel, isLoading } = usePersonnelStore();
  const { setShowServiceDialog, setShowEtablissementDialog } = useDialogStore();

  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<ServiceFormValues[]>([]);

  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
      }
    };

    fetchEtablissements();
    fetchServices();
  }, []);

  const initialData = {
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    email: "",
    telephone: "",
    profession: "",
    specialite: "",
    matricule: "",
    serviceId: "",
    dateEmbauche: new Date(),
    statut: "Actif",
    etablissementId: "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    await createPersonnel(data);
    navigate("/personnels");
  };

  const handleServiceCreated = (newService: ServiceFormValues) => {
    setServices((prevServices) => [...prevServices, newService]);
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
      title: "Informations personnelles",
      fields: [
        {
          name: "nom",
          label: "Nom",
          type: "text",
          required: true,
        },
        {
          name: "prenom",
          label: "Prénom",
          type: "text",
          required: true,
        },
        {
          name: "dateNaissance",
          label: "Date de naissance",
          type: "date",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
        },
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
        },
      ],
    },
    {
      title: "Informations professionnelles",
      fields: [
        {
          name: "profession",
          label: "Profession",
          type: "text",
          required: true,
        },
        {
          name: "specialite",
          label: "Spécialité",
          type: "text",
        },
        {
          name: "matricule",
          label: "Matricule",
          type: "text",
        },
        {
          name: "dateEmbauche",
          label: "Date d'embauche",
          type: "date",
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "Actif", label: "Actif" },
            { value: "Inactif", label: "Inactif" },
            { value: "En congé", label: "En congé" },
            { value: "En formation", label: "En formation" },
          ],
        },
      ],
    },
    {
      title: "Affectation",
      fields: [
        {
          name: "etablissementId",
          label: "Établissement",
          type: "select",
          options: etablissements.map((e) => ({
            value: e.id as string,
            label: e.nom,
          })),
          addButton: {
            label: "+ Ajouter un établissement",
            onClick: () => setShowEtablissementDialog(true),
          },
        },
        {
          name: "serviceId",
          label: "Service",
          type: "select",
          options: services.map((s) => ({
            value: s.id as string,
            label: s.nom,
          })),
          addButton: {
            label: "+ Ajouter un service",
            onClick: () => setShowServiceDialog(true),
          },
        },
      ],
    },
  ];

  return (
    <>
      <GenericForm
        title="Ajouter un nouveau personnel"
        initialData={initialData}
        sections={formSections}
        schema={personnelFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        cancelPath="/personnels"
      />

      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default CreatePersonnelPage;
