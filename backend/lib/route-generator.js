"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateModelRoutes = generateModelRoutes;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function generateModelRoutes(fastify, options) {
    const { modelName, pluralName = `${modelName}s`, // Par défaut ajoute un 's'
    excludeRoutes = [], additionalRoutes = [], } = options;
    // Vérifier si le modèle existe dans Prisma
    if (!(modelName in prisma)) {
        throw new Error(`Le modèle '${modelName}' n'existe pas dans Prisma.`);
    }
    const model = prisma[modelName];
    // Route pour obtenir la liste des éléments
    if (!excludeRoutes.includes("list")) {
        fastify.get(`/${pluralName}`, async (_, reply) => {
            try {
                const items = await model.findMany();
                return reply.send(items);
            }
            catch (error) {
                console.error(`Erreur lors de la récupération des ${pluralName}:`, error);
                return reply.status(500).send({
                    error: `Erreur lors de la récupération des ${pluralName}`,
                    details: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Route pour obtenir un élément par ID
    if (!excludeRoutes.includes("get")) {
        fastify.get(`/${pluralName}/:id`, async (request, reply) => {
            try {
                const { id } = request.params;
                const item = await model.findUnique({
                    where: { id },
                });
                if (!item) {
                    return reply.status(404).send({
                        error: `${modelName} non trouvé`,
                    });
                }
                return reply.send(item);
            }
            catch (error) {
                console.error(`Erreur lors de la récupération du ${modelName}:`, error);
                return reply.status(500).send({
                    error: `Erreur lors de la récupération du ${modelName}`,
                    details: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Route pour créer un élément
    if (!excludeRoutes.includes("create")) {
        fastify.post(`/${pluralName}`, async (request, reply) => {
            try {
                const newItem = await model.create({
                    data: request.body,
                });
                return reply.status(201).send(newItem);
            }
            catch (error) {
                console.error(`Erreur lors de la création du ${modelName}:`, error);
                return reply.status(400).send({
                    error: `Erreur lors de la création du ${modelName}`,
                    details: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Route pour mettre à jour un élément
    if (!excludeRoutes.includes("update")) {
        fastify.put(`/${pluralName}/:id`, async (request, reply) => {
            try {
                const { id } = request.params;
                const updatedItem = await model.update({
                    where: { id },
                    data: request.body,
                });
                return reply.send(updatedItem);
            }
            catch (error) {
                console.error(`Erreur lors de la mise à jour du ${modelName}:`, error);
                return reply.status(400).send({
                    error: `Erreur lors de la mise à jour du ${modelName}`,
                    details: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Route pour supprimer un élément
    if (!excludeRoutes.includes("delete")) {
        fastify.delete(`/${pluralName}/:id`, async (request, reply) => {
            try {
                const { id } = request.params;
                await model.delete({
                    where: { id },
                });
                return reply.status(204).send();
            }
            catch (error) {
                console.error(`Erreur lors de la suppression du ${modelName}:`, error);
                return reply.status(400).send({
                    error: `Erreur lors de la suppression du ${modelName}`,
                    details: error instanceof Error ? error.message : String(error),
                });
            }
        });
    }
    // Ajouter des routes personnalisées
    for (const route of additionalRoutes) {
        fastify[route.method.toLowerCase()](route.path, route.handler);
    }
}
