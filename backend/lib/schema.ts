import { z } from "zod";

// Schéma pour User
export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email({ message: "Format d'email invalide" }),
  name: z.string().nullable(),
});

// Schéma pour Patient
export const PatientSchema = z.object({
  id: z.string().optional(),
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

export type Patient = z.infer<typeof PatientSchema>;

// Schéma pour Personnel
export const PersonnelSchema = z.object({
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
});

export type Personnel = z.infer<typeof PersonnelSchema>;

// Schéma pour Service
export const ServiceSchema = z.object({
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

export type Service = z.infer<typeof ServiceSchema>;

// Schéma pour Transfert
export const TransfertSchema = z.object({
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

export type Transfert = z.infer<typeof TransfertSchema>;

// Schéma pour Materiel
export const MaterielSchema = z.object({
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

export type Materiel = z.infer<typeof MaterielSchema>;

// Schéma pour PriseEnCharge
export const PriseEnChargeSchema = z.object({
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

export type PriseEnCharge = z.infer<typeof PriseEnChargeSchema>;

// Schéma pour Lit
export const LitSchema = z.object({
  id: z.string().optional(),
  numeroLit: z.string().min(1, { message: "Le numéro du lit est requis" }),
  type: z.string().nullable(),
  statut: z.string().nullable().default("Disponible"),
  serviceId: z.string().min(1, { message: "Le service est requis" }),
  chambre: z.string().nullable(),
  etage: z.string().nullable(),
  patientId: z.string().nullable(),
});

export type Lit = z.infer<typeof LitSchema>;

// Schéma pour ReservationLit
export const ReservationLitSchema = z.object({
  id: z.string().optional(),
  patientId: z.string().min(1, { message: "Le patient est requis" }),
  litId: z.string().min(1, { message: "Le lit est requis" }),
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  etablissementDestinationId: z.string().nullable(),
});

export type ReservationLit = z.infer<typeof ReservationLitSchema>;

// Schéma pour Etablissement
export const EtablissementSchema = z.object({
  id: z.string().optional(),
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

export type Etablissement = z.infer<typeof EtablissementSchema>;

// Schéma pour Medicament
export const MedicamentSchema = z.object({
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

export type Medicament = z.infer<typeof MedicamentSchema>;

// Schéma pour Document
export const DocumentSchema = z.object({
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

export type Document = z.infer<typeof DocumentSchema>;

// Schémas pour les créations (sans id obligatoire)
export const CreateUserSchema = UserSchema.omit({ id: true });
export const CreatePatientSchema = PatientSchema.omit({ id: true });
export const CreatePersonnelSchema = PersonnelSchema.omit({ id: true });
export const CreateServiceSchema = ServiceSchema.omit({ id: true });
export const CreateTransfertSchema = TransfertSchema.omit({ id: true });
export const CreateMaterielSchema = MaterielSchema.omit({ id: true });
export const CreatePriseEnChargeSchema = PriseEnChargeSchema.omit({ id: true });
export const CreateLitSchema = LitSchema.omit({ id: true });
export const CreateReservationLitSchema = ReservationLitSchema.omit({
  id: true,
});
export const CreateEtablissementSchema = EtablissementSchema.omit({ id: true });
export const CreateMedicamentSchema = MedicamentSchema.omit({ id: true });
export const CreateDocumentSchema = DocumentSchema.omit({ id: true });

// Schémas pour les mises à jour (tout optionnel sauf id)
export const UpdateUserSchema = UserSchema.partial().required({ id: true });
export const UpdatePatientSchema = PatientSchema.partial().required({
  id: true,
});
export const UpdatePersonnelSchema = PersonnelSchema.partial().required({
  id: true,
});
export const UpdateServiceSchema = ServiceSchema.partial().required({
  id: true,
});
export const UpdateTransfertSchema = TransfertSchema.partial().required({
  id: true,
});
export const UpdateMaterielSchema = MaterielSchema.partial().required({
  id: true,
});
export const UpdatePriseEnChargeSchema = PriseEnChargeSchema.partial().required(
  { id: true }
);
export const UpdateLitSchema = LitSchema.partial().required({ id: true });
export const UpdateReservationLitSchema =
  ReservationLitSchema.partial().required({ id: true });
export const UpdateEtablissementSchema = EtablissementSchema.partial().required(
  { id: true }
);
export const UpdateMedicamentSchema = MedicamentSchema.partial().required({
  id: true,
});
export const UpdateDocumentSchema = DocumentSchema.partial().required({
  id: true,
});
