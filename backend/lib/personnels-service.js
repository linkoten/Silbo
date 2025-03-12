"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonnelService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PersonnelService {
    async getAllPersonnels() {
        try {
            const personnels = await prisma.personnel.findMany();
            return { success: true, data: personnels };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des personnels:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createPersonnel(data) {
        try {
            // Validation basique
            if (!data.nom) {
                return {
                    success: false,
                    error: "Un nom doit être indiqué",
                };
            }
            console.log(data);
            const personnel = await prisma.personnel.create({
                data: {
                    nom: data.nom,
                    prenom: data.prenom,
                    dateNaissance: data.dateNaissance,
                    email: data.email,
                    telephone: data.telephone,
                    profession: data.profession,
                    specialite: data.specialite,
                    matricule: data.matricule,
                    serviceId: data.serviceId,
                    dateEmbauche: data.dateEmbauche,
                    statut: data.statut || "Actif",
                },
            });
            return { success: true, data: personnel };
        }
        catch (error) {
            console.error("Erreur lors de la création du personnel:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.PersonnelService = PersonnelService;
