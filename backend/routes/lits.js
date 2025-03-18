"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.litRoutes = litRoutes;
const lits_service_1 = require("../lib/lits-service");
async function litRoutes(server) {
    const litService = new lits_service_1.LitService();
    // Route pour récupérer tous les lits
    server.get("/lits", async (request, reply) => {
        const { serviceId } = request.query;
        let result;
        if (serviceId) {
            result = await litService.getLitsByServiceId(serviceId);
        }
        else {
            result = await litService.getAllLits();
        }
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des lits",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un lit
    server.post("/lits", async (request, reply) => {
        const result = await litService.createLit(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
    // Route pour mettre à jour un lit existant (PATCH)
    server.patch("/lits/:id", async (request, reply) => {
        const { id } = request.params;
        const litData = request.body;
        const result = await litService.updateLit(id, litData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour mettre à jour un lit existant (PUT pour compatibilité)
    server.put("/lits/:id", async (request, reply) => {
        const { id } = request.params;
        const litData = request.body;
        const result = await litService.updateLit(id, litData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un lit spécifique par son ID
    server.get("/lits/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await litService.getLitById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Lit non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un lit
    server.delete("/lits/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await litService.deleteLit(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
