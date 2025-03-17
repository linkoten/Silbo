import { create } from "zustand";
import {
  Etablissement,
  Service,
  Lit,
  Personnel,
  ReservationLit,
} from "@/types/types";

// Type étendu pour les établissements avec relations
export interface EtablissementWithRelations extends Etablissement {
  services: Service[];
  lits?: Lit[];
  personnels?: Personnel[];
  reservations?: ReservationLit[];
}

interface EtablissementState {
  // État
  etablissements: Etablissement[];
  etablissementSelectionne: EtablissementWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEtablissements: () => Promise<void>;
  fetchEtablissementDetails: (id: string) => Promise<void>;
  createEtablissement: (
    etablissement: Omit<Etablissement, "id">
  ) => Promise<void>;
  updateEtablissement: (
    id: string,
    etablissementData: Partial<Etablissement>
  ) => Promise<void>;
  deleteEtablissement: (id: string) => Promise<boolean>;
}

export const useEtablissementStore = create<EtablissementState>((set, get) => ({
  // État initial
  etablissements: [],
  etablissementSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchEtablissements: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/etablissements");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des établissements (${response.status})`
        );
      const etablissements = await response.json();
      set({ etablissements, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchEtablissementDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Récupération des données de l'établissement
      const etablissementResponse = await fetch(
        `http://localhost:3000/etablissements/${id}`
      );

      if (!etablissementResponse.ok) {
        throw new Error(
          `Établissement non trouvé (${etablissementResponse.status})`
        );
      }

      const etablissementData: Etablissement =
        await etablissementResponse.json();

      // Récupération des services liés à cet établissement
      const servicesResponse = await fetch(
        `http://localhost:3000/services?etablissementId=${id}`
      );
      const services: Service[] = servicesResponse.ok
        ? await servicesResponse.json()
        : [];

      // Pour chaque service, récupérer et associer ses lits
      const servicesWithLits = await Promise.all(
        services.map(async (service) => {
          const litsResponse = await fetch(
            `http://localhost:3000/lits?serviceId=${service.id}`
          );
          const lits: Lit[] = litsResponse.ok ? await litsResponse.json() : [];

          // Filtrage pour ne garder que les lits qui appartiennent vraiment à ce service
          const serviceLits = lits.filter(
            (lit) => lit.serviceId === service.id
          );

          return {
            ...service,
            lits: serviceLits,
          };
        })
      );

      // Récupération des personnels associés à l'établissement
      const personnelsResponse = await fetch(
        `http://localhost:3000/personnels?etablissementId=${id}`
      );
      const personnels: Personnel[] = personnelsResponse.ok
        ? await personnelsResponse.json()
        : [];

      // Récupération de tous les lits de l'établissement
      const allLits = servicesWithLits.flatMap((service) => service.lits || []);

      // Récupération des réservations pour les lits de l'établissement
      let allReservations: ReservationLit[] = [];
      if (allLits.length > 0) {
        const reservationsPromises = allLits.map((lit) =>
          fetch(`http://localhost:3000/reservations-lits?litId=${lit.id}`).then(
            (res) => (res.ok ? res.json() : [])
          )
        );

        const reservationsResults = await Promise.all(reservationsPromises);
        const unfilteredReservations = reservationsResults.flat();

        // Filtrage pour s'assurer que les réservations correspondent aux lits de l'établissement
        allReservations = unfilteredReservations.filter((reservation) =>
          allLits.some((lit) => lit.id === reservation.litId)
        );

        // Enrichir les réservations avec les informations des patients et des lits
        if (allReservations.length > 0) {
          // Récupérer tous les patients associés aux réservations
          const patientIds = [
            ...new Set(allReservations.map((r) => r.patientId)),
          ];
          const patientsPromises = patientIds.map((patientId) =>
            fetch(`http://localhost:3000/patients/${patientId}`).then((res) =>
              res.ok ? res.json() : null
            )
          );

          const patientsResults = await Promise.all(patientsPromises);
          const patients = patientsResults.filter((p) => p !== null);

          // Associer les patients et les lits à chaque réservation
          allReservations = allReservations.map((reservation) => {
            const patient = patients.find(
              (p) => p && p.id === reservation.patientId
            );
            const lit = allLits.find((l) => l.id === reservation.litId);
            const service = lit
              ? servicesWithLits.find((s) => s.id === lit.serviceId)
              : undefined;

            return {
              ...reservation,
              patient: patient
                ? { id: patient.id, nom: patient.nom, prenom: patient.prenom }
                : undefined,
              lit: lit
                ? {
                    id: lit.id,
                    numeroLit: lit.numeroLit,
                    serviceId: lit.serviceId,
                    chambre: lit.chambre,
                  }
                : undefined,
              service: service
                ? { id: service.id, nom: service.nom }
                : undefined,
            };
          });
        }
      }

      // Assemblage des données
      const etablissementWithRelations: EtablissementWithRelations = {
        ...etablissementData,
        services: servicesWithLits,
        lits: allLits,
        personnels: personnels,
        reservations: allReservations,
      };

      set({
        etablissementSelectionne: etablissementWithRelations,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createEtablissement: async (etablissement: Omit<Etablissement, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(etablissement),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            `Erreur lors de la création de l'établissement (${response.status})`
        );
      }

      // Rafraîchir la liste des établissements
      await get().fetchEtablissements();
      set({ isLoading: false });

      // Retourner l'établissement créé
      return response.json();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error; // Re-throw to allow component to handle the error
    }
  },

  updateEtablissement: async (
    id: string,
    etablissementData: Partial<Etablissement>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/etablissements/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(etablissementData),
        }
      );

      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour de l'établissement (${response.status})`
        );

      // Si l'établissement actuellement sélectionné est celui que nous venons de mettre à jour,
      // récupérons ses détails à nouveau
      if (get().etablissementSelectionne?.id === id) {
        await get().fetchEtablissementDetails(id);
      }

      // Rafraîchir la liste des établissements
      await get().fetchEtablissements();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteEtablissement: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/etablissements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression de l'établissement (${response.status})`
        );

      // Rafraîchir la liste des établissements
      await get().fetchEtablissements();

      // Si l'établissement supprimé était sélectionné, le désélectionner
      if (get().etablissementSelectionne?.id === id) {
        set({ etablissementSelectionne: null });
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
}));
