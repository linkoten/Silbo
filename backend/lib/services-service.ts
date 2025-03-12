import { PrismaClient } from "@prisma/client";
import { Service } from "./schema";
import { validateData } from "../validation-utils";
import { CreateServiceSchema } from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ServiceService {
  async getAllServices(): Promise<ServiceResult<Service[]>> {
    try {
      const services = await prisma.service.findMany();
      return { success: true, data: services };
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createService(data: Service): Promise<ServiceResult<Service>> {
    try {
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreateServiceSchema, data);

      const service = await prisma.service.create({
        data: {
          nom: validatedData.nom,
          description: validatedData.description,
          etablissementId: validatedData.etablissementId,
          etage: validatedData.etage,
          aile: validatedData.aile,
          capacite: validatedData.capacite,
          statut: validatedData.statut || "Actif",
          specialite: validatedData.specialite,
          responsableId: validatedData.responsableId,
        },
      });

      return { success: true, data: service };
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
