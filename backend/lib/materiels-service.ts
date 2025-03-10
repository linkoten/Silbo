import { PrismaClient } from "@prisma/client";
import { Materiel } from "../schema";

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
      console.error("Erreur lors de la récupération des materiels:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createMateriel(data: Materiel): Promise<ServiceResult<Materiel>> {
    try {
      // Validation basique
      if (!data.nom) {
        return {
          success: false,
          error: "Un numéro doit être attribué au materiel",
        };
      }

      console.log(data);

      const materiel = await prisma.materiel.create({
        data: {
          nom: data.nom,
          description: data.description,
          quantite: data.quantite,
          serviceId: data.serviceId,
        },
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
}
