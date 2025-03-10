import { FastifyInstance } from "fastify";
import { Etablissement } from "../schema";
import { EtablissementService } from "../lib/etablissements-service";

export async function etablissementRoutes(server: FastifyInstance) {
  const etablissementService = new EtablissementService();

  // Route pour récupérer tous les etablissements
  server.get("/etablissements", async (_, reply) => {
    const result = await etablissementService.getAllEtablissements();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des etablissements",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour créer un etablissement
  server.post<{
    Body: Etablissement;
  }>("/etablissements", async (request, reply) => {
    const result = await etablissementService.createEtablissement(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });
}
