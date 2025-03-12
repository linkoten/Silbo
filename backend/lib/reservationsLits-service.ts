import { PrismaClient, ReservationLit } from "@prisma/client";

const prisma = new PrismaClient();

interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ReservationLitService {
  async getAllReservationsLits(): Promise<ServiceResult<ReservationLit[]>> {
    try {
      const ReservationsLits = await prisma.reservationLit.findMany();
      return { success: true, data: ReservationsLits };
    } catch (error) {
      console.error("Erreur lors de la réservation des lits:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  async createReservationLit(
    data: ReservationLit
  ): Promise<ServiceResult<ReservationLit>> {
    try {
      // Validation basique
      if (!data.litId) {
        return {
          success: false,
          error: "Un numéro doit être attribué au lit",
        };
      }

      console.log(data);

      const reservationLit = await prisma.reservationLit.create({
        data: {
          patientId: data.patientId,
          litId: data.litId,
          dateDepart: data.dateDepart,
          dateArrivee: data.dateArrivee,
          etablissementDestinationId: data.etablissementDestinationId,
        },
      });

      return { success: true, data: reservationLit };
    } catch (error) {
      console.error("Erreur lors de la réservation des lits:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
