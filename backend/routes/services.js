"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRoutes = serviceRoutes;
const services_service_1 = require("../lib/services-service");
async function serviceRoutes(server) {
    const serviceService = new services_service_1.ServiceService();
    // Route pour récupérer tous les services
    server.get("/services", async (_, reply) => {
        const result = await serviceService.getAllServices();
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
}
