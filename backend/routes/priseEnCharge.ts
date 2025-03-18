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

  // Route pour mettre à jour une prise en charge existante (PATCH)
  server.patch<{
    Params: { id: string };
    Body: Partial<PriseEnCharge>;
  }>("/prisesEnCharge/:id", async (request, reply) => {
    const { id } = request.params;
    const priseEnChargeData = request.body;

    const result = await priseEnChargeService.updatePriseEnCharge(
      id,
      priseEnChargeData
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour mettre à jour une prise en charge existante (PUT pour compatibilité)
  server.put<{
    Params: { id: string };
    Body: Partial<PriseEnCharge>;
  }>("/prisesEnCharge/:id", async (request, reply) => {
    const { id } = request.params;
    const priseEnChargeData = request.body;

    const result = await priseEnChargeService.updatePriseEnCharge(
      id,
      priseEnChargeData
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour récupérer une prise en charge spécifique par son ID
  server.get<{
    Params: { id: string };
  }>("/prisesEnCharge/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await priseEnChargeService.getPriseEnChargeById(id);

    if (!result.success) {
      return reply.status(404).send({
        error: "Prise en charge non trouvée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour supprimer une prise en charge
  server.delete<{
    Params: { id: string };
  }>("/prisesEnCharge/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await priseEnChargeService.deletePriseEnCharge(id);

    if (!result.success) {
      return reply.status(400).send({
        error: "Suppression échouée",
        details: result.error,
      });
    }

    return reply.status(204).send();
  });
}
