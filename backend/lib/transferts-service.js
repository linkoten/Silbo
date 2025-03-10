"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfertService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TransfertService {
    async getAllTransferts() {
        try {
            const transferts = await prisma.transfert.findMany();
            return { success: true, data: transferts };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des transferts:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createTransfert(data) {
        try {
            // Validation basique
            if (!data.id) {
                return {
                    success: false,
                    error: "Un identifiant doit être attribué au transfert",
                };
            }
            console.log(data);
            const transfert = await prisma.transfert.create({
                data: {
                    patientId: data.patientId,
                    serviceDepartId: data.serviceDepartId,
                    serviceArriveeId: data.serviceArriveeId,
                    dateTransfert: data.dateTransfert,
                    etablissementDepartId: data.etablissementDepartId,
                    etablissementArriveeId: data.etablissementArriveeId,
                },
            });
            return { success: true, data: transfert };
        }
        catch (error) {
            console.error("Erreur lors de la création du transfert:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.TransfertService = TransfertService;
