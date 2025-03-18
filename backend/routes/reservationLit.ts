import { FastifyInstance } from "fastify";
import { ReservationLitService } from "../lib/reservationsLits-service";
import { ReservationLit } from "@prisma/client";

export async function reservationLitRoutes(server: FastifyInstance) {
  const reservationLitService = new ReservationLitService();

  // Route pour récupérer toutes les réservations de lit
  server.get("/reservationsLit", async (request, reply) => {
    const { patientId, litId } = request.query as {
      patientId?: string;
      litId?: string;
    };

    let result;
    if (patientId) {
      result = await reservationLitService.getReservationLitsByPatientId(
        patientId
      );
    } else if (litId) {
      result = await reservationLitService.getReservationLitsByLitId(litId);
    } else {
      result = await reservationLitService.getAllReservationsLits();
    }

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des réservations de lit",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour récupérer une réservation spécifique par ID
  server.get<{
    Params: { id: string };
  }>("/reservationsLit/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await reservationLitService.getReservationLitById(id);

    if (!result.success) {
      return reply.status(404).send({
        error: "Réservation de lit non trouvée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour vérifier la disponibilité d'un lit
  server.get<{
    Querystring: {
      litId: string;
      startDate: string;
      endDate: string;
      reservationId?: string;
    };
  }>("/reservationsLit/check-availability", async (request, reply) => {
    const { litId, startDate, endDate, reservationId } = request.query;

    if (!litId || !startDate || !endDate) {
      return reply.status(400).send({
        error: "Paramètres manquants: litId, startDate et endDate sont requis",
      });
    }

    const result = await reservationLitService.checkLitAvailability(
      litId,
      new Date(startDate),
      new Date(endDate),
      reservationId
    );

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la vérification de disponibilité",
        details: result.error,
      });
    }

    return reply.send({ available: result.data });
  });

  // Route pour créer une réservation de lit
  server.post<{
    Body: Omit<ReservationLit, "id">;
  }>("/reservationsLit", async (request, reply) => {
    const result = await reservationLitService.createReservationLit(
      request.body as ReservationLit
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });

  // Route pour mettre à jour une réservation de lit (PATCH)
  server.patch<{
    Params: { id: string };
    Body: Partial<ReservationLit>;
  }>("/reservationsLit/:id", async (request, reply) => {
    const { id } = request.params;
    const reservationData = request.body;

    const result = await reservationLitService.updateReservationLit(
      id,
      reservationData
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour mettre à jour une réservation de lit (PUT - pour compatibilité)
  server.put<{
    Params: { id: string };
    Body: Partial<ReservationLit>;
  }>("/reservationsLit/:id", async (request, reply) => {
    const { id } = request.params;
    const reservationData = request.body;

    const result = await reservationLitService.updateReservationLit(
      id,
      reservationData
    );

    if (!result.success) {
      return reply.status(400).send({
        error: "Mise à jour échouée",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  // Route pour supprimer une réservation de lit
  server.delete<{
    Params: { id: string };
  }>("/reservationsLit/:id", async (request, reply) => {
    const { id } = request.params;
    const result = await reservationLitService.deleteReservationLit(id);

    if (!result.success) {
      return reply.status(400).send({
        error: "Suppression échouée",
        details: result.error,
      });
    }

    return reply.status(204).send();
  });
}
