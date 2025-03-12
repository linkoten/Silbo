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
  adresse: z.string().nullable(),
  telephone: z.string().nullable(),
  email: z.string().email({ message: "Format d'email invalide" }).nullable(),
  numeroSecu: z.string().nullable(),
  groupeSanguin: z.string().nullable(),
  allergie: z.string().nullable(),
  antecedents: z.string().nullable(),
  dateAdmission: z.coerce.date().nullable(),
  dateSortie: z.coerce.date().nullable(),
  statut: z.string().nullable().default("Hospitalisé"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Lit schema
export const litFormSchema = z.object({
  id: z.string().optional(),
  numeroLit: z.string().min(1, { message: "Le numéro du lit est requis" }),
  type: z.string().nullable(),
  statut: z.string().nullable().default("Disponible"),
  serviceId: z.string().min(1, { message: "Le service est requis" }),
  chambre: z.string().nullable(),
  etage: z.string().nullable(),
  patientId: z.string().nullable(),
});
export type Lit = z.infer<typeof litFormSchema>;

// Service schema (forward declaration due to circular references)
export const serviceFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom du service est requis" }),
  description: z.string().nullable(),
  etablissementId: z.string().min(1, { message: "L'établissement est requis" }),
  etage: z.string().nullable(),
  aile: z.string().nullable(),
  capacite: z.number().int().nonnegative().default(0),
  statut: z.string().nullable().default("Actif"),
  specialite: z.string().nullable(),
  responsableId: z.string().nullable(),
});

export type Service = z.infer<typeof serviceFormSchema>;

// Personnel schema
export const personnelFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom est requis" }),
  prenom: z.string().min(1, { message: "Le prénom est requis" }),
  dateNaissance: z.coerce.date().nullable(),
  email: z.string().email({ message: "Format d'email invalide" }).nullable(),
  telephone: z.string().nullable(),
  profession: z.string().min(1, { message: "La profession est requise" }),
  specialite: z.string().nullable(),
  matricule: z.string().nullable(),
  serviceId: z.string().nullable(),
  dateEmbauche: z.coerce.date().nullable(),
  statut: z.string().nullable().default("Actif"),
  etablissementId: z.string().nullable(),
});

export type Personnel = z.infer<typeof personnelFormSchema>;

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
  motif: z.string().nullable(),
  date: z.coerce.date().default(() => new Date()),
  statut: z.string().nullable().default("Planifié"),
  autorisePar: z.string().nullable(),
  realiseePar: z.string().nullable(),
});

export type Transfert = z.infer<typeof transfertFormSchema>;

// Materiel schema
export const materielFormSchema = z.object({
  id: z.string().optional(),
  nom: z.string().min(1, { message: "Le nom du matériel est requis" }),
  description: z.string().nullable(),
  quantite: z.number().int().positive().default(1),
  type: z.string().nullable(),
  marque: z.string().nullable(),
  modele: z.string().nullable(),
  numeroSerie: z.string().nullable(),
  dateAchat: z.coerce.date().nullable(),
  dateMaintenance: z.coerce.date().nullable(),
  statut: z.string().nullable().default("En Service"),
  serviceId: z.string().nullable(),
});

export type Materiel = z.infer<typeof materielFormSchema>;

// Etablissement schema
export const etablissementFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1, { message: "Le nom de l'établissement est requis" }),
  adresse: z.string().min(1, { message: "L'adresse est requise" }),
  capacite: z.number().int().nonnegative().default(0),
  telephone: z.string().nullable(),
  email: z.string().email({ message: "Format d'email invalide" }).nullable(),
  siteWeb: z.string().url({ message: "URL invalide" }).nullable(),
  codePostal: z.string().nullable(),
  ville: z.string().nullable(),
  pays: z.string().default("France"),
  statut: z.string().nullable().default("Actif"),
  typology: z.string().nullable(),
});

export type Etablissement = z.infer<typeof etablissementFormSchema>;

// PriseEnCharge schema
export const priseEnChargeFormSchema = z.object({
  id: z.string().optional(),
  personnelId: z.string().min(1, { message: "Le personnel est requis" }),
  patientId: z.string().min(1, { message: "Le patient est requis" }),
  dateDebut: z.coerce.date().default(() => new Date()),
  dateFin: z.coerce.date().nullable(),
  description: z.string().nullable(),
  diagnostic: z.string().nullable(),
  traitement: z.string().nullable(),
  notes: z.string().nullable(),
});

export type PriseEnCharge = z.infer<typeof priseEnChargeFormSchema>;

// ReservationLit schema
export const reservationLitFormSchema = z.object({
  id: z.string().min(1).optional(),
  patientId: z.string().nullable(),
  litId: z.string().min(1).nullable(),
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  etablissementDestinationId: z.string().min(1).nullable(),
});

export type ReservationLit = z.infer<typeof reservationLitFormSchema>;

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

export type Medicament = z.infer<typeof MedicamentFormSchema>;

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

export type Document = z.infer<typeof DocumentFormSchema>;
