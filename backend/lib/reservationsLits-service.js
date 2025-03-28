"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationLitService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ReservationLitService {
    async getAllReservationsLits() {
        try {
            const ReservationsLits = await prisma.reservationLit.findMany();
            return { success: true, data: ReservationsLits };
        }
        catch (error) {
            console.error("Erreur lors de la réservation des lits:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getReservationLitById(id) {
        try {
            const reservationLit = await prisma.reservationLit.findUnique({
                where: { id },
                include: {
                    patient: true,
                    lit: true,
                    etablissementDestination: true,
                },
            });
            if (!reservationLit) {
                return {
                    success: false,
                    error: "Réservation de lit non trouvée",
                };
            }
            return { success: true, data: reservationLit };
        }
        catch (error) {
            console.error("Erreur lors de la récupération de la réservation de lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getReservationLitsByPatientId(patientId) {
        try {
            const reservationsLit = await prisma.reservationLit.findMany({
                where: { patientId },
                include: {
                    lit: true,
                    etablissementDestination: true,
                },
            });
            return { success: true, data: reservationsLit };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des réservations de lit par patient:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async getReservationLitsByLitId(litId) {
        try {
            const reservationsLit = await prisma.reservationLit.findMany({
                where: { litId },
                include: {
                    patient: true,
                },
            });
            return { success: true, data: reservationsLit };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des réservations par lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async createReservationLit(data) {
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
        }
        catch (error) {
            console.error("Erreur lors de la réservation des lits:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async updateReservationLit(id, data) {
        try {
            // Vérifier si la réservation existe
            const reservationExists = await prisma.reservationLit.findUnique({
                where: { id },
            });
            if (!reservationExists) {
                return {
                    success: false,
                    error: "Réservation de lit non trouvée",
                };
            }
            // Mise à jour de la réservation
            const updatedReservation = await prisma.reservationLit.update({
                where: { id },
                data,
            });
            return {
                success: true,
                data: updatedReservation,
            };
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de la réservation de lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async deleteReservationLit(id) {
        try {
            // Vérifier si la réservation de lit existe
            const reservationExists = await prisma.reservationLit.findUnique({
                where: { id },
            });
            if (!reservationExists) {
                return {
                    success: false,
                    error: "Réservation de lit non trouvée",
                };
            }
            await prisma.reservationLit.delete({
                where: { id },
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error("Erreur lors de la suppression de la réservation de lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
    async checkLitAvailability(litId, startDate, endDate, excludeReservationId) {
        try {
            // Rechercher les réservations qui se chevauchent pour ce lit
            const overlappingReservations = await prisma.reservationLit.findMany({
                where: {
                    litId,
                    id: excludeReservationId ? { not: excludeReservationId } : undefined,
                    OR: [
                        // Cas 1: La nouvelle réservation commence pendant une réservation existante
                        {
                            dateArrivee: { lte: startDate },
                            dateDepart: { gte: startDate },
                        },
                        // Cas 2: La nouvelle réservation se termine pendant une réservation existante
                        {
                            dateArrivee: { lte: endDate },
                            dateDepart: { gte: endDate },
                        },
                        // Cas 3: La nouvelle réservation englobe entièrement une réservation existante
                        {
                            dateArrivee: { gte: startDate },
                            dateDepart: { lte: endDate },
                        },
                    ],
                },
            });
            const isAvailable = overlappingReservations.length === 0;
            return {
                success: true,
                data: isAvailable,
            };
        }
        catch (error) {
            console.error("Erreur lors de la vérification de disponibilité du lit:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Erreur inconnue",
            };
        }
    }
}
exports.ReservationLitService = ReservationLitService;
