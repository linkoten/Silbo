import { PrismaClient, Lit } from "@prisma/client";
import { validateData } from "../validation-utils";
import { LitSchema, CreateLitSchema, UpdateLitSchema } from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class LitService {
  async getAllLits(): Promise<ServiceResult<Lit[]>> {
    try {
      const lits = await prisma.lit.findMany();
      return { success: true, data: lits };
    } catch (error) {
      console.error("Erreur lors de la récupération des lits:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getLitsByServiceId(serviceId: string): Promise<ServiceResult<Lit[]>> {
    try {
      const lits = await prisma.lit.findMany({
        where: { serviceId },
      });
      return { success: true, data: lits };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des lits par service:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createLit(data: Lit): Promise<ServiceResult<Lit>> {
    try {
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreateLitSchema, data);

      const lit = await prisma.lit.create({
        data: validatedData,
      });

      return { success: true, data: lit };
    } catch (error) {
      console.error("Erreur lors de la création du lit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async updateLit(id: string, data: Partial<Lit>): Promise<ServiceResult<Lit>> {
    try {
      // Vérifier si le lit existe
      const litExists = await prisma.lit.findUnique({
        where: { id },
      });

      if (!litExists) {
        return {
          success: false,
          error: "Lit non trouvé",
        };
      }

      // Validation avec le schéma Zod pour la mise à jour
      const validatedData = await validateData(UpdateLitSchema, {
        id,
        ...data,
      });

      // Mise à jour du lit
      const updatedLit = await prisma.lit.update({
        where: { id },
        data: validatedData,
      });

      return {
        success: true,
        data: updatedLit,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du lit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getLitById(id: string): Promise<ServiceResult<Lit>> {
    try {
      const lit = await prisma.lit.findUnique({
        where: { id },
      });

      if (!lit) {
        return {
          success: false,
          error: "Lit non trouvé",
        };
      }

      return {
        success: true,
        data: lit,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du lit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async deleteLit(id: string): Promise<ServiceResult<void>> {
    try {
      // Vérifier si le lit existe
      const litExists = await prisma.lit.findUnique({
        where: { id },
      });

      if (!litExists) {
        return {
          success: false,
          error: "Lit non trouvé",
        };
      }

      // Vérifier si le lit a des réservations
      const reservationsCount = await prisma.reservationLit.count({
        where: { litId: id },
      });

      if (reservationsCount > 0) {
        return {
          success: false,
          error:
            "Impossible de supprimer le lit car il a des réservations associées",
        };
      }

      await prisma.lit.delete({
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression du lit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
