import { create } from "zustand";
import {
  Personnel,
  PersonnelWithRelations,
  PriseEnChargeWithPatient,
} from "@/types/types";

interface PersonnelState {
  // État
  personnels: Personnel[];
  personnelSelectionne: PersonnelWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPersonnels: () => Promise<void>;
  fetchPersonnelDetails: (id: string) => Promise<void>;
  createPersonnel: (personnel: Omit<Personnel, "id">) => Promise<void>;
  updatePersonnel: (
    id: string,
    personnelData: Partial<Personnel>
  ) => Promise<void>;
  deletePersonnel: (id: string) => Promise<boolean>;
  fetchPersonnelsByService: (serviceId: string) => Promise<void>;
  fetchPersonnelsByEtablissement: (etablissementId: string) => Promise<void>;
}

export const usePersonnelStore = create<PersonnelState>((set, get) => ({
  // État initial
  personnels: [],
  personnelSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPersonnels: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/personnels");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des personnels (${response.status})`
        );
      const personnels = await response.json();
      set({ personnels, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchPersonnelDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Récupération du personnel
      const personnelResponse = await fetch(
        `http://localhost:3000/personnels/${id}`
      );
      if (!personnelResponse.ok)
        throw new Error(`Personnel non trouvé (${personnelResponse.status})`);
      const personnelData = await personnelResponse.json();

      // Récupération des relations
      const personnelWithRelations: PersonnelWithRelations = {
        ...personnelData,
        prisesEnCharge: [],
        servicesResponsable: [],
      };

      // Récupération du service associé
      if (personnelData.serviceId) {
        try {
          const serviceResponse = await fetch(
            `http://localhost:3000/services/${personnelData.serviceId}`
          );
          if (serviceResponse.ok) {
            personnelWithRelations.service = await serviceResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer le service:", err);
        }
      }

      // Récupération de l'établissement associé
      if (personnelData.etablissementId) {
        try {
          const etablissementResponse = await fetch(
            `http://localhost:3000/etablissements/${personnelData.etablissementId}`
          );
          if (etablissementResponse.ok) {
            personnelWithRelations.etablissement =
              await etablissementResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer l'établissement:", err);
        }
      }

      // Récupération des prises en charge
      try {
        const prisesEnChargeResponse = await fetch(
          `http://localhost:3000/prisesEnCharge?personnelId=${id}`
        );
        if (prisesEnChargeResponse.ok) {
          const prisesEnCharge = await prisesEnChargeResponse.json();

          // Récupération des informations de patient pour chaque prise en charge
          const prisesEnChargeWithPatients: PriseEnChargeWithPatient[] =
            await Promise.all(
              prisesEnCharge.map(async (pec: any) => {
                if (pec.patientId) {
                  try {
                    const patientResponse = await fetch(
                      `http://localhost:3000/patients/${pec.patientId}`
                    );
                    if (patientResponse.ok) {
                      return {
                        ...pec,
                        patient: await patientResponse.json(),
                      };
                    }
                  } catch (err) {
                    console.warn("Impossible de récupérer le patient:", err);
                  }
                }
                return pec;
              })
            );

          // Filtrer pour ne garder que les prises en charge appartenant à ce personnel
          personnelWithRelations.prisesEnCharge =
            prisesEnChargeWithPatients.filter((pec) => pec.personnelId === id);
        }
      } catch (err) {
        console.warn("Impossible de récupérer les prises en charge:", err);
      }

      // Récupération des services dont ce personnel est responsable
      try {
        const servicesResponse = await fetch(
          `http://localhost:3000/services?responsableId=${id}`
        );
        if (servicesResponse.ok) {
          personnelWithRelations.servicesResponsable =
            await servicesResponse.json();
        }
      } catch (err) {
        console.warn("Impossible de récupérer les services responsables:", err);
      }

      set({ personnelSelectionne: personnelWithRelations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createPersonnel: async (personnel: Omit<Personnel, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/personnels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personnel),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la création du personnel (${response.status})`
        );

      // Rafraîchir la liste des personnels
      await get().fetchPersonnels();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },

  updatePersonnel: async (id: string, personnelData: Partial<Personnel>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/personnels/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personnelData),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du personnel (${response.status})`
        );

      // Mettre à jour le personnel sélectionné s'il est concerné
      if (get().personnelSelectionne?.id === id) {
        await get().fetchPersonnelDetails(id);
      }

      // Rafraîchir la liste des personnels
      await get().fetchPersonnels();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  deletePersonnel: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/personnels/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du personnel (${response.status})`
        );

      // Rafraîchir la liste des personnels
      await get().fetchPersonnels();

      // Réinitialiser le personnel sélectionné s'il a été supprimé
      if (get().personnelSelectionne?.id === id) {
        set({ personnelSelectionne: null });
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

  fetchPersonnelsByService: async (serviceId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/personnels?serviceId=${serviceId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des personnels du service (${response.status})`
        );

      const personnels = await response.json();

      // Filtrer pour ne garder que les personnels appartenant à ce service
      const filteredPersonnels = personnels.filter(
        (personnel: Personnel) => personnel.serviceId === serviceId
      );

      set({ personnels: filteredPersonnels, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchPersonnelsByEtablissement: async (etablissementId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/personnels?etablissementId=${etablissementId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des personnels de l'établissement (${response.status})`
        );

      const personnels = await response.json();

      // Filtrer pour ne garder que les personnels appartenant à cet établissement
      const filteredPersonnels = personnels.filter(
        (personnel: Personnel) => personnel.etablissementId === etablissementId
      );

      set({ personnels: filteredPersonnels, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },
}));
