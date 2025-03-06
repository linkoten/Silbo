import { PrismaClient, User } from "@prisma/client";
import { createUserSchema } from "./schema";

const prisma = new PrismaClient();

type CreateUserInput = Omit<User, "id">;

export class UserService {
  // Créer un utilisateur avec validation
  async createUser(data: CreateUserInput) {
    // Valider les données avec Zod
    const result = createUserSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: result.error.format(),
      };
    }

    const validatedData = result.data;

    try {
      const user = await prisma.user.create({
        data: validatedData,
      });
      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }
  }

  // Récupérer tous les utilisateurs
  async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return {
        success: true,
        data: users,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }
  }
}
