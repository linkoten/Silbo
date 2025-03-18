"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtablissementService = void 0;
const client_1 = require("@prisma/client");
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
class EtablissementService {
    async getAllEtablissements() {
        try {
            const etablissements = await prisma.etablissement.findMany();
            return { success: true, data: etablissements };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des établissements:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createEtablissement(data) {
        try {
            // Validation avec le schéma Zod
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.CreateEtablissementSchema, data);
            const etablissement = await prisma.etablissement.create({
                data: validatedData,
            });
            return { success: true, data: etablissement };
        }
        catch (error) {
            console.error("Erreur lors de la création de l'établissement:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async updateEtablissement(id, data) {
        try {
            // Vérifier si l'établissement existe
            const etablissementExists = await prisma.etablissement.findUnique({
                where: { id },
            });
            if (!etablissementExists) {
                return {
                    success: false,
                    error: "Établissement non trouvé",
                };
            }
            // Validation avec le schéma Zod pour la mise à jour
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.UpdateEtablissementSchema, Object.assign({ id }, data));
            // Mise à jour de l'établissement
            const updatedEtablissement = await prisma.etablissement.update({
                where: { id },
                data: validatedData,
            });
            return {
                success: true,
                data: updatedEtablissement,
            };
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'établissement:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getEtablissementById(id) {
        try {
            const etablissement = await prisma.etablissement.findUnique({
                where: { id },
                include: {
                    services: true,
                },
            });
            if (!etablissement) {
                return {
                    success: false,
                    error: "Établissement non trouvé",
                };
            }
            return {
                success: true,
                data: etablissement,
            };
        }
        catch (error) {
            console.error("Erreur lors de la récupération de l'établissement:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async deleteEtablissement(id) {
        try {
            // Vérifier si l'établissement existe
            const etablissementExists = await prisma.etablissement.findUnique({
                where: { id },
            });
            if (!etablissementExists) {
                return {
                    success: false,
                    error: "Établissement non trouvé",
                };
            }
            // Vérifier si l'établissement a des services associés
            const servicesCount = await prisma.service.count({
                where: { etablissementId: id },
            });
            if (servicesCount > 0) {
                return {
                    success: false,
                    error: "Impossible de supprimer l'établissement car il contient des services",
                };
            }
            await prisma.etablissement.delete({
                where: { id },
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error("Erreur lors de la suppression de l'établissement:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.EtablissementService = EtablissementService;
