"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { etablissementFormSchema } from "@/components/userFormSchema";
import { GenericForm, type FormSection } from "@/components/Generic-Form";

const CreateEtablissementPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (data: typeof initialData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création de l'établissement"
        );
      }

      navigate("/etablissements");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
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
          type: "text",
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
    <GenericForm
      title="Ajouter un nouvel établissement"
      initialData={initialData}
      sections={formSections}
      schema={etablissementFormSchema}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      cancelPath="/etablissements"
    />
  );
};

export default CreateEtablissementPage;
