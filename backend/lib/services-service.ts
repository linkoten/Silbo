import { PrismaClient, Service } from "@prisma/client";
import { validateData } from "../validation-utils";
import { CreateServiceSchema, UpdateServiceSchema } from "./schema";

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

  async getServicesByEtablissementId(
    etablissementId: string
  ): Promise<ServiceResult<Service[]>> {
    try {
      const services = await prisma.service.findMany({
        where: { etablissementId },
      });
      return { success: true, data: services };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des services par établissement:",
        error
      );
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

  async updateService(
    id: string,
    data: Partial<Service>
  ): Promise<ServiceResult<Service>> {
    try {
      // Vérifier si le service existe
      const serviceExists = await prisma.service.findUnique({
        where: { id },
      });

      if (!serviceExists) {
        return {
          success: false,
          error: "Service non trouvé",
        };
      }

      // Validation avec le schéma Zod pour la mise à jour
      const validatedData = await validateData(UpdateServiceSchema, {
        id,
        ...data,
      });

      // Mise à jour du service
      const updatedService = await prisma.service.update({
        where: { id },
        data: validatedData,
      });

      return {
        success: true,
        data: updatedService,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async getServiceById(id: string): Promise<ServiceResult<Service>> {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          etablissement: true,
          lits: true,
          personnels: true,
        },
      });

      if (!service) {
        return {
          success: false,
          error: "Service non trouvé",
        };
      }

      return {
        success: true,
        data: service,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération du service:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async deleteService(id: string): Promise<ServiceResult<void>> {
    try {
      // Vérifier si le service existe
      const serviceExists = await prisma.service.findUnique({
        where: { id },
      });

      if (!serviceExists) {
        return {
          success: false,
          error: "Service non trouvé",
        };
      }

      // Vérifier si le service a des lits ou des personnels associés
      const litsCount = await prisma.lit.count({
        where: { serviceId: id },
      });

      if (litsCount > 0) {
        return {
          success: false,
          error: "Impossible de supprimer le service car il contient des lits",
        };
      }

      const personnelsCount = await prisma.personnel.count({
        where: { serviceId: id },
      });

      if (personnelsCount > 0) {
        return {
          success: false,
          error:
            "Impossible de supprimer le service car il a des personnels associés",
        };
      }

      await prisma.service.delete({
        where: { id },
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression du service:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
