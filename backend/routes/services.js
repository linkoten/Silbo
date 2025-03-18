"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = serviceRoutes;
const services_service_1 = require("../lib/services-service");
async function serviceRoutes(server) {
    const serviceService = new services_service_1.ServiceService();
    // Route pour récupérer tous les services
    server.get("/services", async (request, reply) => {
        const { etablissementId } = request.query;
        let result;
        if (etablissementId) {
            result = await serviceService.getServicesByEtablissementId(etablissementId);
        }
        else {
            result = await serviceService.getAllServices();
        }
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des services",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un service
    server.post("/services", async (request, reply) => {
        const result = await serviceService.createService(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
    // Route pour mettre à jour un service existant (PATCH)
    server.patch("/services/:id", async (request, reply) => {
        const { id } = request.params;
        const serviceData = request.body;
        const result = await serviceService.updateService(id, serviceData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour mettre à jour un service existant (PUT pour compatibilité)
    server.put("/services/:id", async (request, reply) => {
        const { id } = request.params;
        const serviceData = request.body;
        const result = await serviceService.updateService(id, serviceData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un service spécifique par son ID
    server.get("/services/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await serviceService.getServiceById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Service non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un service
    server.delete("/services/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await serviceService.deleteService(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
