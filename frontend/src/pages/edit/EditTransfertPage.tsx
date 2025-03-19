"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  transfertFormSchema,
  type PatientFormValues,
  type ServiceFormValues,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { useTransfertStore } from "@/stores/transfert-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import PatientDialog from "@/components/dialogs/PatientDialog";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";
import { useToast } from "@/components/ui/use-toast";

// Extend ServiceFormValues to include etablissement info for display purposes
interface ServiceWithEtablissement extends ServiceFormValues {
  etablissement?: {
    nom: string;
  };
}

const EditTransfertPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const {
    transfertSelectionne,
    isLoading,
    error,
    fetchTransfertDetails,
    updateTransfert,
  } = useTransfertStore();
  const {
    setShowPatientDialog,
    setShowServiceDialog,
    setShowEtablissementDialog,
  } = useDialogStore();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [services, setServices] = useState<ServiceWithEtablissement[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // États pour les filtres conditionnels
  const [servicesDepartFiltered, setServicesDepartFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);
  const [servicesArriveeFiltered, setServicesArriveeFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);

  // Charger les détails du transfert lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchTransfertDetails(id);
    }
  }, [id, fetchTransfertDetails]);

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchRelations = async () => {
      setLoadingRelations(true);
      try {
        // Charger les patients
        const patientsResponse = await fetch("http://localhost:3000/patients");
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatients(patientsData);
        }

        // Charger les services avec info établissement
        const servicesResponse = await fetch("http://localhost:3000/services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();

          // Enhance services with etablissement information
          const servicesWithEtablissement = await Promise.all(
            servicesData.map(async (service: ServiceWithEtablissement) => {
              if (service.etablissementId) {
                try {
                  const etablissementResponse = await fetch(
                    `http://localhost:3000/etablissements/${service.etablissementId}`
                  );
                  if (etablissementResponse.ok) {
                    const etablissement = await etablissementResponse.json();
                    return {
                      ...service,
                      etablissement: { nom: etablissement.nom },
                    };
                  }
                } catch (error) {
                  console.warn(
                    "Couldn't fetch etablissement for service:",
                    error
                  );
                }
              }
              return service;
            })
          );

          setServices(servicesWithEtablissement);
          setServicesDepartFiltered(servicesWithEtablissement);
          setServicesArriveeFiltered(servicesWithEtablissement);
        }

        // Charger les établissements
        const etablissementsResponse = await fetch(
          "http://localhost:3000/etablissements"
        );
        if (etablissementsResponse.ok) {
          const etablissementsData = await etablissementsResponse.json();
          setEtablissements(etablissementsData);
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

  // Filtrer les services lorsqu'un établissement est sélectionné
  useEffect(() => {
    if (transfertSelectionne?.etablissementDepartId) {
      const filteredServices = services.filter(
        (service) =>
          service.etablissementId === transfertSelectionne.etablissementDepartId
      );
      setServicesDepartFiltered(
        filteredServices.length > 0 ? filteredServices : services
      );
    } else {
      setServicesDepartFiltered(services);
    }

    if (transfertSelectionne?.etablissementArriveeId) {
      const filteredServices = services.filter(
        (service) =>
          service.etablissementId ===
          transfertSelectionne.etablissementArriveeId
      );
      setServicesArriveeFiltered(
        filteredServices.length > 0 ? filteredServices : services
      );
    } else {
      setServicesArriveeFiltered(services);
    }
  }, [
    transfertSelectionne?.etablissementDepartId,
    transfertSelectionne?.etablissementArriveeId,
    services,
  ]);

  const initialData = {
    patientId: "",
    serviceDepartId: "",
    serviceArriveeId: "",
    date: new Date(),
    motif: "",
    statut: "Planifié",
    autorisePar: "",
    realiseePar: "",
    etablissementDepartId: "",
    etablissementArriveeId: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    // Préparer les données pour l'API
    const transfertData = {
      ...data,
      date: data.date.toISOString(),
    };

    await updateTransfert(id, transfertData);
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues): void => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const handleServiceCreated = (newService: ServiceFormValues): void => {
    setServices((prevServices) => [
      ...prevServices,
      newService as ServiceWithEtablissement,
    ]);
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
      fields: [
        {
          name: "patientId",
          label: "Patient",
          type: "select",
          required: true,
          options: patients.map((patient) => ({
            value: patient.id as string,
            label: `${patient.nom} ${patient.prenom}`,
          })),
          addButton: {
            label: "+ Ajouter un patient",
            onClick: () => setShowPatientDialog(true),
          },
        },
      ],
    },
    {
      title: "Départ",
      className: "bg-gray-50 p-4 mb-6 rounded-md border border-gray-200",
      fields: [
        {
          name: "etablissementDepartId",
          label: "Établissement de départ (optionnel)",
          type: "select",
          options: etablissements.map((etablissement) => ({
            value: etablissement.id as string,
            label: etablissement.nom,
          })),
          addButton: {
            label: "+ Ajouter un établissement",
            onClick: () => setShowEtablissementDialog(true),
          },
        },
        {
          name: "serviceDepartId",
          label: "Service de départ",
          type: "select",
          required: true,
          options: servicesDepartFiltered.map((service) => ({
            value: service.id as string,
            label: `${service.nom} ${
              service.etablissement ? `(${service.etablissement.nom})` : ""
            }`,
          })),
          addButton: {
            label: "+ Ajouter un service",
            onClick: () => setShowServiceDialog(true),
          },
        },
      ],
    },
    {
      title: "Arrivée",
      className: "bg-gray-50 p-4 mb-6 rounded-md border border-gray-200",
      fields: [
        {
          name: "etablissementArriveeId",
          label: "Établissement d'arrivée (optionnel)",
          type: "select",
          options: etablissements.map((etablissement) => ({
            value: etablissement.id as string,
            label: etablissement.nom,
          })),
          addButton: {
            label: "+ Ajouter un établissement",
            onClick: () => setShowEtablissementDialog(true),
          },
        },
        {
          name: "serviceArriveeId",
          label: "Service d'arrivée",
          type: "select",
          required: true,
          options: servicesArriveeFiltered.map((service) => ({
            value: service.id as string,
            label: `${service.nom} ${
              service.etablissement ? `(${service.etablissement.nom})` : ""
            }`,
          })),
          addButton: {
            label: "+ Ajouter un service",
            onClick: () => setShowServiceDialog(true),
          },
        },
      ],
    },
    {
      fields: [
        {
          name: "date",
          label: "Date du transfert",
          type: "date",
          required: true,
        },
        {
          name: "motif",
          label: "Motif du transfert",
          type: "textarea",
          rows: 3,
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "Planifié", label: "Planifié" },
            { value: "En cours", label: "En cours" },
            { value: "Validé", label: "Validé" },
            { value: "Annulé", label: "Annulé" },
          ],
        },
        {
          name: "autorisePar",
          label: "Autorisé par",
          type: "text",
        },
        {
          name: "realiseePar",
          label: "Réalisé par",
          type: "text",
        },
      ],
    },
  ];

  return (
    <>
      <GenericEditForm
        title="Modifier le transfert"
        entityName="du transfert"
        id={id || ""}
        initialData={initialData}
        loadedData={transfertSelectionne}
        isLoading={isLoading || loadingRelations}
        error={error}
        sections={formSections}
        schema={transfertFormSchema}
        onSubmit={handleSubmit}
        cancelPath={id ? `/transferts/${id}` : "/transferts"}
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default EditTransfertPage;
