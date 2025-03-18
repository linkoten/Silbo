import { PrismaClient, Etablissement } from "@prisma/client";
import { validateData } from "../validation-utils";
import {
  EtablissementSchema,
  UpdateEtablissementSchema,
  CreateEtablissementSchema,
} from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class EtablissementService {
  async getAllEtablissements(): Promise<ServiceResult<Etablissement[]>> {
    try {
      const etablissements = await prisma.etablissement.findMany();
      return { success: true, data: etablissements };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des établissements:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createEtablissement(
    data: Etablissement
  ): Promise<ServiceResult<Etablissement>> {
    try {
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreateEtablissementSchema, data);

      const etablissement = await prisma.etablissement.create({
        data: validatedData,
      });

      return { success: true, data: etablissement };
    } catch (error) {
      console.error("Erreur lors de la création de l'établissement:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async updateEtablissement(
    id: string,
    data: Partial<Etablissement>
  ): Promise<ServiceResult<Etablissement>> {
    try {
      // Vérifier si l'établissement existe
      const etablissementExists = await prisma.etablissement.findUnique({
        where: { id },
      });

      if (!etablissementExists) {
        return {
          success: false,
          error: "Établissement non trouvé",
        };
      }

      // Validation avec le schéma Zod pour la mise à jour
      const validatedData = await validateData(UpdateEtablissementSchema, {
        id,
        ...data,
      });

      // Mise à jour de l'établissement
      const updatedEtablissement = await prisma.etablissement.update({
        where: { id },
        data: validatedData,
      });

      return {
        success: true,
        data: updatedEtablissement,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'établissement:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getEtablissementById(
    id: string
  ): Promise<ServiceResult<Etablissement>> {
    try {
      const etablissement = await prisma.etablissement.findUnique({
        where: { id },
        include: {
          services: true,
        },
      });

      if (!etablissement) {
        return {
          success: false,
          error: "Établissement non trouvé",
        };
      }

      return {
        success: true,
        data: etablissement,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'établissement:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async deleteEtablissement(id: string): Promise<ServiceResult<void>> {
    try {
      // Vérifier si l'établissement existe
      const etablissementExists = await prisma.etablissement.findUnique({
        where: { id },
      });

      if (!etablissementExists) {
        return {
          success: false,
          error: "Établissement non trouvé",
        };
      }

      // Vérifier si l'établissement a des services associés
      const servicesCount = await prisma.service.count({
        where: { etablissementId: id },
      });

      if (servicesCount > 0) {
        return {
          success: false,
          error:
            "Impossible de supprimer l'établissement car il contient des services",
        };
      }

      await prisma.etablissement.delete({
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'établissement:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
