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
            console.error("Erreur lors de la récupération des materiels:", error);
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
                data: {
                    nom: validatedData.nom,
                    description: validatedData.description,
                    quantite: validatedData.quantite,
                    type: validatedData.type,
                    marque: validatedData.marque,
                    modele: validatedData.modele,
                    numeroSerie: validatedData.numeroSerie,
                    dateAchat: validatedData.dateAchat,
                    dateMaintenance: validatedData.dateMaintenance,
                    statut: validatedData.statut || "En Service",
                    serviceId: validatedData.serviceId,
                },
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
}
exports.MaterielService = MaterielService;
