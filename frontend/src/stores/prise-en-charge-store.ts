import { create } from "zustand";
import { Patient, Personnel, PriseEnCharge, Service } from "@/types/types";

// Type étendu pour les prises en charge avec relations
export interface PriseEnChargeWithRelations extends PriseEnCharge {
  patient?: Patient;
  personnel?: Personnel & { service?: Service };
}

interface PriseEnChargeState {
  // État
  prisesEnCharge: PriseEnChargeWithRelations[];
  priseEnChargeSelectionnee: PriseEnChargeWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPrisesEnCharge: () => Promise<void>;
  fetchPriseEnChargeDetails: (id: string) => Promise<void>;
  createPriseEnCharge: (
    priseEnCharge: Omit<PriseEnCharge, "id">
  ) => Promise<void>;
  updatePriseEnCharge: (
    id: string,
    priseEnChargeData: Partial<PriseEnCharge>
  ) => Promise<void>;
  deletePriseEnCharge: (id: string) => Promise<boolean>;
  fetchPrisesEnChargePatient: (patientId: string) => Promise<void>;
  fetchPrisesEnChargePersonnel: (personnelId: string) => Promise<void>;
  completePriseEnCharge: (id: string, notes: string) => Promise<void>;
}

export const usePriseEnChargeStore = create<PriseEnChargeState>((set, get) => ({
  // État initial
  prisesEnCharge: [],
  priseEnChargeSelectionnee: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPrisesEnCharge: async () => {
    set({ isLoading: true, error: null });
    try {
      // Récupération des prises en charge de base
      const response = await fetch("http://localhost:3000/prisesEnCharge");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des prises en charge (${response.status})`
        );
      const basePrisesEnCharge = await response.json();

      // Enrichir chaque prise en charge avec ses relations patient et personnel
      const prisesEnChargeComplete = await Promise.all(
        basePrisesEnCharge.map(async (pec: PriseEnCharge) => {
          const result: PriseEnChargeWithRelations = { ...pec };

          // Récupérer les informations du patient
          try {
            const patientResponse = await fetch(
              `http://localhost:3000/patients/${pec.patientId}`
            );
            if (patientResponse.ok) {
              result.patient = await patientResponse.json();
            }
          } catch (err) {
            console.warn("Impossible de récupérer le patient:", err);
          }

          // Récupérer les informations du personnel
          try {
            const personnelResponse = await fetch(
              `http://localhost:3000/personnels/${pec.personnelId}`
            );
            if (personnelResponse.ok) {
              const personnel = await personnelResponse.json();

              // Récupérer les informations du service si le personnel a un service
              if (personnel.serviceId) {
                try {
                  const serviceResponse = await fetch(
                    `http://localhost:3000/services/${personnel.serviceId}`
                  );
                  if (serviceResponse.ok) {
                    const service = await serviceResponse.json();
                    result.personnel = { ...personnel, service };
                  } else {
                    result.personnel = personnel;
                  }
                } catch (err) {
                  console.warn("Impossible de récupérer le service:", err);
                  result.personnel = personnel;
                }
              } else {
                result.personnel = personnel;
              }
            }
          } catch (err) {
            console.warn("Impossible de récupérer le personnel:", err);
          }

          return result;
        })
      );

      set({ prisesEnCharge: prisesEnChargeComplete, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchPriseEnChargeDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Récupération de la prise en charge
      const priseEnChargeResponse = await fetch(
        `http://localhost:3000/prisesEnCharge/${id}`
      );
      if (!priseEnChargeResponse.ok)
        throw new Error(
          `Prise en charge non trouvée (${priseEnChargeResponse.status})`
        );
      const priseEnChargeData: PriseEnCharge =
        await priseEnChargeResponse.json();

      // Récupération des relations
      const priseEnChargeWithRelations: PriseEnChargeWithRelations = {
        ...priseEnChargeData,
      };

      // Récupération du patient
      try {
        if (priseEnChargeData.patientId) {
          const patientResponse = await fetch(
            `http://localhost:3000/patients/${priseEnChargeData.patientId}`
          );
          if (patientResponse.ok) {
            priseEnChargeWithRelations.patient = await patientResponse.json();
          }
        }
      } catch (err) {
        console.warn("Impossible de récupérer les détails du patient:", err);
      }

      // Récupération du personnel
      try {
        if (priseEnChargeData.personnelId) {
          const personnelResponse = await fetch(
            `http://localhost:3000/personnels/${priseEnChargeData.personnelId}`
          );
          if (personnelResponse.ok) {
            const personnel: Personnel = await personnelResponse.json();

            // Récupération des informations du service
            if (personnel.serviceId) {
              try {
                const serviceResponse = await fetch(
                  `http://localhost:3000/services/${personnel.serviceId}`
                );
                if (serviceResponse.ok) {
                  const service = await serviceResponse.json();
                  priseEnChargeWithRelations.personnel = {
                    ...personnel,
                    service,
                  };
                } else {
                  priseEnChargeWithRelations.personnel = personnel;
                }
              } catch (err) {
                console.warn("Impossible de récupérer le service:", err);
                priseEnChargeWithRelations.personnel = personnel;
              }
            } else {
              priseEnChargeWithRelations.personnel = personnel;
            }
          }
        }
      } catch (err) {
        console.warn("Impossible de récupérer les détails du personnel:", err);
      }

      set({
        priseEnChargeSelectionnee: priseEnChargeWithRelations,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createPriseEnCharge: async (priseEnCharge: Omit<PriseEnCharge, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/prisesEnCharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priseEnCharge),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la création de la prise en charge (${response.status})`
        );

      await get().fetchPrisesEnCharge();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    }
  },

  updatePriseEnCharge: async (
    id: string,
    priseEnChargeData: Partial<PriseEnCharge>
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/prisesEnCharge/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(priseEnChargeData),
        }
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour de la prise en charge (${response.status})`
        );

      if (get().priseEnChargeSelectionnee?.id === id) {
        await get().fetchPriseEnChargeDetails(id);
      }
      await get().fetchPrisesEnCharge();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  deletePriseEnCharge: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/prisesEnCharge/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression de la prise en charge (${response.status})`
        );

      await get().fetchPrisesEnCharge();

      if (get().priseEnChargeSelectionnee?.id === id) {
        set({ priseEnChargeSelectionnee: null });
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

  fetchPrisesEnChargePatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/prisesEnCharge?patientId=${patientId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des prises en charge du patient (${response.status})`
        );
      const basePrisesEnCharge = await response.json();

      // Récupérer les informations de personnel avec service pour chaque prise en charge
      const prisesEnChargeComplete = await Promise.all(
        basePrisesEnCharge.map(async (pec: PriseEnCharge) => {
          const result: PriseEnChargeWithRelations = { ...pec };

          // Récupérer les informations du personnel
          if (pec.personnelId) {
            try {
              const personnelResponse = await fetch(
                `http://localhost:3000/personnels/${pec.personnelId}`
              );
              if (personnelResponse.ok) {
                const personnel: Personnel = await personnelResponse.json();

                // Récupérer les informations du service
                if (personnel.serviceId) {
                  try {
                    const serviceResponse = await fetch(
                      `http://localhost:3000/services/${personnel.serviceId}`
                    );
                    if (serviceResponse.ok) {
                      const service = await serviceResponse.json();
                      result.personnel = { ...personnel, service };
                    } else {
                      result.personnel = personnel;
                    }
                  } catch (err) {
                    console.warn("Impossible de récupérer le service:", err);
                    result.personnel = personnel;
                  }
                } else {
                  result.personnel = personnel;
                }
              }
            } catch (err) {
              console.warn("Impossible de récupérer le personnel:", err);
            }
          }

          return result;
        })
      );

      set({ prisesEnCharge: prisesEnChargeComplete, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchPrisesEnChargePersonnel: async (personnelId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/prises-en-charge?personnelId=${personnelId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des prises en charge du personnel (${response.status})`
        );
      const prisesEnCharge = await response.json();
      set({ prisesEnCharge, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  completePriseEnCharge: async (id: string, notes: string) => {
    set({ isLoading: true, error: null });
    try {
      // Marque la prise en charge comme terminée avec des notes
      await get().updatePriseEnCharge(id, {
        notes,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },
}));
