import { create } from "zustand";
import { Lit, LitWithRelations, Service } from "@/types/types";

interface LitState {
  // État
  lits: Lit[];
  litSelectionne: LitWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchLits: () => Promise<void>;
  fetchLitDetails: (id: string) => Promise<void>;
  createLit: (lit: Omit<Lit, "id">) => Promise<void>;
  updateLit: (id: string, litData: Partial<Lit>) => Promise<void>;
  deleteLit: (id: string) => Promise<boolean>;
  associerLitService: (litId: string, serviceId: string) => Promise<void>;
}

export const useLitStore = create<LitState>((set, get) => ({
  // État initial
  lits: [],
  litSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchLits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/lits");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des lits (${response.status})`
        );
      const lits = await response.json();
      set({ lits, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchLitDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const litResponse = await fetch(`http://localhost:3000/lits/${id}`);
      if (!litResponse.ok)
        throw new Error(`Lit non trouvé (${litResponse.status})`);
      const litData = await litResponse.json();

      // Récupération du service associé
      let serviceData: Service | undefined = undefined;
      try {
        const serviceResponse = await fetch(
          `http://localhost:3000/services/${litData.serviceId}`
        );
        if (serviceResponse.ok) {
          serviceData = await serviceResponse.json();
        }
      } catch (err) {
        console.warn("Impossible de récupérer les détails du service:", err);
      }

      // Récupération des réservations
      const reservationsResponse = await fetch(
        `http://localhost:3000/reservations-lits?litId=${id}`
      );
      const reservations = reservationsResponse.ok
        ? await reservationsResponse.json()
        : [];

      // Assemblage des données avec le type LitWithRelations
      const litWithRelations: LitWithRelations = {
        ...litData,
        service: serviceData,
        reservations,
      };

      set({ litSelectionne: litWithRelations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createLit: async (lit: Omit<Lit, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/lits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lit),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la création du lit (${response.status})`
        );

      // Rafraîchir la liste des lits
      await get().fetchLits();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  updateLit: async (id: string, litData: Partial<Lit>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/lits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(litData),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du lit (${response.status})`
        );

      // Mettre à jour le lit sélectionné s'il est concerné
      if (get().litSelectionne?.id === id) {
        await get().fetchLitDetails(id);
      }

      // Rafraîchir la liste des lits
      await get().fetchLits();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  deleteLit: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/lits/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du lit (${response.status})`
        );

      // Rafraîchir la liste des lits
      await get().fetchLits();

      // Réinitialiser le lit sélectionné s'il a été supprimé
      if (get().litSelectionne?.id === id) {
        set({ litSelectionne: null });
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

  associerLitService: async (litId: string, serviceId: string) => {
    set({ isLoading: true, error: null });
    try {
      await get().updateLit(litId, { serviceId });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },
}));
