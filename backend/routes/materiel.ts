import { FastifyInstance } from "fastify";
import { MaterielService } from "../lib/materiels-service";
import { Materiel } from "@prisma/client";

export async function materielRoutes(server: FastifyInstance) {
  const materielService = new MaterielService();

  // Route pour récupérer tous les materiels
  server.get("/materiels", async (_, reply) => {
    const result = await materielService.getAllMateriels();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des materiels",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour créer un materiel
  server.post<{
    Body: Materiel;
  }>("/materiels", async (request, reply) => {
    const result = await materielService.createMateriel(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });
}
