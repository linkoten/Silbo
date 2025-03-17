import { create } from "zustand";
import { Transfert, Patient, Service, Etablissement } from "@/types/types";

export interface TransfertWithRelations extends Transfert {
  patient?: Patient;
  serviceDepart?: Service;
  serviceArrivee?: Service;
  etablissementDepart?: Etablissement;
  etablissementArrivee?: Etablissement;
}

interface TransfertState {
  // État
  transferts: TransfertWithRelations[];
  transfertSelectionne: TransfertWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransferts: () => Promise<void>;
  fetchTransfertDetails: (id: string) => Promise<void>;
  fetchTransfertsPatient: (patientId: string) => Promise<void>;
  createTransfert: (transfert: Omit<Transfert, "id">) => Promise<void>;
  updateTransfert: (
    id: string,
    transfertData: Partial<Transfert>
  ) => Promise<void>;
  deleteTransfert: (id: string) => Promise<boolean>;
  validateTransfert: (id: string) => Promise<boolean>;
}

export const useTransfertStore = create<TransfertState>((set, get) => ({
  // État initial
  transferts: [],
  transfertSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchTransferts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/transferts");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des transferts (${response.status})`
        );

      const baseTransferts = await response.json();

      // Enrichir les transferts avec leurs relations
      const transfertsEnrichis: TransfertWithRelations[] = await Promise.all(
        baseTransferts.map(async (transfert: Transfert) => {
          const enriched: TransfertWithRelations = { ...transfert };

          // Récupérer les infos du patient
          try {
            const patientResponse = await fetch(
              `http://localhost:3000/patients/${transfert.patientId}`
            );
            if (patientResponse.ok) {
              enriched.patient = await patientResponse.json();
            }
          } catch (error) {
            console.warn("Impossible de récupérer le patient", error);
          }

          // Récupérer les infos des services
          try {
            const serviceDepartResponse = await fetch(
              `http://localhost:3000/services/${transfert.serviceDepartId}`
            );
            if (serviceDepartResponse.ok) {
              enriched.serviceDepart = await serviceDepartResponse.json();
            }

            const serviceArriveeResponse = await fetch(
              `http://localhost:3000/services/${transfert.serviceArriveeId}`
            );
            if (serviceArriveeResponse.ok) {
              enriched.serviceArrivee = await serviceArriveeResponse.json();
            }
          } catch (error) {
            console.warn("Impossible de récupérer les services", error);
          }

          // Récupérer les infos des établissements (si disponibles)
          if (transfert.etablissementDepartId) {
            try {
              const etablissementDepartResponse = await fetch(
                `http://localhost:3000/etablissements/${transfert.etablissementDepartId}`
              );
              if (etablissementDepartResponse.ok) {
                enriched.etablissementDepart =
                  await etablissementDepartResponse.json();
              }
            } catch (error) {
              console.warn(
                "Impossible de récupérer l'établissement de départ",
                error
              );
            }
          }

          if (transfert.etablissementArriveeId) {
            try {
              const etablissementArriveeResponse = await fetch(
                `http://localhost:3000/etablissements/${transfert.etablissementArriveeId}`
              );
              if (etablissementArriveeResponse.ok) {
                enriched.etablissementArrivee =
                  await etablissementArriveeResponse.json();
              }
            } catch (error) {
              console.warn(
                "Impossible de récupérer l'établissement d'arrivée",
                error
              );
            }
          }

          return enriched;
        })
      );

      set({ transferts: transfertsEnrichis, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchTransfertDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/transferts/${id}`);
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération du transfert (${response.status})`
        );

      const transfert = await response.json();
      const enriched: TransfertWithRelations = { ...transfert };

      // Récupérer les infos du patient
      try {
        const patientResponse = await fetch(
          `http://localhost:3000/patients/${transfert.patientId}`
        );
        if (patientResponse.ok) {
          enriched.patient = await patientResponse.json();
        }
      } catch (error) {
        console.warn("Impossible de récupérer le patient", error);
      }

      // Récupérer les infos des services
      try {
        const serviceDepartResponse = await fetch(
          `http://localhost:3000/services/${transfert.serviceDepartId}`
        );
        if (serviceDepartResponse.ok) {
          enriched.serviceDepart = await serviceDepartResponse.json();
        }

        const serviceArriveeResponse = await fetch(
          `http://localhost:3000/services/${transfert.serviceArriveeId}`
        );
        if (serviceArriveeResponse.ok) {
          enriched.serviceArrivee = await serviceArriveeResponse.json();
        }
      } catch (error) {
        console.warn("Impossible de récupérer les services", error);
      }

      // Récupérer les infos des établissements (si disponibles)
      if (transfert.etablissementDepartId) {
        try {
          const etablissementDepartResponse = await fetch(
            `http://localhost:3000/etablissements/${transfert.etablissementDepartId}`
          );
          if (etablissementDepartResponse.ok) {
            enriched.etablissementDepart =
              await etablissementDepartResponse.json();
          }
        } catch (error) {
          console.warn(
            "Impossible de récupérer l'établissement de départ",
            error
          );
        }
      }

      if (transfert.etablissementArriveeId) {
        try {
          const etablissementArriveeResponse = await fetch(
            `http://localhost:3000/etablissements/${transfert.etablissementArriveeId}`
          );
          if (etablissementArriveeResponse.ok) {
            enriched.etablissementArrivee =
              await etablissementArriveeResponse.json();
          }
        } catch (error) {
          console.warn(
            "Impossible de récupérer l'établissement d'arrivée",
            error
          );
        }
      }

      set({ transfertSelectionne: enriched, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchTransfertsPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/transferts?patientId=${patientId}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des transferts du patient (${response.status})`
        );

      const transferts = await response.json();

      // Enrichir les transferts avec leurs relations
      const transfertsEnrichis = await Promise.all(
        transferts.map(async (transfert: Transfert) => {
          const enriched: TransfertWithRelations = { ...transfert };

          // Récupérer les infos des services
          try {
            const serviceDepartResponse = await fetch(
              `http://localhost:3000/services/${transfert.serviceDepartId}`
            );
            if (serviceDepartResponse.ok) {
              enriched.serviceDepart = await serviceDepartResponse.json();
            }

            const serviceArriveeResponse = await fetch(
              `http://localhost:3000/services/${transfert.serviceArriveeId}`
            );
            if (serviceArriveeResponse.ok) {
              enriched.serviceArrivee = await serviceArriveeResponse.json();
            }
          } catch (error) {
            console.warn("Impossible de récupérer les services", error);
          }

          return enriched;
        })
      );

      set({ transferts: transfertsEnrichis, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createTransfert: async (transfertData: Omit<Transfert, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/transferts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transfertData),
      });

      if (!response.ok)
        throw new Error(
          `Erreur lors de la création du transfert (${response.status})`
        );

      // Après création réussie, rafraîchir la liste des transferts
      await get().fetchTransferts();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransfert: async (id: string, transfertData: Partial<Transfert>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/transferts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transfertData),
      });

      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du transfert (${response.status})`
        );

      // Si le transfert en cours de modification est celui sélectionné, mettre à jour ses détails
      if (get().transfertSelectionne?.id === id) {
        await get().fetchTransfertDetails(id);
      }

      // Rafraîchir la liste des transferts
      await get().fetchTransferts();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransfert: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/transferts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du transfert (${response.status})`
        );

      // Rafraîchir la liste des transferts
      await get().fetchTransferts();

      // Si c'était le transfert sélectionné, le désélectionner
      if (get().transfertSelectionne?.id === id) {
        set({ transfertSelectionne: null });
      }

      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  validateTransfert: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mettre à jour le statut du transfert à "Validé"
      await get().updateTransfert(id, { statut: "Validé" });
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
