import { create } from "zustand";
import { Patient } from "@/types/types";

interface PatientState {
  // État
  patients: Patient[];
  patientSelectionne: Patient | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchPatients: () => Promise<void>;
  fetchPatientDetails: (id: string) => Promise<void>;
  createPatient: (patient: Omit<Patient, "id">) => Promise<void>;
  updatePatient: (id: string, patientData: Partial<Patient>) => Promise<void>;
  deletePatient: (id: string) => Promise<boolean>;
  searchPatients: (searchTerm: string) => Promise<void>;
}

export const usePatientStore = create<PatientState>((set, get) => ({
  // État initial
  patients: [],
  patientSelectionne: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/patients");
      if (!response.ok)
        throw new Error(
          `Erreur lors de la récupération des patients (${response.status})`
        );
      const patients = await response.json();
      set({ patients, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  fetchPatientDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`);
      if (!response.ok)
        throw new Error(`Patient non trouvé (${response.status})`);
      const patient = await response.json();

      set({ patientSelectionne: patient, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  createPatient: async (patient: Omit<Patient, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patient),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la création du patient (${response.status})`
        );

      await get().fetchPatients();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  updatePatient: async (id: string, patientData: Partial<Patient>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la mise à jour du patient (${response.status})`
        );

      if (get().patientSelectionne?.id === id) {
        await get().fetchPatientDetails(id);
      }
      await get().fetchPatients();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },

  deletePatient: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:3000/patients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(
          `Erreur lors de la suppression du patient (${response.status})`
        );

      await get().fetchPatients();

      if (get().patientSelectionne?.id === id) {
        set({ patientSelectionne: null });
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

  searchPatients: async (searchTerm: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `http://localhost:3000/patients?q=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok)
        throw new Error(
          `Erreur lors de la recherche des patients (${response.status})`
        );
      const patients = await response.json();
      set({ patients, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
      });
    }
  },
}));
