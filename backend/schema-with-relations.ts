import { z } from "zod";
import {
  patientSchema,
  personnelSchema,
  serviceSchema,
  transfertSchema,
  materielSchema,
  priseEnChargeSchema,
  litSchema,
  reservationLitSchema,
  etablissementSchema,
} from "./schema";

// Schemas with relations included
export const patientWithRelationsSchema = patientSchema.extend({
  transferts: z.array(transfertSchema).optional(),
  prisesEnCharge: z.array(priseEnChargeSchema).optional(),
  reservationsLit: z.array(reservationLitSchema).optional(),
});

export const personnelWithRelationsSchema = personnelSchema.extend({
  service: serviceSchema.optional(),
  prisesEnCharge: z.array(priseEnChargeSchema).optional(),
});

export const serviceWithRelationsSchema = serviceSchema.extend({
  personnel: z.array(personnelSchema).optional(),
  lits: z.array(litSchema).optional(),
  etablissement: etablissementSchema.optional(),
  materiels: z.array(materielSchema).optional(),
  transfertsDepart: z.array(transfertSchema).optional(),
  transfertsArrivee: z.array(transfertSchema).optional(),
});

export const transfertWithRelationsSchema = transfertSchema.extend({
  patient: patientSchema.optional(),
  serviceDepart: serviceSchema.optional(),
  serviceArrivee: serviceSchema.optional(),
  etablissementDepart: etablissementSchema.nullable().optional(),
  etablissementArrivee: etablissementSchema.nullable().optional(),
});

export const materielWithRelationsSchema = materielSchema.extend({
  service: serviceSchema.optional(),
});

export const priseEnChargeWithRelationsSchema = priseEnChargeSchema.extend({
  patient: patientSchema.optional(),
  personnel: personnelSchema.optional(),
});

export const litWithRelationsSchema = litSchema.extend({
  service: serviceSchema.optional(),
  reservations: z.array(reservationLitSchema).optional(),
});

export const reservationLitWithRelationsSchema = reservationLitSchema.extend({
  patient: patientSchema.optional(),
  lit: litSchema.optional(),
  etablissementDestination: etablissementSchema.nullable().optional(),
});

export const etablissementWithRelationsSchema = etablissementSchema.extend({
  services: z.array(serviceSchema).optional(),
  reservationsLit: z.array(reservationLitSchema).optional(),
  transfertsDepart: z.array(transfertSchema).optional(),
  transfertsArrivee: z.array(transfertSchema).optional(),
});

// Types with relations
export type PatientWithRelations = z.infer<typeof patientWithRelationsSchema>;
export type PersonnelWithRelations = z.infer<
  typeof personnelWithRelationsSchema
>;
export type ServiceWithRelations = z.infer<typeof serviceWithRelationsSchema>;
export type TransfertWithRelations = z.infer<
  typeof transfertWithRelationsSchema
>;
export type MaterielWithRelations = z.infer<typeof materielWithRelationsSchema>;
export type PriseEnChargeWithRelations = z.infer<
  typeof priseEnChargeWithRelationsSchema
>;
export type LitWithRelations = z.infer<typeof litWithRelationsSchema>;
export type ReservationLitWithRelations = z.infer<
  typeof reservationLitWithRelationsSchema
>;
export type EtablissementWithRelations = z.infer<
  typeof etablissementWithRelationsSchema
>;
