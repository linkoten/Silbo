import { PrismaClient } from "@prisma/client";
import { Service } from "../schema";

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
      // Validation basique
      if (!data.nom) {
        return {
          success: false,
          error: "Un nom doit être attribué au service",
        };
      }

      console.log(data);

      const service = await prisma.service.create({
        data: {
          nom: data.nom,
          etablissementId: data.etablissementId,
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
