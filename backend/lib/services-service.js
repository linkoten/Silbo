"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const client_1 = require("@prisma/client");
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("./schema");
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
            // Validation avec le schéma Zod
            const validatedData = await (0, validation_utils_1.validateData)(schema_1.CreateServiceSchema, data);
            const service = await prisma.service.create({
                data: {
                    nom: validatedData.nom,
                    description: validatedData.description,
                    etablissementId: validatedData.etablissementId,
                    etage: validatedData.etage,
                    aile: validatedData.aile,
                    capacite: validatedData.capacite,
                    statut: validatedData.statut || "Actif",
                    specialite: validatedData.specialite,
                    responsableId: validatedData.responsableId,
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
