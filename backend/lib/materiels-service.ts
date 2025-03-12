import { PrismaClient } from "@prisma/client";
import { Materiel } from "./schema";
import { validateData } from "../validation-utils";
import { CreateMaterielSchema } from "./schema";

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
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreateMaterielSchema, data);

      const materiel = await prisma.materiel.create({
        data: {
          nom: validatedData.nom,
          description: validatedData.description,
          quantite: validatedData.quantite,
          type: validatedData.type,
          marque: validatedData.marque,
          modele: validatedData.modele,
          numeroSerie: validatedData.numeroSerie,
          dateAchat: validatedData.dateAchat,
          dateMaintenance: validatedData.dateMaintenance,
          statut: validatedData.statut || "En Service",
          serviceId: validatedData.serviceId,
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
