import { z } from "zod";

// Base ObjectId schema
const objectId = z.string().min(1);

// User schema
export const userSchema = z.object({
  id: objectId.optional(), // Optional for creation
  email: z.string().email(),
  name: z.string().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

// Patient schema
export const patientSchema = z.object({
  id: objectId.optional(),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  dateNaissance: z.coerce.date(), // Utilisation de coerce.date()
  numeroSecu: z.string().min(1),
  dossierMedical: z.string().nullable().optional(),
});

export type Patient = z.infer<typeof patientSchema>;

// Service schema (forward declaration due to circular references)
export const serviceSchema = z.object({
  id: objectId.optional(),
  nom: z.string().min(1),
  etablissementId: objectId,
});

export type Service = z.infer<typeof serviceSchema>;

// Personnel schema
export const personnelSchema = z.object({
  id: objectId.optional(),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  profession: z.string().min(1),
  serviceId: objectId,
});

export type Personnel = z.infer<typeof personnelSchema>;

// Materiel schema
export const materielSchema = z.object({
  id: objectId.optional(),
  nom: z.string().min(1),
  description: z.string().nullable().optional(),
  quantite: z.number().int().min(0),
  serviceId: objectId,
});

export type Materiel = z.infer<typeof materielSchema>;

// Lit schema
export const litSchema = z.object({
  id: objectId.optional(),
  numeroLit: z.string().min(1),
  serviceId: objectId,
});

export type Lit = z.infer<typeof litSchema>;

// Etablissement schema
export const etablissementSchema = z.object({
  id: objectId.optional(),
  nom: z.string().min(1),
  adresse: z.string().nullable().optional(),
});

export type Etablissement = z.infer<typeof etablissementSchema>;

// PriseEnCharge schema
export const priseEnChargeSchema = z.object({
  id: objectId.optional(),
  patientId: objectId,
  personnelId: objectId,
  datePriseEnCharge: z.coerce.date(),
});

export type PriseEnCharge = z.infer<typeof priseEnChargeSchema>;

// Transfert schema
export const transfertSchema = z.object({
  id: objectId.optional(),
  patientId: objectId,
  serviceDepartId: objectId,
  serviceArriveeId: objectId,
  dateTransfert: z.coerce.date(),
  etablissementDepartId: objectId.nullable().optional(),
  etablissementArriveeId: objectId.nullable().optional(),
});

export type Transfert = z.infer<typeof transfertSchema>;

// ReservationLit schema
export const reservationLitSchema = z.object({
  id: objectId.optional(),
  patientId: objectId,
  litId: objectId,
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  etablissementDestinationId: objectId.nullable().optional(),
});

export type ReservationLit = z.infer<typeof reservationLitSchema>;

// Form schemas (for creating/updating)
export const createPatientSchema = patientSchema.omit({ id: true });
export const updatePatientSchema = patientSchema
  .partial()
  .required({ id: true });

export const createPersonnelSchema = personnelSchema.omit({ id: true });
export const updatePersonnelSchema = personnelSchema
  .partial()
  .required({ id: true });

export const createServiceSchema = serviceSchema.omit({ id: true });
export const updateServiceSchema = serviceSchema
  .partial()
  .required({ id: true });

export const createMaterielSchema = materielSchema.omit({ id: true });
export const updateMaterielSchema = materielSchema
  .partial()
  .required({ id: true });

export const createLitSchema = litSchema.omit({ id: true });
export const updateLitSchema = litSchema.partial().required({ id: true });

export const createEtablissementSchema = etablissementSchema.omit({ id: true });
export const updateEtablissementSchema = etablissementSchema
  .partial()
  .required({ id: true });

export const createPriseEnChargeSchema = priseEnChargeSchema.omit({ id: true });
export const updatePriseEnChargeSchema = priseEnChargeSchema
  .partial()
  .required({ id: true });

export const createTransfertSchema = transfertSchema.omit({ id: true });
export const updateTransfertSchema = transfertSchema
  .partial()
  .required({ id: true });

export const createReservationLitSchema = reservationLitSchema.omit({
  id: true,
});
export const updateReservationLitSchema = reservationLitSchema
  .partial()
  .required({ id: true });
