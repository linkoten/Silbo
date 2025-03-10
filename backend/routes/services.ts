import { FastifyInstance } from "fastify";
import { Service } from "../schema";
import { ServiceService } from "../lib/services-service";

export async function serviceRoutes(server: FastifyInstance) {
  const serviceService = new ServiceService();

  // Route pour récupérer tous les services
  server.get("/services", async (_, reply) => {
    const result = await serviceService.getAllServices();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des services",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour créer un service
  server.post<{
    Body: Service;
  }>("/services", async (request, reply) => {
    const result = await serviceService.createService(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });
}
