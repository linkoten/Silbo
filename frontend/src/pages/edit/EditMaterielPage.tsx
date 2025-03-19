"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  materielFormSchema,
  type ServiceFormValues,
} from "@/components/userFormSchema";
import { useMaterielStore } from "@/stores/materiel-store";
import { useServiceStore } from "@/stores/service-store";
import { useDialogStore } from "@/stores/dialog-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import ServiceDialog from "@/components/dialogs/ServiceDialog";

const EditMaterielPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { setShowServiceDialog } = useDialogStore();
  const {
    materielSelectionne,
    isLoading,
    error,
    fetchMaterielDetails,
    updateMateriel,
  } = useMaterielStore();
  const { services, fetchServices } = useServiceStore();

  // Charger les détails du matériel et la liste des services au chargement de la page
  useEffect(() => {
    if (id) {
      fetchMaterielDetails(id);
    }
    fetchServices();
  }, [id, fetchMaterielDetails, fetchServices]);

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

  const handleSubmit = async (id: string, data: typeof initialData) => {
    await updateMateriel(id, data);
  };

  // Callback pour ajouter un nouveau service à la liste
  const handleServiceCreated = (newService: ServiceFormValues) => {
    // Rafraîchir les services après création
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
      <GenericEditForm
        title="Modifier les informations du matériel"
        entityName="du matériel"
        id={id || ""}
        initialData={initialData}
        loadedData={materielSelectionne}
        isLoading={isLoading}
        error={error}
        sections={formSections}
        schema={materielFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/materiels/${id}` : "/materiels"}
      />

      <ServiceDialog onServiceCreated={handleServiceCreated} />
    </>
  );
};

export default EditMaterielPage;
