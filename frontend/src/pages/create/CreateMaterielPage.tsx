"use client";

import type React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  materielFormSchema,
  type ServiceFormValues,
} from "@/components/userFormSchema";
import { useMaterielStore } from "@/stores/materiel-store";
import { useServiceStore } from "@/stores/service-store";
import { useDialogStore } from "@/stores/dialog-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import ServiceDialog from "@/components/dialogs/ServiceDialog";

const CreateMaterielPage: React.FC = () => {
  const navigate = useNavigate();
  const { createMateriel, isLoading } = useMaterielStore();
  const { services, fetchServices } = useServiceStore();
  const { setShowServiceDialog } = useDialogStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const initialData = {
    nom: "",
    description: "",
    quantite: 1,
    type: "",
    marque: "",
    modele: "",
    numeroSerie: "",
    dateAchat: new Date(),
    dateMaintenance: new Date(),
    statut: "En Service",
    serviceId: "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    await createMateriel(data);
    navigate("/materiels");
  };

  const handleServiceCreated = (newService: ServiceFormValues) => {
    fetchServices();
  };

  const formSections: FormSection[] = [
    {
      title: "Informations générales",
      fields: [
        {
          name: "nom",
          label: "Nom du matériel",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
        },
        {
          name: "quantite",
          label: "Quantité",
          type: "number",
          min: 1,
          required: true,
        },
      ],
    },
    {
      title: "Caractéristiques",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "text",
        },
        {
          name: "marque",
          label: "Marque",
          type: "text",
        },
        {
          name: "modele",
          label: "Modèle",
          type: "text",
        },
        {
          name: "numeroSerie",
          label: "Numéro de série",
          type: "text",
        },
      ],
    },
    {
      title: "Gestion",
      fields: [
        {
          name: "dateAchat",
          label: "Date d'achat",
          type: "date",
        },
        {
          name: "dateMaintenance",
          label: "Date de maintenance",
          type: "date",
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "En Service", label: "En Service" },
            { value: "Hors Service", label: "Hors Service" },
            { value: "En Maintenance", label: "En Maintenance" },
            { value: "En Réparation", label: "En Réparation" },
          ],
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
        title="Ajouter un nouveau matériel"
        initialData={initialData}
        sections={formSections}
        schema={materielFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        cancelPath="/materiels"
      />

      <ServiceDialog onServiceCreated={handleServiceCreated} />
    </>
  );
};

export default CreateMaterielPage;
