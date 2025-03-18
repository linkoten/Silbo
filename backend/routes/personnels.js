"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personnelRoutes = personnelRoutes;
const personnels_service_1 = require("../lib/personnels-service");
async function personnelRoutes(server) {
    const personnelService = new personnels_service_1.PersonnelService();
    // Route pour récupérer tous les personnels
    server.get("/personnels", async (request, reply) => {
        const { etablissementId, serviceId } = request.query;
        let result;
        if (etablissementId) {
            result = await personnelService.getPersonnelsByEtablissementId(etablissementId);
        }
        else if (serviceId) {
            result = await personnelService.getPersonnelsByServiceId(serviceId);
        }
        else {
            result = await personnelService.getAllPersonnels();
        }
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des personnels",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un personnel
    server.post("/personnels", async (request, reply) => {
        const result = await personnelService.createPersonnel(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
    // Route pour mettre à jour un personnel existant (PATCH)
    server.patch("/personnels/:id", async (request, reply) => {
        const { id } = request.params;
        const personnelData = request.body;
        const result = await personnelService.updatePersonnel(id, personnelData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour mettre à jour un personnel existant (PUT pour compatibilité)
    server.put("/personnels/:id", async (request, reply) => {
        const { id } = request.params;
        const personnelData = request.body;
        const result = await personnelService.updatePersonnel(id, personnelData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un personnel spécifique par son ID
    server.get("/personnels/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await personnelService.getPersonnelById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Personnel non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un personnel
    server.delete("/personnels/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await personnelService.deletePersonnel(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
