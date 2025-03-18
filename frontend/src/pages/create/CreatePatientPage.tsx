"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { patientFormSchema } from "@/components/userFormSchema";
import { usePatientStore } from "@/stores/patient-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";

const CreatePatientPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPatient, isLoading } = usePatientStore();

  // Corriger le type initialData pour qu'il corresponde au schéma Zod
  const initialData = {
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    adresse: "", // Changer de string à null pour correspondre au schéma
    telephone: "",
    email: "",
    numeroSecu: "",
    groupeSanguin: "",
    allergie: "",
    antecedents: "",
    dateAdmission: new Date(),
    dateSortie: new Date(), // Changer de Date à null pour correspondre au schéma
    statut: "Hospitalisé",
  };

  const handleSubmit = async (data: typeof initialData) => {
    // Préparer les données pour l'API
    const dataToSend = {
      ...data,
      dateNaissance:
        data.dateNaissance instanceof Date
          ? data.dateNaissance.toISOString()
          : data.dateNaissance
          ? new Date(data.dateNaissance).toISOString()
          : null,
      dateAdmission:
        data.dateAdmission instanceof Date
          ? data.dateAdmission.toISOString()
          : data.dateAdmission
          ? new Date(data.dateAdmission).toISOString()
          : null,
      dateSortie:
        data.dateSortie instanceof Date
          ? data.dateSortie.toISOString()
          : data.dateSortie
          ? new Date(data.dateSortie).toISOString()
          : null,
    };

    await createPatient(dataToSend);
    navigate("/patients");
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
          required: true,
        },
        {
          name: "adresse",
          label: "Adresse",
          type: "text",
        },
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
      ],
    },
    {
      title: "Informations médicales",
      fields: [
        {
          name: "numeroSecu",
          label: "Numéro de sécurité sociale",
          type: "text",
        },
        {
          name: "groupeSanguin",
          label: "Groupe sanguin",
          type: "text",
        },
        {
          name: "allergie",
          label: "Allergies",
          type: "textarea",
        },
        {
          name: "antecedents",
          label: "Antécédents médicaux",
          type: "textarea",
        },
      ],
    },
    {
      title: "Informations d'admission",
      fields: [
        {
          name: "dateAdmission",
          label: "Date d'admission",
          type: "date",
          required: true,
        },
        {
          name: "dateSortie",
          label: "Date de sortie",
          type: "date",
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "Hospitalisé", label: "Hospitalisé" },
            { value: "Sorti", label: "Sorti" },
            { value: "En attente", label: "En attente" },
            { value: "Transféré", label: "Transféré" },
          ],
        },
      ],
    },
  ];

  return (
    <GenericForm
      title="Ajouter un nouveau patient"
      initialData={initialData}
      sections={formSections}
      schema={patientFormSchema}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      cancelPath="/patients"
    />
  );
};

export default CreatePatientPage;
