"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etablissementRoutes = etablissementRoutes;
const etablissement_service_1 = require("../lib/etablissement-service");
async function etablissementRoutes(server) {
    const etablissementService = new etablissement_service_1.EtablissementService();
    // Route pour récupérer tous les établissements
    server.get("/etablissements", async (_, reply) => {
        const result = await etablissementService.getAllEtablissements();
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des établissements",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un établissement
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
    // Route pour mettre à jour un établissement existant (PATCH)
    server.patch("/etablissements/:id", async (request, reply) => {
        const { id } = request.params;
        const etablissementData = request.body;
        const result = await etablissementService.updateEtablissement(id, etablissementData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour mettre à jour un établissement existant (PUT pour compatibilité)
    server.put("/etablissements/:id", async (request, reply) => {
        const { id } = request.params;
        const etablissementData = request.body;
        const result = await etablissementService.updateEtablissement(id, etablissementData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un établissement spécifique par son ID
    server.get("/etablissements/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await etablissementService.getEtablissementById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Établissement non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un établissement
    server.delete("/etablissements/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await etablissementService.deleteEtablissement(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
