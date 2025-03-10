"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.personnelRoutes = personnelRoutes;
const personnels_service_1 = require("../lib/personnels-service");
async function personnelRoutes(server) {
    const personnelService = new personnels_service_1.PersonnelService();
    // Route pour récupérer tous les personnels
    server.get("/personnels", async (_, reply) => {
        const result = await personnelService.getAllPersonnels();
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
}
