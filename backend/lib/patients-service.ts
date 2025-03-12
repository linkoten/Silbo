import { PrismaClient } from "@prisma/client";
import { Patient } from "./schema";
import { validateData } from "../validation-utils";
import { CreatePatientSchema } from "./schema";

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
      // Validation avec le schéma Zod
      const validatedData = await validateData(CreatePatientSchema, data);

      const patient = await prisma.patient.create({
        data: {
          nom: validatedData.nom,
          prenom: validatedData.prenom,
          dateNaissance: validatedData.dateNaissance,
          adresse: validatedData.adresse,
          telephone: validatedData.telephone,
          email: validatedData.email,
          numeroSecu: validatedData.numeroSecu,
          groupeSanguin: validatedData.groupeSanguin,
          allergie: validatedData.allergie,
          antecedents: validatedData.antecedents,
          dateAdmission: validatedData.dateAdmission,
          dateSortie: validatedData.dateSortie,
          statut: validatedData.statut,
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
