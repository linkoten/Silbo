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
