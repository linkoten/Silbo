"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  personnelFormSchema,
  EtablissementFormValues,
  ServiceFormValues,
} from "@/components/userFormSchema";
import { usePersonnelStore } from "@/stores/personnel-store";
import { useDialogStore } from "@/stores/dialog-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";
import { useToast } from "@/components/ui/use-toast";

const EditPersonnelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    personnelSelectionne,
    isLoading,
    error,
    fetchPersonnelDetails,
    updatePersonnel,
  } = usePersonnelStore();
  const { setShowServiceDialog, setShowEtablissementDialog } = useDialogStore();

  // États pour les listes d'établissements et de services
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // Charger les détails du personnel lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPersonnelDetails(id);
    }
  }, [id, fetchPersonnelDetails]);

  // Charger les établissements et services
  useEffect(() => {
    const fetchRelations = async () => {
      setLoadingRelations(true);
      try {
        // Charger les établissements
        const etablissementsResponse = await fetch(
          "http://localhost:3000/etablissements"
        );
        if (etablissementsResponse.ok) {
          const etablissementsData = await etablissementsResponse.json();
          setEtablissements(etablissementsData);
        }

        // Charger les services
        const servicesResponse = await fetch("http://localhost:3000/services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
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

  const handleSubmit = async (id: string, data: typeof initialData) => {
    await updatePersonnel(id, data);
  };

  // Callbacks pour les créations d'entités
  const handleServiceCreated = (newService: ServiceFormValues): void => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ): void => {
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
      <GenericEditForm
        title="Modifier les informations du personnel"
        entityName="du personnel"
        id={id || ""}
        initialData={initialData}
        loadedData={personnelSelectionne}
        isLoading={isLoading || loadingRelations}
        error={error}
        sections={formSections}
        schema={personnelFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/personnels/${id}` : "/personnels"}
      />

      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default EditPersonnelPage;
