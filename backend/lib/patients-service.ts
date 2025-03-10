import { PrismaClient } from "@prisma/client";
import { Patient } from "../schema";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class PatientService {
  async getAllPatients(): Promise<ServiceResult<Patient[]>> {
    try {
      const patients = await prisma.patient.findMany();
      return { success: true, data: patients };
    } catch (error) {
      console.error("Erreur lors de la récupération des patients:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createPatient(data: Patient): Promise<ServiceResult<Patient>> {
    try {
      // Validation basique
      if (!data.nom || !data.prenom) {
        return {
          success: false,
          error: "Le nom et le prénom sont requis",
        };
      }

      console.log(data);

      const patient = await prisma.patient.create({
        data: {
          nom: data.nom,
          prenom: data.prenom,
          dateNaissance: data.dateNaissance,
          numeroSecu: data.numeroSecu,
          dossierMedical: data.dossierMedical,
        },
      });

      return { success: true, data: patient };
    } catch (error) {
      console.error("Erreur lors de la création du patient:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
