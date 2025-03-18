"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitService = void 0;
const client_1 = require("@prisma/client");
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
class LitService {
    async getAllLits() {
        try {
            const lits = await prisma.lit.findMany();
            return { success: true, data: lits };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des lits:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getLitsByServiceId(serviceId) {
        try {
            const lits = await prisma.lit.findMany({
                where: { serviceId },
            });
            return { success: true, data: lits };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des lits par service:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createLit(data) {
        try {
            // Validation avec le schéma Zod
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.CreateLitSchema, data);
            const lit = await prisma.lit.create({
                data: validatedData,
            });
            return { success: true, data: lit };
        }
        catch (error) {
            console.error("Erreur lors de la création du lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async updateLit(id, data) {
        try {
            // Vérifier si le lit existe
            const litExists = await prisma.lit.findUnique({
                where: { id },
            });
            if (!litExists) {
                return {
                    success: false,
                    error: "Lit non trouvé",
                };
            }
            // Validation avec le schéma Zod pour la mise à jour
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.UpdateLitSchema, Object.assign({ id }, data));
            // Mise à jour du lit
            const updatedLit = await prisma.lit.update({
                where: { id },
                data: validatedData,
            });
            return {
                success: true,
                data: updatedLit,
            };
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour du lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getLitById(id) {
        try {
            const lit = await prisma.lit.findUnique({
                where: { id },
            });
            if (!lit) {
                return {
                    success: false,
                    error: "Lit non trouvé",
                };
            }
            return {
                success: true,
                data: lit,
            };
        }
        catch (error) {
            console.error("Erreur lors de la récupération du lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async deleteLit(id) {
        try {
            // Vérifier si le lit existe
            const litExists = await prisma.lit.findUnique({
                where: { id },
            });
            if (!litExists) {
                return {
                    success: false,
                    error: "Lit non trouvé",
                };
            }
            // Vérifier si le lit a des réservations
            const reservationsCount = await prisma.reservationLit.count({
                where: { litId: id },
            });
            if (reservationsCount > 0) {
                return {
                    success: false,
                    error: "Impossible de supprimer le lit car il a des réservations associées",
                };
            }
            await prisma.lit.delete({
                where: { id },
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error("Erreur lors de la suppression du lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.LitService = LitService;
