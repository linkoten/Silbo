"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { etablissementFormSchema } from "@/components/userFormSchema";
import { useEtablissementStore } from "@/stores/etablissement-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";

const EditEtablissementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    etablissementSelectionne,
    isLoading,
    error,
    fetchEtablissementDetails,
    updateEtablissement,
  } = useEtablissementStore();

  // Charger les détails de l'établissement lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchEtablissementDetails(id);
    }
  }, [id, fetchEtablissementDetails]);

  const initialData = {
    nom: "",
    adresse: "",
    capacite: 0,
    telephone: "",
    email: "",
    siteWeb: "",
    codePostal: "",
    ville: "",
    pays: "France",
    statut: "Actif",
    typology: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    await updateEtablissement(id, data);
  };

  const formSections: FormSection[] = [
    {
      title: "Informations générales",
      fields: [
        {
          name: "nom",
          label: "Nom de l'établissement",
          type: "text",
          required: true,
        },
        {
          name: "adresse",
          label: "Adresse",
          type: "text",
          required: true,
        },
        {
          name: "codePostal",
          label: "Code Postal",
          type: "text",
        },
        {
          name: "ville",
          label: "Ville",
          type: "text",
        },
        {
          name: "pays",
          label: "Pays",
          type: "text",
        },
      ],
    },
    {
      title: "Contact",
      fields: [
        {
          name: "telephone",
          label: "Téléphone",
          type: "tel",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
        },
        {
          name: "siteWeb",
          label: "Site Web",
          type: "text",
          placeholder: "https://example.com",
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
          name: "typology",
          label: "Typologie",
          type: "select",
          options: [
            { value: "", label: "Sélectionnez un type" },
            { value: "Hôpital", label: "Hôpital" },
            { value: "Clinique", label: "Clinique" },
            { value: "EHPAD", label: "EHPAD" },
            { value: "Centre de soins", label: "Centre de soins" },
            { value: "Autre", label: "Autre" },
          ],
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "Actif", label: "Actif" },
            { value: "Inactif", label: "Inactif" },
            { value: "En construction", label: "En construction" },
            { value: "En rénovation", label: "En rénovation" },
          ],
        },
      ],
    },
  ];

  return (
    <GenericEditForm
      title="Modifier les informations de l'établissement"
      entityName="de l'établissement"
      id={id || ""}
      initialData={initialData}
      loadedData={etablissementSelectionne}
      isLoading={isLoading}
      error={error}
      sections={formSections}
      schema={etablissementFormSchema}
      onSubmit={handleSubmit}
      cancelPath={id ? `/etablissements/${id}` : "/etablissements"}
    />
  );
};

export default EditEtablissementPage;
