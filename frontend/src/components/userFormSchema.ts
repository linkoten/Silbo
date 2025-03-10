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
  nom: z.string().min(1),
  prenom: z.string().min(1),
  dateNaissance: z.date(),
  numeroSecu: z
    .string()
    .min(15, {
      message: "Le numéro de sécurité sociale doit comporter 15 chiffres.",
    })
    .max(15, {
      message: "Le numéro de sécurité sociale doit comporter 15 chiffres.",
    }),
  dossierMedical: z.string().nullable().optional(),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

// Lit schema
export const litFormSchema = z.object({
  id: z.string().min(1).optional(),
  numeroLit: z.string().min(1),
  serviceId: z.string().min(1),
});
export type Lit = z.infer<typeof litFormSchema>;

// Service schema (forward declaration due to circular references)
export const serviceFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1),
  etablissementId: z.string().min(1),
});

export type Service = z.infer<typeof serviceFormSchema>;

// Personnel schema
export const personnelFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1),
  prenom: z.string().min(1),
  profession: z.string().min(1),
  serviceId: z.string().min(1),
});

export type Personnel = z.infer<typeof personnelFormSchema>;

// Transfert schema
export const transfertFormSchema = z.object({
  id: z.string().min(1).optional(),
  patientId: z.string().min(1),
  serviceDepartId: z.string().min(1),
  serviceArriveeId: z.string().min(1),
  dateTransfert: z.date(),
  etablissementDepartId: z.string().min(1).optional(),
  etablissementArriveeId: z.string().min(1).optional(),
});

export type Transfert = z.infer<typeof transfertFormSchema>;

// Materiel schema
export const materielFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1),
  description: z.string().optional(),
  quantite: z.number().int().min(0),
  serviceId: z.string().min(1),
});

export type Materiel = z.infer<typeof materielFormSchema>;

// Etablissement schema
export const etablissementFormSchema = z.object({
  id: z.string().min(1).optional(),
  nom: z.string().min(1),
  adresse: z.string().optional(),
});

export type Etablissement = z.infer<typeof etablissementFormSchema>;

// PriseEnCharge schema
export const priseEnChargeFormSchema = z.object({
  id: z.string().min(1).optional(),
  patientId: z.string().min(1),
  personnelId: z.string().min(1),
  datePriseEnCharge: z.coerce.date(),
});

export type PriseEnCharge = z.infer<typeof priseEnChargeFormSchema>;

// ReservationLit schema
export const reservationLitFormSchema = z.object({
  id: z.string().min(1).optional(),
  patientId: z.string().min(1),
  litId: z.string().min(1),
  dateArrivee: z.coerce.date(),
  dateDepart: z.coerce.date(),
  etablissementDestinationId: z.string().min(1).optional(),
});

export type ReservationLit = z.infer<typeof reservationLitFormSchema>;
