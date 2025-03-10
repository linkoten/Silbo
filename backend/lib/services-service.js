"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ServiceService {
    async getAllServices() {
        try {
            const services = await prisma.service.findMany();
            return { success: true, data: services };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des services:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createService(data) {
        try {
            // Validation basique
            if (!data.nom) {
                return {
                    success: false,
                    error: "Un nom doit être attribué au service",
                };
            }
            console.log(data);
            const service = await prisma.service.create({
                data: {
                    nom: data.nom,
                    etablissementId: data.etablissementId,
                },
            });
            return { success: true, data: service };
        }
        catch (error) {
            console.error("Erreur lors de la création du service:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.ServiceService = ServiceService;
