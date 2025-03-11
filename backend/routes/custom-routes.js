"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCustomRoutes = registerCustomRoutes;
const client_1 = require("@prisma/client");
const route_generator_1 = require("../lib/route-generator");
const prisma = new client_1.PrismaClient();
/**
 * Exemple de création d'une route personnalisée avec le générateur
 */
async function registerCustomRoutes(server) {
    // Exemple: Route personnalisée pour les patients
    await (0, route_generator_1.generateModelRoutes)(server, {
        modelName: "patient",
        pluralName: "patients",
        additionalRoutes: [
            {
                method: "GET",
                path: "/patients/search",
                handler: async (request, reply) => {
                    try {
                        const { query } = request.query;
                        const patients = await prisma.patient.findMany({
                            where: {
                                OR: [
                                    { nom: { contains: query } },
                                    { prenom: { contains: query } },
                                ],
                            },
                        });
                        return reply.send(patients);
                    }
                    catch (error) {
                        return reply.status(500).send({
                            error: "Erreur lors de la recherche de patients",
                            details: error instanceof Error ? error.message : String(error),
                        });
                    }
                },
            },
        ],
    });
    // Vous pouvez ajouter d'autres routes personnalisées ici
}
