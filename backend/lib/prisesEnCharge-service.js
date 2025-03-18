"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriseEnChargeService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PriseEnChargeService {
    async getAllPrisesEnCharge() {
        try {
            const prisesEnCharge = await prisma.priseEnCharge.findMany();
            return { success: true, data: prisesEnCharge };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des prisesEnCharge:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getPriseEnChargeById(id) {
        try {
            const priseEnCharge = await prisma.priseEnCharge.findUnique({
                where: { id },
                include: {
                    patient: true,
                    personnel: true,
                },
            });
            if (!priseEnCharge) {
                return {
                    success: false,
                    error: "Prise en charge non trouvée",
                };
            }
            return {
                success: true,
                data: priseEnCharge,
            };
        }
        catch (error) {
            console.error("Erreur lors de la récupération de la prise en charge:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getPrisesEnChargeByPatientId(patientId) {
        try {
            const prisesEnCharge = await prisma.priseEnCharge.findMany({
                where: { patientId },
                include: {
                    personnel: true,
                },
            });
            return { success: true, data: prisesEnCharge };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des prises en charge du patient:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getPrisesEnChargeByPersonnelId(personnelId) {
        try {
            const prisesEnCharge = await prisma.priseEnCharge.findMany({
                where: { personnelId },
                include: {
                    patient: true,
                },
            });
            return { success: true, data: prisesEnCharge };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des prises en charge du personnel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createPriseEnCharge(data) {
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
        }
        catch (error) {
            console.error("Erreur lors de la création du priseEnCharge:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async updatePriseEnCharge(id, data) {
        try {
            // Vérifier si la prise en charge existe
            const priseEnChargeExists = await prisma.priseEnCharge.findUnique({
                where: { id },
            });
            if (!priseEnChargeExists) {
                return {
                    success: false,
                    error: "Prise en charge non trouvée",
                };
            }
            // Mise à jour de la prise en charge
            const updatedPriseEnCharge = await prisma.priseEnCharge.update({
                where: { id },
                data,
            });
            return {
                success: true,
                data: updatedPriseEnCharge,
            };
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de la prise en charge:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async deletePriseEnCharge(id) {
        try {
            // Vérifier si la prise en charge existe
            const priseEnChargeExists = await prisma.priseEnCharge.findUnique({
                where: { id },
            });
            if (!priseEnChargeExists) {
                return {
                    success: false,
                    error: "Prise en charge non trouvée",
                };
            }
            await prisma.priseEnCharge.delete({
                where: { id },
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error("Erreur lors de la suppression de la prise en charge:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.PriseEnChargeService = PriseEnChargeService;
