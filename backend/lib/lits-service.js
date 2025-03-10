"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitService = void 0;
const client_1 = require("@prisma/client");
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
    async createLit(data) {
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
                    serviceId: data.serviceId,
                },
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
}
exports.LitService = LitService;
