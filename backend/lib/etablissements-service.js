"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtablissementService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class EtablissementService {
    async getAllEtablissements() {
        try {
            const etablissements = await prisma.etablissement.findMany();
            return { success: true, data: etablissements };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des etablissements:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createEtablissement(data) {
        try {
            // Validation basique
            if (!data.nom) {
                return {
                    success: false,
                    error: "Un numéro doit être attribué au etablissement",
                };
            }
            console.log(data);
            const etablissement = await prisma.etablissement.create({
                data: {
                    nom: data.nom,
                    adresse: data.adresse,
                },
            });
            return { success: true, data: etablissement };
        }
        catch (error) {
            console.error("Erreur lors de la création du etablissement:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.EtablissementService = EtablissementService;
