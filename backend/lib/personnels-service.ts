import { PrismaClient, Personnel } from "@prisma/client";
import { validateData } from "../validation-utils";
import {
  PersonnelSchema,
  CreatePersonnelSchema,
  UpdatePersonnelSchema,
} from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PersonnelService {
  async getAllPersonnels(): Promise<ServiceResult<Personnel[]>> {
    try {
      const personnels = await prisma.personnel.findMany();
      return { success: true, data: personnels };
    } catch (error) {
      console.error("Erreur lors de la récupération des personnels:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getPersonnelsByEtablissementId(
    etablissementId: string
  ): Promise<ServiceResult<Personnel[]>> {
    try {
      const personnels = await prisma.personnel.findMany({
        where: { etablissementId },
      });
      return { success: true, data: personnels };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des personnels par établissement:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getPersonnelsByServiceId(
    serviceId: string
  ): Promise<ServiceResult<Personnel[]>> {
    try {
      const personnels = await prisma.personnel.findMany({
        where: { serviceId },
      });
      return { success: true, data: personnels };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des personnels par service:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createPersonnel(data: Personnel): Promise<ServiceResult<Personnel>> {
    try {
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreatePersonnelSchema, data);

      const personnel = await prisma.personnel.create({
        data: validatedData,
      });

      return { success: true, data: personnel };
    } catch (error) {
      console.error("Erreur lors de la création du personnel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async updatePersonnel(
    id: string,
    data: Partial<Personnel>
  ): Promise<ServiceResult<Personnel>> {
    try {
      // Vérifier si le personnel existe
      const personnelExists = await prisma.personnel.findUnique({
        where: { id },
      });

      if (!personnelExists) {
        return {
          success: false,
          error: "Personnel non trouvé",
        };
      }

      // Validation avec le schéma Zod pour la mise à jour
      const validatedData = await validateData(UpdatePersonnelSchema, {
        id,
        ...data,
      });

      // Mise à jour du personnel
      const updatedPersonnel = await prisma.personnel.update({
        where: { id },
        data: validatedData,
      });

      return {
        success: true,
        data: updatedPersonnel,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du personnel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getPersonnelById(id: string): Promise<ServiceResult<Personnel>> {
    try {
      const personnel = await prisma.personnel.findUnique({
        where: { id },
      });

      if (!personnel) {
        return {
          success: false,
          error: "Personnel non trouvé",
        };
      }

      return {
        success: true,
        data: personnel,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du personnel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async deletePersonnel(id: string): Promise<ServiceResult<void>> {
    try {
      // Vérifier si le personnel existe
      const personnelExists = await prisma.personnel.findUnique({
        where: { id },
      });

      if (!personnelExists) {
        return {
          success: false,
          error: "Personnel non trouvé",
        };
      }

      // Vérifier si le personnel a des prises en charge
      const prisesEnChargeCount = await prisma.priseEnCharge.count({
        where: { personnelId: id },
      });

      if (prisesEnChargeCount > 0) {
        return {
          success: false,
          error:
            "Impossible de supprimer le personnel car il a des prises en charge associées",
        };
      }

      await prisma.personnel.delete({
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression du personnel:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
