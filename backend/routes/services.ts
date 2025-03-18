import { FastifyInstance } from "fastify";
import { ServiceService } from "../lib/services-service";
import { Service } from "@prisma/client";

export async function serviceRoutes(server: FastifyInstance) {
  const serviceService = new ServiceService();

  // Route pour récupérer tous les services
  server.get("/services", async (request, reply) => {
    const { etablissementId } = request.query as { etablissementId?: string };

    let result;
    if (etablissementId) {
      result = await serviceService.getServicesByEtablissementId(
        etablissementId
      );
    } else {
      result = await serviceService.getAllServices();
    }

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

  // Route pour mettre à jour un service existant (PATCH)
  server.patch<{
    Params: { id: string };
    Body: Partial<Service>;
  }>("/services/:id", async (request, reply) => {
    const { id } = request.params;
    const serviceData = request.body;

    const result = await serviceService.updateService(id, serviceData);

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour mettre à jour un service existant (PUT pour compatibilité)
  server.put<{
    Params: { id: string };
    Body: Partial<Service>;
  }>("/services/:id", async (request, reply) => {
    const { id } = request.params;
    const serviceData = request.body;

    const result = await serviceService.updateService(id, serviceData);

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour récupérer un service spécifique par son ID
  server.get<{
    Params: { id: string };
  }>("/services/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await serviceService.getServiceById(id);

    if (!result.success) {
      return reply.status(404).send({
        error: "Service non trouvé",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour supprimer un service
  server.delete<{
    Params: { id: string };
  }>("/services/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await serviceService.deleteService(id);

    if (!result.success) {
      return reply.status(400).send({
        error: "Suppression échouée",
        details: result.error,
      });
    }

    return reply.status(204).send();
  });
}
