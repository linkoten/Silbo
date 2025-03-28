import * as z from "zod";

// Schéma de validation Zod pour les utilisateurs
export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const patientFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  dateNaissance: z.coerce.date(),
  adresse: z.string(),
  telephone: z.string(),
  email: z.string().email({ message: "Format d'email invalide" }),
  numeroSecu: z.string(),
  groupeSanguin: z.string(),
  allergie: z.string(),
  antecedents: z.string(),
  dateAdmission: z.coerce.date(),
  dateSortie: z.coerce.date(),
  statut: z.string(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Lit schema
export const litFormSchema = z.object({
  id: z.string().optional(),
  numeroLit: z.string().min(1, { message: "Le numéro du lit est requis" }),
  type: z.string(),
  statut: z.string(),
  serviceId: z.string().min(1, { message: "Le service est requis" }),
  chambre: z.string(),
  etage: z.string(),
  patientId: z.string(),
});
export type LitFormValues = z.infer<typeof litFormSchema>;

// Service schema (forward declaration due to circular references)
export const serviceFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom du service est requis" }),
  description: z.string(),
  etablissementId: z.string().min(1, { message: "L'établissement est requis" }),
  etage: z.string(),
  aile: z.string(),
  capacite: z.number().int().nonnegative(),
  statut: z.string(),
  specialite: z.string(),
  responsableId: z.string(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

// Personnel schema
export const personnelFormSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  dateNaissance: z.coerce.date(),
  email: z.string().email({ message: "Format d'email invalide" }),
  telephone: z.string(),
  profession: z.string().min(1, { message: "La profession est requise" }),
  specialite: z.string(),
  matricule: z.string(),
  serviceId: z.string(),
  dateEmbauche: z.coerce.date(),
  statut: z.string(),
  etablissementId: z.string(),
});

export type PersonnelFormValues = z.infer<typeof personnelFormSchema>;

// Transfert schema
export const transfertFormSchema = z.object({
  id: z.string().optional(),
  serviceDepartId: z
    .string()
    .min(1, { message: "Le service de départ est requis" }),
  serviceArriveeId: z
    .string()
    .min(1, { message: "Le service d'arrivée est requis" }),
  patientId: z.string().min(1, { message: "Le patient est requis" }),
  motif: z.string(),
  date: z.coerce.date(),
  statut: z.string(),
  autorisePar: z.string(),
  realiseePar: z.string(),
  etablissementDepartId: z.string(),
  etablissementArriveeId: z.string(),
});

export type TransfertFormValues = z.infer<typeof transfertFormSchema>;

// Materiel schema
export const materielFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom du matériel est requis" }),
  description: z.string(),
  quantite: z.number().int().positive(),
  type: z.string(),
  marque: z.string(),
  modele: z.string(),
  numeroSerie: z.string(),
  dateAchat: z.coerce.date(),
  dateMaintenance: z.coerce.date(),
  statut: z.string(),
  serviceId: z.string(),
});

export type MaterielFormValues = z.infer<typeof materielFormSchema>;

// Etablissement schema
export const etablissementFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1, { message: "Le nom de l'établissement est requis" }),
  adresse: z.string().min(1, { message: "L'adresse est requise" }),
  capacite: z.number().int().nonnegative(),
  telephone: z.string(),
  email: z.string().email({ message: "Format d'email invalide" }),
  siteWeb: z.string().url({ message: "URL invalide" }),
  codePostal: z.string(),
  ville: z.string(),
  pays: z.string(),
  statut: z.string(),
  typology: z.string(),
});

export type EtablissementFormValues = z.infer<typeof etablissementFormSchema>;

// PriseEnCharge schema
export const priseEnChargeFormSchema = z.object({
  id: z.string().optional(),
  personnelId: z.string().min(1, { message: "Le personnel est requis" }),
  patientId: z.string().min(1, { message: "Le patient est requis" }),
  dateDebut: z.coerce.date(),
  dateFin: z.coerce.date(),
  description: z.string(),
  diagnostic: z.string(),
  traitement: z.string(),
  notes: z.string(),
});

export type PriseEnChargeFormValues = z.infer<typeof priseEnChargeFormSchema>;

// ReservationLit schema
export const reservationLitFormSchema = z.object({
  id: z.string().min(1).optional(),
  patientId: z.string(),
  litId: z.string().min(1),
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  etablissementDestinationId: z.string().min(1),
});

export type ReservationLitFormValues = z.infer<typeof reservationLitFormSchema>;

// Schéma pour Medicament
export const MedicamentFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom du médicament est requis" }),
  dosage: z.string().nullable(),
  description: z.string().nullable(),
  categorie: z.string().nullable(),
  fabricant: z.string().nullable(),
  stockActuel: z.number().int().nonnegative().default(0),
  stockMinimum: z.number().int().nonnegative().default(5),
  datePeremption: z.coerce.date().nullable(),
});

export type MedicamentFormValues = z.infer<typeof MedicamentFormSchema>;

// Schéma pour Document
export const DocumentFormSchema = z.object({
  id: z.string().optional(),
  titre: z.string().min(1, { message: "Le titre est requis" }),
  typeDocument: z
    .string()
    .min(1, { message: "Le type de document est requis" }),
  contenu: z.string().nullable(),
  url: z.string().nullable(),
  patientId: z.string().nullable(),
  personnelId: z.string().nullable(),
  serviceId: z.string().nullable(),
});

export type DocumentFormValues = z.infer<typeof DocumentFormSchema>;
