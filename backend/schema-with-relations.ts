import { z } from "zod";
import {
  PatientSchema,
  PersonnelSchema,
  ServiceSchema,
  TransfertSchema,
  MaterielSchema,
  PriseEnChargeSchema,
  LitSchema,
  ReservationLitSchema,
  EtablissementSchema,
} from "./lib/schema";

// Schemas with relations included
export const patientWithRelationsSchema = PatientSchema.extend({
  transferts: z.array(TransfertSchema).optional(),
  prisesEnCharge: z.array(PriseEnChargeSchema).optional(),
  reservationsLit: z.array(ReservationLitSchema).optional(),
});

export const personnelWithRelationsSchema = PersonnelSchema.extend({
  service: ServiceSchema.optional(),
  prisesEnCharge: z.array(PriseEnChargeSchema).optional(),
});

export const serviceWithRelationsSchema = ServiceSchema.extend({
  personnel: z.array(PersonnelSchema).optional(),
  lits: z.array(LitSchema).optional(),
  etablissement: EtablissementSchema.optional(),
  materiels: z.array(MaterielSchema).optional(),
  transfertsDepart: z.array(TransfertSchema).optional(),
  transfertsArrivee: z.array(TransfertSchema).optional(),
});

export const transfertWithRelationsSchema = TransfertSchema.extend({
  patient: PatientSchema.optional(),
  serviceDepart: ServiceSchema.optional(),
  serviceArrivee: ServiceSchema.optional(),
  etablissementDepart: EtablissementSchema.nullable().optional(),
  etablissementArrivee: EtablissementSchema.nullable().optional(),
});

export const materielWithRelationsSchema = MaterielSchema.extend({
  service: ServiceSchema.optional(),
});

export const priseEnChargeWithRelationsSchema = PriseEnChargeSchema.extend({
  patient: PatientSchema.optional(),
  personnel: PersonnelSchema.optional(),
});

export const litWithRelationsSchema = LitSchema.extend({
  service: ServiceSchema.optional(),
  reservations: z.array(ReservationLitSchema).optional(),
});

export const reservationLitWithRelationsSchema = ReservationLitSchema.extend({
  patient: PatientSchema.optional(),
  lit: LitSchema.optional(),
  etablissementDestination: EtablissementSchema.nullable().optional(),
});

export const etablissementWithRelationsSchema = EtablissementSchema.extend({
  services: z.array(ServiceSchema).optional(),
  reservationsLit: z.array(ReservationLitSchema).optional(),
  transfertsDepart: z.array(TransfertSchema).optional(),
  transfertsArrivee: z.array(TransfertSchema).optional(),
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
