"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priseEnChargeRoutes = priseEnChargeRoutes;
const prisesEnCharge_service_1 = require("../lib/prisesEnCharge-service");
async function priseEnChargeRoutes(server) {
    const priseEnChargeService = new prisesEnCharge_service_1.PriseEnChargeService();
    // Route pour récupérer tous les prisesEnCharge
    server.get("/prisesEnCharge", async (_, reply) => {
        const result = await priseEnChargeService.getAllPrisesEnCharge();
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des prisesEnCharge",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un priseEnCharge
    server.post("/prisesEnCharge", async (request, reply) => {
        const result = await priseEnChargeService.createPriseEnCharge(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
}
