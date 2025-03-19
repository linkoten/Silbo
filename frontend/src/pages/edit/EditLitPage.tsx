"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { litFormSchema } from "@/components/userFormSchema";
import { useLitStore } from "@/stores/lit-store";
import {
  GenericEditForm,
  type FormSection,
} from "@/components/Generic-EditForm";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  nom: string;
  etablissementId: string;
  etablissement?: {
    nom: string;
  };
}

const EditLitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { litSelectionne, isLoading, error, fetchLitDetails, updateLit } =
    useLitStore();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const servicesData = await response.json();

        // Enrichir les services avec les informations d'établissement
        const servicesEnriched = await Promise.all(
          servicesData.map(async (service: Service) => {
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [toast]);

  // Charger les détails du lit lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchLitDetails(id);
    }
  }, [id, fetchLitDetails]);

  const initialData = {
    numeroLit: "",
    chambre: "",
    etage: "",
    type: "",
    statut: "Disponible",
    serviceId: "",
    patientId: "",
  };

  const handleSubmit = async (id: string, data: typeof initialData) => {
    await updateLit(id, data);
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
            { value: "Disponible", label: "Disponible" },
            { value: "Occupé", label: "Occupé" },
            { value: "En maintenance", label: "En maintenance" },
            { value: "Réservé", label: "Réservé" },
          ],
        },
        {
          name: "serviceId",
          label: "Service",
          type: "select",
          required: true,
          options: services.map((service) => ({
            value: service.id,
            label: `${service.nom} ${
              service.etablissement ? `(${service.etablissement.nom})` : ""
            }`,
          })),
        },
      ],
    },
  ];

  return (
    <GenericEditForm
      title="Modifier le lit"
      entityName="du lit"
      id={id || ""}
      initialData={initialData}
      loadedData={litSelectionne}
      isLoading={isLoading || loadingServices}
      error={error}
      sections={formSections}
      schema={litFormSchema}
      onSubmit={handleSubmit}
      cancelPath={id ? `/lits/${id}` : "/lits"}
    />
  );
};

export default EditLitPage;
