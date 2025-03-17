import { create } from "zustand";
import { Materiel, Service } from "@/types/types";

// Type pour les matériels avec relations
interface MaterielWithRelations extends Materiel {
  service?: Service;
}

interface MaterielState {
  // État
  materiels: Materiel[];
  materielSelectionne: MaterielWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMateriels: () => Promise<void>;
  fetchMaterielDetails: (id: string) => Promise<void>;
  createMateriel: (materiel: Omit<Materiel, "id">) => Promise<void>;
  updateMateriel: (
    id: string,
    materielData: Partial<Materiel>
  ) => Promise<void>;
  deleteMateriel: (id: string) => Promise<boolean>;
  updateStock: (id: string, quantite: number) => Promise<void>;
}

export const useMaterielStore = create<MaterielState>((set, get) => ({
  // État initial
  materiels: [],
  materielSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchMateriels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/materiels");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération du matériel (${response.status})`
        );
      const materiels = await response.json();
      set({ materiels, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchMaterielDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const materielResponse = await fetch(
        `http://localhost:3000/materiels/${id}`
      );
      if (!materielResponse.ok)
        throw new Error(`Matériel non trouvé (${materielResponse.status})`);
      const materielData: Materiel = await materielResponse.json();

      // Récupération du service associé
      let serviceData: Service | undefined = undefined;
      try {
        if (materielData.serviceId) {
          const serviceResponse = await fetch(
            `http://localhost:3000/services/${materielData.serviceId}`
          );
          if (serviceResponse.ok) {
            serviceData = await serviceResponse.json();
          }
        }
      } catch (err) {
        console.warn("Impossible de récupérer les détails du service:", err);
      }

      // Construction de l'objet avec relations
      const materielWithRelations: MaterielWithRelations = {
        ...materielData,
        service: serviceData,
      };

      set({ materielSelectionne: materielWithRelations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createMateriel: async (materiel: Omit<Materiel, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/materiels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(materiel),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.details ||
            `Erreur lors de la création du matériel (${response.status})`
        );
      }

      await get().fetchMateriels();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error; // Re-throw to allow component to handle the error
    }
  },

  updateMateriel: async (id: string, materielData: Partial<Materiel>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/materiels/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(materielData),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du matériel (${response.status})`
        );

      if (get().materielSelectionne?.id === id) {
        await get().fetchMaterielDetails(id);
      }
      await get().fetchMateriels();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteMateriel: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/materiels/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du matériel (${response.status})`
        );

      await get().fetchMateriels();

      if (get().materielSelectionne?.id === id) {
        set({ materielSelectionne: null });
      }

      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      return false;
    }
  },

  updateStock: async (id: string, quantite: number) => {
    set({ isLoading: true, error: null });
    try {
      const materiel = get().materiels.find((m) => m.id === id);
      if (!materiel) throw new Error("Matériel non trouvé");

      await get().updateMateriel(id, { quantite });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },
}));
