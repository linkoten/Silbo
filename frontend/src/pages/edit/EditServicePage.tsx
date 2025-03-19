"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  serviceFormSchema,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useServiceStore } from "@/stores/service-store";
import { useDialogStore } from "@/stores/dialog-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";
import { useToast } from "@/components/ui/use-toast";

const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    serviceSelectionne,
    isLoading,
    error,
    fetchServiceDetails,
    updateService,
  } = useServiceStore();
  const { setShowEtablissementDialog } = useDialogStore();

  // État pour la liste des établissements
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [loadingEtablissements, setLoadingEtablissements] =
    useState<boolean>(false);

  // Charger les détails du service lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchServiceDetails(id);
    }
  }, [id, fetchServiceDetails]);

  // Charger les établissements
  useEffect(() => {
    const fetchEtablissements = async () => {
      setLoadingEtablissements(true);
      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les établissements",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
        toast({
          title: "Erreur",
          description: "Problème de communication avec le serveur",
          variant: "destructive",
        });
      } finally {
        setLoadingEtablissements(false);
      }
    };

    fetchEtablissements();
  }, [toast]);

  const initialData = {
    nom: "",
    description: "",
    etablissementId: "",
    etage: "",
    aile: "",
    capacite: 0,
    statut: "Actif",
    specialite: "",
    responsableId: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    await updateService(id, data);
  };

  // Callback pour l'ajout d'un nouvel établissement
  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ) => {
    // Mise à jour de la liste des établissements
    setEtablissements([...etablissements, newEtablissement]);
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
      <GenericEditForm
        title="Modifier le service"
        entityName="du service"
        id={id || ""}
        initialData={initialData}
        loadedData={serviceSelectionne}
        isLoading={isLoading || loadingEtablissements}
        error={error}
        sections={formSections}
        schema={serviceFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/services/${id}` : "/services"}
      />

      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default EditServicePage;
