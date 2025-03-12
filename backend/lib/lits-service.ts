import { PrismaClient } from "@prisma/client";
import { Lit } from "./schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class LitService {
  async getAllLits(): Promise<ServiceResult<Lit[]>> {
    try {
      const lits = await prisma.lit.findMany();
      return { success: true, data: lits };
    } catch (error) {
      console.error("Erreur lors de la récupération des lits:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createLit(data: Lit): Promise<ServiceResult<Lit>> {
    try {
      // Validation basique
      if (!data.numeroLit) {
        return {
          success: false,
          error: "Un numéro doit être attribué au lit",
        };
      }

      console.log(data);

      const lit = await prisma.lit.create({
        data: {
          numeroLit: data.numeroLit,
          type: data.type,
          statut: data.statut,
          serviceId: data.serviceId,
          chambre: data.chambre,
          etage: data.etage,
          patientId: data.patientId,
        },
      });

      return { success: true, data: lit };
    } catch (error) {
      console.error("Erreur lors de la création du lit:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
