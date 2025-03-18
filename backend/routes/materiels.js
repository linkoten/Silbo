"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materielRoutes = materielRoutes;
const materiels_service_1 = require("../lib/materiels-service");
async function materielRoutes(server) {
    const materielService = new materiels_service_1.MaterielService();
    // Route pour récupérer tous les matériels
    server.get("/materiels", async (request, reply) => {
        const { serviceId } = request.query;
        let result;
        if (serviceId) {
            result = await materielService.getMaterielsByServiceId(serviceId);
        }
        else {
            result = await materielService.getAllMateriels();
        }
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des matériels",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un matériel
    server.post("/materiels", async (request, reply) => {
        const result = await materielService.createMateriel(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
    // Route pour mettre à jour un matériel existant (PATCH)
    server.patch("/materiels/:id", async (request, reply) => {
        const { id } = request.params;
        const materielData = request.body;
        const result = await materielService.updateMateriel(id, materielData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour mettre à jour un matériel existant (PUT pour compatibilité)
    server.put("/materiels/:id", async (request, reply) => {
        const { id } = request.params;
        const materielData = request.body;
        const result = await materielService.updateMateriel(id, materielData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un matériel spécifique par son ID
    server.get("/materiels/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await materielService.getMaterielById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Matériel non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un matériel
    server.delete("/materiels/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await materielService.deleteMateriel(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
