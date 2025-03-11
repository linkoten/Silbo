import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { generateModelRoutes } from "../lib/route-generator";

const prisma = new PrismaClient();

/**
 * Exemple de création d'une route personnalisée avec le générateur
 */
export async function registerCustomRoutes(server: FastifyInstance) {
  // Exemple: Route personnalisée pour les patients
  await generateModelRoutes(server, {
    modelName: "patient",
    pluralName: "patients",
    additionalRoutes: [
      {
        method: "GET",
        path: "/patients/search",
        handler: async (request: any, reply) => {
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
          } catch (error) {
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
