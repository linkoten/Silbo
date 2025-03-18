import { PrismaClient, Materiel } from "@prisma/client";
import { validateData } from "../validation-utils";
import {
  MaterielSchema,
  CreateMaterielSchema,
  UpdateMaterielSchema,
} from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class MaterielService {
  async getAllMateriels(): Promise<ServiceResult<Materiel[]>> {
    try {
      const materiels = await prisma.materiel.findMany();
      return { success: true, data: materiels };
    } catch (error) {
      console.error("Erreur lors de la récupération des matériels:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getMaterielsByServiceId(
    serviceId: string
  ): Promise<ServiceResult<Materiel[]>> {
    try {
      const materiels = await prisma.materiel.findMany({
        where: { serviceId },
      });
      return { success: true, data: materiels };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des matériels par service:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createMateriel(data: Materiel): Promise<ServiceResult<Materiel>> {
    try {
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreateMaterielSchema, data);

      const materiel = await prisma.materiel.create({
        data: validatedData,
      });

      return { success: true, data: materiel };
    } catch (error) {
      console.error("Erreur lors de la création du materiel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async updateMateriel(
    id: string,
    data: Partial<Materiel>
  ): Promise<ServiceResult<Materiel>> {
    try {
      // Vérifier si le matériel existe
      const materielExists = await prisma.materiel.findUnique({
        where: { id },
      });

      if (!materielExists) {
        return {
          success: false,
          error: "Matériel non trouvé",
        };
      }

      // Validation avec le schéma Zod pour la mise à jour
      const validatedData = await validateData(UpdateMaterielSchema, {
        id,
        ...data,
      });

      // Mise à jour du matériel
      const updatedMateriel = await prisma.materiel.update({
        where: { id },
        data: validatedData,
      });

      return {
        success: true,
        data: updatedMateriel,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du matériel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getMaterielById(id: string): Promise<ServiceResult<Materiel>> {
    try {
      const materiel = await prisma.materiel.findUnique({
        where: { id },
        include: {
          service: true,
        },
      });

      if (!materiel) {
        return {
          success: false,
          error: "Matériel non trouvé",
        };
      }

      return {
        success: true,
        data: materiel,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du matériel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async deleteMateriel(id: string): Promise<ServiceResult<void>> {
    try {
      // Vérifier si le matériel existe
      const materielExists = await prisma.materiel.findUnique({
        where: { id },
      });

      if (!materielExists) {
        return {
          success: false,
          error: "Matériel non trouvé",
        };
      }

      await prisma.materiel.delete({
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression du matériel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
