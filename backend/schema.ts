import { z } from "zod";

// Schéma de validation pour la création d'utilisateur
export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "L'email doit être valide" }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
