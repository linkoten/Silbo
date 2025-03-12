import { FastifyInstance } from "fastify";
import { TransfertService } from "../lib/transferts-service";
import { Transfert } from "@prisma/client";

export async function transfertRoutes(server: FastifyInstance) {
  const transfertService = new TransfertService();

  // Route pour récupérer tous les transferts
  server.get("/transferts", async (_, reply) => {
    const result = await transfertService.getAllTransferts();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des transferts",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour créer un transfert
  server.post<{
    Body: Transfert;
  }>("/transferts", async (request, reply) => {
    const result = await transfertService.createTransfert(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });
}
