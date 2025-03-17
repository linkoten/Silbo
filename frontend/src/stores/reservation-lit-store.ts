import { create } from "zustand";
import {
  ReservationLit,
  Patient,
  Lit,
  Service,
  Etablissement,
} from "@/types/types";

// Type étendu pour les réservations avec relations
export interface ReservationLitWithRelations extends ReservationLit {
  patient?: Patient;
  lit?: Lit;
  service?: Service; // Service associé au lit
  etablissementDestination?: Etablissement;
}

interface ReservationLitState {
  // État
  reservationsLit: ReservationLitWithRelations[];
  reservationLitSelectionnee: ReservationLitWithRelations | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReservationsLit: () => Promise<void>;
  fetchReservationLitDetails: (id: string) => Promise<void>;
  createReservationLit: (
    reservationLit: Omit<ReservationLit, "id">
  ) => Promise<void>;
  updateReservationLit: (
    id: string,
    reservationLitData: Partial<ReservationLit>
  ) => Promise<void>;
  deleteReservationLit: (id: string) => Promise<boolean>;
  fetchReservationsLitLit: (litId: string) => Promise<void>;
  fetchReservationsLitPatient: (patientId: string) => Promise<void>;
}

export const useReservationLitStore = create<ReservationLitState>(
  (set, get) => ({
    // État initial
    reservationsLit: [],
    reservationLitSelectionnee: null,
    isLoading: false,
    error: null,

    // Actions
    fetchReservationsLit: async () => {
      set({ isLoading: true, error: null });
      try {
        // Récupération des réservations de base
        const response = await fetch("http://localhost:3000/reservationsLit");
        if (!response.ok)
          throw new Error(
            `Erreur lors de la récupération des réservations de lit (${response.status})`
          );
        const baseReservationsLit = await response.json();

        // Enrichir chaque réservation avec ses relations
        const reservationsLitComplete: ReservationLitWithRelations[] =
          await Promise.all(
            baseReservationsLit.map(async (reservation: ReservationLit) => {
              const result: ReservationLitWithRelations = { ...reservation };

              // Récupérer les informations du patient
              try {
                const patientResponse = await fetch(
                  `http://localhost:3000/patients/${reservation.patientId}`
                );
                if (patientResponse.ok) {
                  result.patient = await patientResponse.json();
                }
              } catch (err) {
                console.warn("Impossible de récupérer le patient:", err);
              }

              // Récupérer les informations du lit et du service associé
              try {
                const litResponse = await fetch(
                  `http://localhost:3000/lits/${reservation.litId}`
                );
                if (litResponse.ok) {
                  const lit = await litResponse.json();
                  result.lit = lit;

                  if (lit.serviceId) {
                    const serviceResponse = await fetch(
                      `http://localhost:3000/services/${lit.serviceId}`
                    );
                    if (serviceResponse.ok) {
                      result.service = await serviceResponse.json();
                    }
                  }
                }
              } catch (err) {
                console.warn("Impossible de récupérer le lit:", err);
              }

              // Récupérer les informations de l'établissement de destination
              if (reservation.etablissementDestinationId) {
                try {
                  const etablissementResponse = await fetch(
                    `http://localhost:3000/etablissements/${reservation.etablissementDestinationId}`
                  );
                  if (etablissementResponse.ok) {
                    result.etablissementDestination =
                      await etablissementResponse.json();
                  }
                } catch (err) {
                  console.warn("Impossible de récupérer l'établissement:", err);
                }
              }

              return result;
            })
          );

        set({ reservationsLit: reservationsLitComplete, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
      }
    },

    fetchReservationLitDetails: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `http://localhost:3000/reservationsLit/${id}`
        );
        if (!response.ok)
          throw new Error(`Réservation non trouvée (${response.status})`);
        const reservationData = await response.json();

        // Récupération des relations
        const result: ReservationLitWithRelations = { ...reservationData };

        // Récupérer les informations du patient
        try {
          const patientResponse = await fetch(
            `http://localhost:3000/patients/${reservationData.patientId}`
          );
          if (patientResponse.ok) {
            result.patient = await patientResponse.json();
          }
        } catch (err) {
          console.warn("Impossible de récupérer le patient:", err);
        }

        // Récupérer les informations du lit et du service associé
        try {
          const litResponse = await fetch(
            `http://localhost:3000/lits/${reservationData.litId}`
          );
          if (litResponse.ok) {
            const lit = await litResponse.json();
            result.lit = lit;

            if (lit.serviceId) {
              const serviceResponse = await fetch(
                `http://localhost:3000/services/${lit.serviceId}`
              );
              if (serviceResponse.ok) {
                result.service = await serviceResponse.json();
              }
            }
          }
        } catch (err) {
          console.warn("Impossible de récupérer le lit:", err);
        }

        // Récupérer les informations de l'établissement de destination
        if (reservationData.etablissementDestinationId) {
          try {
            const etablissementResponse = await fetch(
              `http://localhost:3000/etablissements/${reservationData.etablissementDestinationId}`
            );
            if (etablissementResponse.ok) {
              result.etablissementDestination =
                await etablissementResponse.json();
            }
          } catch (err) {
            console.warn("Impossible de récupérer l'établissement:", err);
          }
        }

        set({ reservationLitSelectionnee: result, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
      }
    },

    createReservationLit: async (reservationLitData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("http://localhost:3000/reservationsLit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationLitData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.details || "Erreur lors de la création de la réservation"
          );
        }

        // Récupérer à nouveau toutes les réservations pour mettre à jour l'état
        await get().fetchReservationsLit();
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
        throw error;
      }
    },

    updateReservationLit: async (id, reservationLitData) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `http://localhost:3000/reservationsLit/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reservationLitData),
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur lors de la mise à jour: ${response.status}`);
        }

        // Mettre à jour la réservation sélectionnée si elle existe
        const currentReservation = get().reservationLitSelectionnee;
        if (currentReservation && currentReservation.id === id) {
          await get().fetchReservationLitDetails(id);
        }

        // Actualiser la liste
        await get().fetchReservationsLit();
        set({ isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
        throw error;
      }
    },

    deleteReservationLit: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `http://localhost:3000/reservationsLit/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur lors de la suppression: ${response.status}`);
        }

        // Actualiser la liste
        set((state) => ({
          reservationsLit: state.reservationsLit.filter(
            (reservation) => reservation.id !== id
          ),
          isLoading: false,
        }));
        return true;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
        return false;
      }
    },

    fetchReservationsLitLit: async (litId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `http://localhost:3000/reservationsLit?litId=${litId}`
        );
        if (!response.ok)
          throw new Error(
            `Erreur lors de la récupération des réservations (${response.status})`
          );
        const reservations = await response.json();

        // Enrichir chaque réservation avec ses relations
        const reservationsLitComplete: ReservationLitWithRelations[] =
          await Promise.all(
            reservations.map(async (reservation: ReservationLit) => {
              const result: ReservationLitWithRelations = { ...reservation };

              // Récupérer les informations du patient
              try {
                const patientResponse = await fetch(
                  `http://localhost:3000/patients/${reservation.patientId}`
                );
                if (patientResponse.ok) {
                  result.patient = await patientResponse.json();
                }
              } catch (err) {
                console.warn("Impossible de récupérer le patient:", err);
              }

              // Ajout des autres relations si nécessaire...

              return result;
            })
          );

        set({ reservationsLit: reservationsLitComplete, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
      }
    },

    fetchReservationsLitPatient: async (patientId) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `http://localhost:3000/reservationsLit?patientId=${patientId}`
        );
        if (!response.ok)
          throw new Error(
            `Erreur lors de la récupération des réservations (${response.status})`
          );
        const reservations = await response.json();

        // Enrichir chaque réservation avec ses relations
        const reservationsLitComplete: ReservationLitWithRelations[] =
          await Promise.all(
            reservations.map(async (reservation: ReservationLit) => {
              const result: ReservationLitWithRelations = { ...reservation };

              // Récupérer les informations du lit
              try {
                const litResponse = await fetch(
                  `http://localhost:3000/lits/${reservation.litId}`
                );
                if (litResponse.ok) {
                  result.lit = await litResponse.json();
                }
              } catch (err) {
                console.warn("Impossible de récupérer le lit:", err);
              }

              // Ajout des autres relations si nécessaire...

              return result;
            })
          );

        set({ reservationsLit: reservationsLitComplete, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Erreur inconnue",
          isLoading: false,
        });
      }
    },
  })
);
