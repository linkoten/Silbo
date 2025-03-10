import { FastifyInstance } from "fastify";
import { Lit } from "../schema";
import { LitService } from "../lib/lits-service";

export async function litRoutes(server: FastifyInstance) {
  const litService = new LitService();

  // Route pour récupérer tous les lits
  server.get("/lits", async (_, reply) => {
    const result = await litService.getAllLits();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des lits",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour créer un lit
  server.post<{
    Body: Lit;
  }>("/lits", async (request, reply) => {
    const result = await litService.createLit(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });
}
