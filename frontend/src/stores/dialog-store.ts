import { create } from "zustand";
import {
  ServiceFormValues,
  PatientFormValues,
  EtablissementFormValues,
  PersonnelFormValues,
  LitFormValues,
} from "@/components/userFormSchema";

interface DialogState {
  // États pour l'affichage des dialogs
  showServiceDialog: boolean;
  showPatientDialog: boolean;
  showEtablissementDialog: boolean;
  showPersonnelDialog: boolean;
  showLitDialog: boolean;

  // États des formulaires
  serviceForm: ServiceFormValues;
  patientForm: PatientFormValues;
  etablissementForm: EtablissementFormValues;
  personnelForm: PersonnelFormValues;
  litForm: LitFormValues;

  // Référence pour gérer le focus
  activeFieldRef: React.MutableRefObject<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  > | null;

  // Méthodes pour contrôler les dialogs
  setShowServiceDialog: (show: boolean) => void;
  setShowPatientDialog: (show: boolean) => void;
  setShowEtablissementDialog: (show: boolean) => void;
  setShowPersonnelDialog: (show: boolean) => void;
  setShowLitDialog: (show: boolean) => void;

  // Méthodes pour mettre à jour les formulaires
  setServiceForm: (updates: Partial<ServiceFormValues>) => void;
  updateServiceField: (field: keyof ServiceFormValues, value: any) => void;
  setPatientForm: (updates: Partial<PatientFormValues>) => void;
  updatePatientField: (field: keyof PatientFormValues, value: any) => void;
  setEtablissementForm: (updates: Partial<EtablissementFormValues>) => void;
  updateEtablissementField: (
    field: keyof EtablissementFormValues,
    value: any
  ) => void;
  setPersonnelForm: (updates: Partial<PersonnelFormValues>) => void;
  updatePersonnelField: (field: keyof PersonnelFormValues, value: any) => void;
  setLitForm: (updates: Partial<LitFormValues>) => void;
  updateLitField: (field: keyof LitFormValues, value: any) => void;

  // Méthode pour définir la référence active
  setActiveFieldRef: (
    ref: React.MutableRefObject<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
    >
  ) => void;

  // Actions pour soumettre les formulaires
  submitServiceForm: (
    callback?: (newService: ServiceFormValues) => void
  ) => Promise<void>;
  submitPatientForm: (
    callback?: (newPatient: PatientFormValues) => void
  ) => Promise<void>;
  submitEtablissementForm: (
    callback?: (newEtablissement: EtablissementFormValues) => void
  ) => Promise<void>;
  submitPersonnelForm: (
    callback?: (newPersonnel: PersonnelFormValues) => void
  ) => Promise<void>;
  submitLitForm: (callback?: (newLit: LitFormValues) => void) => Promise<void>;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  // États initiaux
  showServiceDialog: false,
  showPatientDialog: false,
  showEtablissementDialog: false,
  showPersonnelDialog: false,
  showLitDialog: false,

  serviceForm: {
    nom: "",
    description: null,
    etablissementId: "",
    etage: null,
    aile: null,
    capacite: 0,
    statut: "Actif",
    specialite: null,
    responsableId: null,
  },

  patientForm: {
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    adresse: null,
    telephone: null,
    email: null,
    numeroSecu: null,
    groupeSanguin: null,
    allergie: null,
    antecedents: null,
    dateAdmission: new Date(),
    dateSortie: null,
    statut: "Hospitalisé",
  },

  etablissementForm: {
    nom: "",
    adresse: "",
    capacite: 0,
    telephone: null,
    email: null,
    siteWeb: null,
    codePostal: null,
    ville: null,
    pays: "France",
    statut: "Actif",
    typology: null,
  },

  personnelForm: {
    nom: "",
    prenom: "",
    dateNaissance: null,
    email: null,
    telephone: null,
    profession: "",
    specialite: null,
    matricule: null,
    serviceId: null,
    dateEmbauche: null,
    statut: "Actif",
    etablissementId: null,
  },

  litForm: {
    numeroLit: "",
    type: null,
    statut: "Disponible",
    serviceId: "",
    chambre: null,
    etage: null,
    patientId: null,
  },

  activeFieldRef: null,

  // Actions pour contrôler les dialogs
  setShowServiceDialog: (show) => set({ showServiceDialog: show }),
  setShowPatientDialog: (show) => set({ showPatientDialog: show }),
  setShowEtablissementDialog: (show) => set({ showEtablissementDialog: show }),
  setShowPersonnelDialog: (show) => set({ showPersonnelDialog: show }),
  setShowLitDialog: (show) => set({ showLitDialog: show }),

  // Actions pour mettre à jour les formulaires
  setServiceForm: (updates) =>
    set((state) => ({
      serviceForm: { ...state.serviceForm, ...updates },
    })),

  updateServiceField: (field, value) =>
    set((state) => ({
      serviceForm: {
        ...state.serviceForm,
        [field]:
          field === "capacite" && typeof value === "string"
            ? parseInt(value, 10) || 0
            : value,
      },
    })),

  setPatientForm: (updates) =>
    set((state) => ({
      patientForm: { ...state.patientForm, ...updates },
    })),

  updatePatientField: (field, value) =>
    set((state) => ({
      patientForm: { ...state.patientForm, [field]: value },
    })),

  setEtablissementForm: (updates) =>
    set((state) => ({
      etablissementForm: { ...state.etablissementForm, ...updates },
    })),

  updateEtablissementField: (field, value) =>
    set((state) => ({
      etablissementForm: {
        ...state.etablissementForm,
        [field]:
          field === "capacite" && typeof value === "string"
            ? parseInt(value, 10) || 0
            : value,
      },
    })),

  setPersonnelForm: (updates) =>
    set((state) => ({
      personnelForm: { ...state.personnelForm, ...updates },
    })),

  updatePersonnelField: (field, value) =>
    set((state) => ({
      personnelForm: { ...state.personnelForm, [field]: value },
    })),

  setLitForm: (updates) =>
    set((state) => ({
      litForm: { ...state.litForm, ...updates },
    })),

  updateLitField: (field, value) =>
    set((state) => ({
      litForm: { ...state.litForm, [field]: value },
    })),

  // Méthode pour définir la référence active
  setActiveFieldRef: (ref) => set({ activeFieldRef: ref }),

  // Actions pour soumettre les formulaires
  submitServiceForm: async (callback) => {
    const { serviceForm } = get();

    try {
      // Assurons-nous que capacite est bien un nombre avant l'envoi
      const formDataToSend = {
        ...serviceForm,
        capacite:
          typeof serviceForm.capacite === "string"
            ? parseInt(serviceForm.capacite, 10)
            : serviceForm.capacite,
      };

      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du service");
      }

      const newService = await response.json();

      // Fermeture du dialog et réinitialisation du formulaire
      set({
        showServiceDialog: false,
        serviceForm: {
          nom: "",
          description: null,
          etablissementId: "",
          etage: null,
          aile: null,
          capacite: 0,
          statut: "Actif",
          specialite: null,
          responsableId: null,
        },
      });

      // Appel du callback si fourni
      if (callback) {
        callback(newService);
      }

      return newService;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  },

  submitPatientForm: async (callback) => {
    const { patientForm } = get();

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientForm),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du patient");
      }

      const newPatient = await response.json();

      // Fermeture du dialog et réinitialisation du formulaire
      set({
        showPatientDialog: false,
        patientForm: {
          nom: "",
          prenom: "",
          dateNaissance: new Date(),
          adresse: null,
          telephone: null,
          email: null,
          numeroSecu: null,
          groupeSanguin: null,
          allergie: null,
          antecedents: null,
          dateAdmission: new Date(),
          dateSortie: null,
          statut: "Hospitalisé",
        },
      });

      // Appel du callback si fourni
      if (callback) {
        callback(newPatient);
      }

      return newPatient;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  },

  submitEtablissementForm: async (callback) => {
    const { etablissementForm } = get();

    try {
      // Assurons-nous que capacite est bien un nombre avant l'envoi
      const formDataToSend = {
        ...etablissementForm,
        capacite:
          typeof etablissementForm.capacite === "string"
            ? parseInt(etablissementForm.capacite, 10)
            : etablissementForm.capacite,
      };

      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'établissement");
      }

      const newEtablissement = await response.json();

      // Fermeture du dialog et réinitialisation du formulaire
      set({
        showEtablissementDialog: false,
        etablissementForm: {
          nom: "",
          adresse: "",
          capacite: 0,
          telephone: null,
          email: null,
          siteWeb: null,
          codePostal: null,
          ville: null,
          pays: "France",
          statut: "Actif",
          typology: null,
        },
      });

      // Appel du callback si fourni
      if (callback) {
        callback(newEtablissement);
      }

      return newEtablissement;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  },

  submitPersonnelForm: async (callback) => {
    const { personnelForm } = get();

    try {
      const response = await fetch("http://localhost:3000/personnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personnelForm),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du personnel");
      }

      const newPersonnel = await response.json();

      // Fermeture du dialog et réinitialisation du formulaire
      set({
        showPersonnelDialog: false,
        personnelForm: {
          nom: "",
          prenom: "",
          dateNaissance: null,
          email: null,
          telephone: null,
          profession: "",
          specialite: null,
          matricule: null,
          serviceId: null,
          dateEmbauche: null,
          statut: "Actif",
          etablissementId: null,
        },
      });

      // Appel du callback si fourni
      if (callback) {
        callback(newPersonnel);
      }

      return newPersonnel;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  },

  submitLitForm: async (callback) => {
    const { litForm } = get();

    try {
      const response = await fetch("http://localhost:3000/lits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(litForm),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du lit");
      }

      const newLit = await response.json();

      // Fermeture du dialog et réinitialisation du formulaire
      set({
        showLitDialog: false,
        litForm: {
          numeroLit: "",
          type: null,
          statut: "Disponible",
          serviceId: "",
          chambre: null,
          etage: null,
          patientId: null,
        },
      });

      // Appel du callback si fourni
      if (callback) {
        callback(newLit);
      }

      return newLit;
    } catch (error) {
      console.error("Erreur:", error);
      throw error;
    }
  },
}));
