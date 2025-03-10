"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationLitRoutes = reservationLitRoutes;
const reservationsLits_service_1 = require("../lib/reservationsLits-service");
async function reservationLitRoutes(server) {
    const reservationLitService = new reservationsLits_service_1.ReservationLitService();
    // Route pour récupérer tous les reservationLits
    server.get("/reservationLits", async (_, reply) => {
        const result = await reservationLitService.getAllReservationsLits();
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des reservationLits",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un reservationLit
    server.post("/reservationLits", async (request, reply) => {
        const result = await reservationLitService.createReservationLit(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
}
