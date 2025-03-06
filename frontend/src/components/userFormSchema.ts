import * as z from "zod"

// Schéma de validation Zod pour les utilisateurs
export const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
})

export type UserFormValues = z.infer<typeof userFormSchema>

