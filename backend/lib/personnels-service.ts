import { PrismaClient } from "@prisma/client";
import { Personnel } from "../schema";

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

  async createPersonnel(data: Personnel): Promise<ServiceResult<Personnel>> {
    try {
      // Validation basique
      if (!data.nom) {
        return {
          success: false,
          error: "Un nom doit être indiqué",
        };
      }

      console.log(data);

      const personnel = await prisma.personnel.create({
        data: {
          nom: data.nom,
          prenom: data.prenom,
          profession: data.profession,
          serviceId: data.serviceId,
        },
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
}
