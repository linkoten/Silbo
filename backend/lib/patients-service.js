"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const client_1 = require("@prisma/client");
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
class PatientService {
    async getAllPatients() {
        try {
            const patients = await prisma.patient.findMany();
            return { success: true, data: patients };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des patients:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createPatient(data) {
        try {
            // Validation avec le schéma Zod
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.CreatePatientSchema, data);
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
        }
        catch (error) {
            console.error("Erreur lors de la création du patient:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.PatientService = PatientService;
