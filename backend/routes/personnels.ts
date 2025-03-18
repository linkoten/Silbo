import { FastifyInstance } from "fastify";
import { PersonnelService } from "../lib/personnels-service";
import { Personnel } from "@prisma/client";

export async function personnelRoutes(server: FastifyInstance) {
  const personnelService = new PersonnelService();

  // Route pour récupérer tous les personnels
  server.get("/personnels", async (request, reply) => {
    const { etablissementId, serviceId } = request.query as {
      etablissementId?: string;
      serviceId?: string;
    };

    let result;
    if (etablissementId) {
      result = await personnelService.getPersonnelsByEtablissementId(
        etablissementId
      );
    } else if (serviceId) {
      result = await personnelService.getPersonnelsByServiceId(serviceId);
    } else {
      result = await personnelService.getAllPersonnels();
    }

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

  // Route pour mettre à jour un personnel existant (PATCH)
  server.patch<{
    Params: { id: string };
    Body: Partial<Personnel>;
  }>("/personnels/:id", async (request, reply) => {
    const { id } = request.params;
    const personnelData = request.body;

    const result = await personnelService.updatePersonnel(id, personnelData);

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour mettre à jour un personnel existant (PUT pour compatibilité)
  server.put<{
    Params: { id: string };
    Body: Partial<Personnel>;
  }>("/personnels/:id", async (request, reply) => {
    const { id } = request.params;
    const personnelData = request.body;

    const result = await personnelService.updatePersonnel(id, personnelData);

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour récupérer un personnel spécifique par son ID
  server.get<{
    Params: { id: string };
  }>("/personnels/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await personnelService.getPersonnelById(id);

    if (!result.success) {
      return reply.status(404).send({
        error: "Personnel non trouvé",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour supprimer un personnel
  server.delete<{
    Params: { id: string };
  }>("/personnels/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await personnelService.deletePersonnel(id);

    if (!result.success) {
      return reply.status(400).send({
        error: "Suppression échouée",
        details: result.error,
      });
    }

    return reply.status(204).send();
  });
}
