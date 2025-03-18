"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterielService = void 0;
const client_1 = require("@prisma/client");
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
class MaterielService {
    async getAllMateriels() {
        try {
            const materiels = await prisma.materiel.findMany();
            return { success: true, data: materiels };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des matériels:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getMaterielsByServiceId(serviceId) {
        try {
            const materiels = await prisma.materiel.findMany({
                where: { serviceId },
            });
            return { success: true, data: materiels };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des matériels par service:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createMateriel(data) {
        try {
            // Validation avec le schéma Zod
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.CreateMaterielSchema, data);
            const materiel = await prisma.materiel.create({
                data: validatedData,
            });
            return { success: true, data: materiel };
        }
        catch (error) {
            console.error("Erreur lors de la création du materiel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async updateMateriel(id, data) {
        try {
            // Vérifier si le matériel existe
            const materielExists = await prisma.materiel.findUnique({
                where: { id },
            });
            if (!materielExists) {
                return {
                    success: false,
                    error: "Matériel non trouvé",
                };
            }
            // Validation avec le schéma Zod pour la mise à jour
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.UpdateMaterielSchema, Object.assign({ id }, data));
            // Mise à jour du matériel
            const updatedMateriel = await prisma.materiel.update({
                where: { id },
                data: validatedData,
            });
            return {
                success: true,
                data: updatedMateriel,
            };
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour du matériel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getMaterielById(id) {
        try {
            const materiel = await prisma.materiel.findUnique({
                where: { id },
                include: {
                    service: true,
                },
            });
            if (!materiel) {
                return {
                    success: false,
                    error: "Matériel non trouvé",
                };
            }
            return {
                success: true,
                data: materiel,
            };
        }
        catch (error) {
            console.error("Erreur lors de la récupération du matériel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async deleteMateriel(id) {
        try {
            // Vérifier si le matériel existe
            const materielExists = await prisma.materiel.findUnique({
                where: { id },
            });
            if (!materielExists) {
                return {
                    success: false,
                    error: "Matériel non trouvé",
                };
            }
            await prisma.materiel.delete({
                where: { id },
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error("Erreur lors de la suppression du matériel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.MaterielService = MaterielService;
