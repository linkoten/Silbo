"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const client_1 = require("@prisma/client");
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
