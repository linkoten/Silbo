import { PriseEnCharge, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PriseEnChargeService {
  async getAllPrisesEnCharge(): Promise<ServiceResult<PriseEnCharge[]>> {
    try {
      const prisesEnCharge = await prisma.priseEnCharge.findMany();
      return { success: true, data: prisesEnCharge };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des prisesEnCharge:",
        error
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createPriseEnCharge(
    data: PriseEnCharge
  ): Promise<ServiceResult<PriseEnCharge>> {
    try {
      // Validation basique
      if (!data.id) {
        return {
          success: false,
          error: "Un id doit être attribué à la priseEnCharge",
        };
      }

      console.log(data);

      const priseEnCharge = await prisma.priseEnCharge.create({
        data: {
          personnelId: data.personnelId,
          patientId: data.patientId,
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
          description: data.description,
          diagnostic: data.diagnostic,
          traitement: data.traitement,
          notes: data.notes,
        },
      });

      return { success: true, data: priseEnCharge };
    } catch (error) {
      console.error("Erreur lors de la création du priseEnCharge:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
