"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  litFormSchema,
  type ServiceFormValues,
} from "@/components/userFormSchema";
import { useLitStore } from "@/stores/lit-store";
import { useDialogStore } from "@/stores/dialog-store";
import { GenericForm, type FormSection } from "@/components/Generic-Form";
import ServiceDialog from "@/components/dialogs/ServiceDialog";

interface ServiceWithEtablissement extends ServiceFormValues {
  etablissement?: {
    nom: string;
  };
}

const CreateLitPage: React.FC = () => {
  const navigate = useNavigate();
  const { createLit } = useLitStore();
  const { setShowServiceDialog } = useDialogStore();

  const [services, setServices] = useState<ServiceWithEtablissement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const servicesData = await response.json();

        // Enrichir les services avec les informations d'établissement
        const servicesEnriched = await Promise.all(
          servicesData.map(async (service: ServiceWithEtablissement) => {
            try {
              const etablissementResponse = await fetch(
                `http://localhost:3000/etablissements/${service.etablissementId}`
              );
              if (etablissementResponse.ok) {
                const etablissement = await etablissementResponse.json();
                return { ...service, etablissement };
              }
              return service;
            } catch (err) {
              console.warn(
                `Erreur lors de la récupération de l'établissement pour le service ${service.id}:`,
                err
              );
              return service;
            }
          })
        );

        setServices(servicesEnriched);
      } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
      }
    };

    fetchServices();
  }, []);

  const initialData = {
    numeroLit: "",
    chambre: "",
    etage: "",
    type: "",
    statut: "disponible",
    serviceId: "",
    patientId: "",
  };

  const handleSubmit = async (data: typeof initialData) => {
    setIsSubmitting(true);
    try {
      await createLit(data);
      navigate("/lits");
    } catch (error) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceCreated = (newService: ServiceFormValues) => {
    setServices((prevServices) => [
      ...prevServices,
      newService as ServiceWithEtablissement,
    ]);
  };

  const formSections: FormSection[] = [
    {
      fields: [
        {
          name: "numeroLit",
          label: "Numéro de lit",
          type: "text",
          required: true,
          placeholder: "Ex: 101-A",
        },
        {
          name: "chambre",
          label: "Chambre",
          type: "text",
          placeholder: "Ex: 101",
        },
        {
          name: "etage",
          label: "Étage",
          type: "text",
          placeholder: "Ex: 1er",
        },
      ],
    },
    {
      fields: [
        {
          name: "type",
          label: "Type de lit",
          type: "select",
          options: [
            { value: "", label: "Sélectionner un type" },
            { value: "Standard", label: "Standard" },
            { value: "Médical", label: "Médical" },
            { value: "Soins intensifs", label: "Soins intensifs" },
            { value: "Pédiatrique", label: "Pédiatrique" },
            { value: "Bariatrique", label: "Bariatrique" },
          ],
        },
        {
          name: "statut",
          label: "Statut",
          type: "select",
          options: [
            { value: "disponible", label: "Disponible" },
            { value: "occupé", label: "Occupé" },
            { value: "maintenance", label: "En maintenance" },
            { value: "réservé", label: "Réservé" },
          ],
        },
        {
          name: "serviceId",
          label: "Service",
          type: "select",
          required: true,
          options: services.map((service) => ({
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
  ];

  return (
    <>
      <GenericForm
        title="Créer un nouveau lit"
        initialData={initialData}
        sections={formSections}
        schema={litFormSchema}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        cancelPath="/lits"
      />

      <ServiceDialog onServiceCreated={handleServiceCreated} />
    </>
  );
};

export default CreateLitPage;
