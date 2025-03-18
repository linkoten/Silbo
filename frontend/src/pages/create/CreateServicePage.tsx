"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  serviceFormSchema,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const etablissementIdParam = searchParams.get("etablissementId") || "";
  const { setShowEtablissementDialog } = useDialogStore();

  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    fetchEtablissements();
  }, []);

  const initialData = {
    nom: "",
    description: "",
    etablissementId: etablissementIdParam,
    etage: "",
    aile: "",
    capacite: 0,
    statut: "Actif",
    specialite: "",
    responsableId: "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du service");
      }

      navigate("/services");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
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
          name: "nom",
          label: "Nom du service",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
        },
        {
          name: "etablissementId",
          label: "Établissement",
          type: "select",
          required: true,
          options: etablissements.map((e) => ({
            value: e.id as string,
            label: e.nom,
          })),
          addButton: {
            label: "+ Ajouter un établissement",
            onClick: () => setShowEtablissementDialog(true),
          },
        },
      ],
    },
    {
      title: "Localisation",
      fields: [
        {
          name: "etage",
          label: "Étage",
          type: "text",
        },
        {
          name: "aile",
          label: "Aile",
          type: "text",
        },
      ],
    },
    {
      title: "Détails",
      fields: [
        {
          name: "capacite",
          label: "Capacité",
          type: "number",
          min: 0,
        },
        {
          name: "specialite",
          label: "Spécialité",
          type: "text",
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "Actif", label: "Actif" },
            { value: "Inactif", label: "Inactif" },
            { value: "En maintenance", label: "En maintenance" },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <GenericForm
        title="Créer un nouveau service"
        initialData={initialData}
        sections={formSections}
        schema={serviceFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        cancelPath="/services"
      />

      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default CreateServicePage;
