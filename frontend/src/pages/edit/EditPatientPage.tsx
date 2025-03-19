"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { patientFormSchema } from "@/components/userFormSchema";
import { usePatientStore } from "@/stores/patient-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";

const EditPatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    patientSelectionne,
    isLoading,
    error,
    fetchPatientDetails,
    updatePatient,
  } = usePatientStore();

  // Charger les détails du patient lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPatientDetails(id);
    }
  }, [id, fetchPatientDetails]);

  const initialData = {
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    adresse: "",
    telephone: "",
    email: "",
    numeroSecu: "",
    groupeSanguin: "",
    allergie: "",
    antecedents: "",
    dateAdmission: new Date(),
    dateSortie: new Date(),
    statut: "Hospitalisé",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    // Créer une copie des données pour l'envoi
    const dataToSend = {
      ...data,
      // S'assurer que la date est au format ISO 8601 (YYYY-MM-DD)
      dateNaissance: data.dateNaissance.toISOString(),
      dateAdmission: data.dateAdmission
        ? data.dateAdmission.toISOString()
        : null,
      dateSortie:
        data.dateSortie instanceof Date
          ? data.dateSortie.toISOString()
          : data.dateSortie
          ? new Date(data.dateSortie).toISOString()
          : null,
    };

    await updatePatient(id, dataToSend);
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
          type: "select",
          options: [
            { value: "", label: "Non spécifié" },
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
          ],
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
    <GenericEditForm
      title="Modifier les informations du patient"
      entityName="du patient"
      id={id || ""}
      initialData={initialData}
      loadedData={patientSelectionne}
      isLoading={isLoading}
      error={error}
      sections={formSections}
      schema={patientFormSchema}
      onSubmit={handleSubmit}
      cancelPath={id ? `/patients/${id}` : "/patients"}
    />
  );
};

export default EditPatientPage;
