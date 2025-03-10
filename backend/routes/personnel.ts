import { FastifyInstance } from "fastify";
import { Personnel } from "../schema";
import { PersonnelService } from "../lib/personnels-service";

export async function personnelRoutes(server: FastifyInstance) {
  const personnelService = new PersonnelService();

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
  server.post<{
    Body: Personnel;
  }>("/personnels", async (request, reply) => {
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
