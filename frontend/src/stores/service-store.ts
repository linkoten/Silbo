import { create } from "zustand";
import { Service, ServiceWithRelations, Lit } from "@/types/types";

interface ServiceState {
  // État
  services: Service[];
  serviceSelectionne: ServiceWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  fetchServiceDetails: (id: string) => Promise<void>;
  createService: (service: Omit<Service, "id">) => Promise<void>;
  updateService: (id: string, serviceData: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<boolean>;
  fetchServicesByEtablissement: (etablissementId: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  // État initial
  services: [],
  serviceSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/services");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des services (${response.status})`
        );
      const services = await response.json();
      set({ services, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchServiceDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/services/${id}`);
      if (!response.ok) {
        throw new Error(`Service non trouvé (${response.status})`);
      }

      const serviceData = await response.json();

      // Récupération des lits du service si nécessaire
      let lits = [];
      try {
        const litsResponse = await fetch(
          `http://localhost:3000/lits?serviceId=${id}`
        );
        if (litsResponse.ok) {
          lits = await litsResponse.json();
        }
      } catch (err) {
        console.warn("Impossible de récupérer les lits du service:", err);
      }

      // Filtrer pour ne garder que les lits appartenant réellement à ce service
      const litsFiltered = Array.isArray(serviceData.lits)
        ? serviceData.lits.filter((lit: Lit) => lit.serviceId === id)
        : Array.isArray(lits)
        ? lits.filter((lit) => lit.serviceId === id)
        : [];

      // Assurer que le service a toujours un tableau lits, même si l'API ne le renvoie pas
      const serviceWithRelations: ServiceWithRelations = {
        ...serviceData,
        lits: litsFiltered,
        // Calculer des métriques supplémentaires pour les lits appartenant à ce service
        litsDisponibles: litsFiltered.filter(
          (lit: Lit) => lit.statut === "Disponible"
        ).length,
        litsOccupes: litsFiltered.filter(
          (lit: Lit) => lit.statut === "Occupé" || lit.statut === "occupé"
        ).length,
        litsEnMaintenance: litsFiltered.filter(
          (lit: Lit) => lit.statut === "Maintenance"
        ).length,
      };

      // Calculer les taux
      const totalLits = serviceWithRelations.lits.length;
      if (totalLits > 0) {
        serviceWithRelations.tauxOccupation = Math.round(
          (serviceWithRelations.litsOccupes! / totalLits) * 100
        );
        serviceWithRelations.tauxDisponibilite = Math.round(
          (serviceWithRelations.litsDisponibles! / totalLits) * 100
        );
      } else {
        serviceWithRelations.tauxOccupation = 0;
        serviceWithRelations.tauxDisponibilite = 0;
      }

      set({ serviceSelectionne: serviceWithRelations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createService: async (service: Omit<Service, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la création du service (${response.status})`
        );

      // Refresh services list after creating
      await get().fetchServices();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },

  updateService: async (id: string, serviceData: Partial<Service>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du service (${response.status})`
        );

      // Refresh services list and selected service
      if (get().serviceSelectionne?.id === id) {
        await get().fetchServiceDetails(id);
      }
      await get().fetchServices();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  deleteService: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/services/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du service (${response.status})`
        );

      // Refresh services list
      await get().fetchServices();

      // Reset selected service if it's the one deleted
      if (get().serviceSelectionne?.id === id) {
        set({ serviceSelectionne: null });
      }

      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      return false;
    }
  },

  fetchServicesByEtablissement: async (etablissementId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/services?etablissementId=${etablissementId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des services (${response.status})`
        );
      const services = await response.json();
      set({ services, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },
}));
