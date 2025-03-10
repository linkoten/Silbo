"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etablissementRoutes = etablissementRoutes;
const etablissements_service_1 = require("../lib/etablissements-service");
async function etablissementRoutes(server) {
    const etablissementService = new etablissements_service_1.EtablissementService();
    // Route pour récupérer tous les etablissements
    server.get("/etablissements", async (_, reply) => {
        const result = await etablissementService.getAllEtablissements();
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des etablissements",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un etablissement
    server.post("/etablissements", async (request, reply) => {
        const result = await etablissementService.createEtablissement(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
}
