import { FastifyInstance } from "fastify";
import { PriseEnChargeService } from "../lib/prisesEnCharge-service";
import { PriseEnCharge } from "@prisma/client";

export async function priseEnChargeRoutes(server: FastifyInstance) {
  const priseEnChargeService = new PriseEnChargeService();

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
  server.post<{
    Body: PriseEnCharge;
  }>("/prisesEnCharge", async (request, reply) => {
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
