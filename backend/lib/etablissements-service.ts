import { PrismaClient } from "@prisma/client";
import { Etablissement } from "../schema";

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
        "Erreur lors de la récupération des etablissements:",
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
      // Validation basique
      if (!data.nom) {
        return {
          success: false,
          error: "Un numéro doit être attribué au etablissement",
        };
      }

      console.log(data);

      const etablissement = await prisma.etablissement.create({
        data: {
          nom: data.nom,
          adresse: data.adresse,
        },
      });

      return { success: true, data: etablissement };
    } catch (error) {
      console.error("Erreur lors de la création du etablissement:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
