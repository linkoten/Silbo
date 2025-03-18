"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  transfertFormSchema,
  type PatientFormValues,
  type ServiceFormValues,
  type EtablissementFormValues,
} from "@/components/userFormSchema";
import { useDialogStore } from "@/stores/dialog-store";
import { useTransfertStore } from "@/stores/transfert-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
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

const CreateTransfertPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  const serviceDepartIdParam = searchParams.get("serviceDepartId");
  const navigate = useNavigate();
  const { toast } = useToast();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [services, setServices] = useState<ServiceWithEtablissement[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);

  // États pour les filtres conditionnels
  const [servicesDepartFiltered, setServicesDepartFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);
  const [servicesArriveeFiltered, setServicesArriveeFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);

  // Accès aux stores
  const {
    setShowPatientDialog,
    setShowServiceDialog,
    setShowEtablissementDialog,
  } = useDialogStore();
  const { createTransfert, isLoading } = useTransfertStore();

  const initialData = {
    patientId: patientIdParam || "",
    serviceDepartId: serviceDepartIdParam || "",
    serviceArriveeId: "",
    date: new Date(),
    motif: "",
    statut: "Planifié",
    autorisePar: "",
    realiseePar: "",
    etablissementDepartId: "",
    etablissementArriveeId: "",
  };

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les patients",
          variant: "destructive",
        });
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();

        // Enhance services with etablissement information
        const servicesWithEtablissement = await Promise.all(
          data.map(async (service: ServiceWithEtablissement) => {
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
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      }
    };

    const fetchEtablissements = async () => {
      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des établissements");
        const data = await response.json();
        setEtablissements(data);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements",
          variant: "destructive",
        });
      }
    };

    fetchPatients();
    fetchServices();
    fetchEtablissements();
  }, [toast]);

  // Filtrer les services lorsqu'un établissement est sélectionné
  useEffect(() => {
    // Mettre à jour les services de départ filtrés
    if (initialData.etablissementDepartId) {
      const filteredServices = services.filter(
        (service) =>
          service.etablissementId === initialData.etablissementDepartId
      );
      setServicesDepartFiltered(filteredServices);
    } else {
      setServicesDepartFiltered(services);
    }

    // Mettre à jour les services d'arrivée filtrés
    if (initialData.etablissementArriveeId) {
      const filteredServices = services.filter(
        (service) =>
          service.etablissementId === initialData.etablissementArriveeId
      );
      setServicesArriveeFiltered(filteredServices);
    } else {
      setServicesArriveeFiltered(services);
    }
  }, [
    initialData.etablissementDepartId,
    initialData.etablissementArriveeId,
    services,
  ]);

  const handleSubmit = async (data: typeof initialData) => {
    // Préparer les données pour l'API
    const transfertData = {
      patientId: data.patientId,
      serviceDepartId: data.serviceDepartId,
      serviceArriveeId: data.serviceArriveeId,
      date: data.date.toISOString(),
      motif: data.motif,
      statut: data.statut,
      autorisePar: data.autorisePar,
      realiseePar: data.realiseePar,
      etablissementDepartId: data.etablissementDepartId,
      etablissementArriveeId: data.etablissementArriveeId,
    };

    await createTransfert(transfertData);
    navigate("/transferts");
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const handleServiceCreated = (newService: ServiceFormValues) => {
    setServices((prevServices) => [
      ...prevServices,
      newService as ServiceWithEtablissement,
    ]);
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
      <GenericForm
        title="Créer un nouveau transfert"
        initialData={initialData}
        sections={formSections}
        schema={transfertFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        cancelPath="/transferts"
        submitButtonText="Créer le transfert"
      />

      <PatientDialog onPatientCreated={handlePatientCreated} />
      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </>
  );
};

export default CreateTransfertPage;
