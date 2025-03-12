import { z } from "zod";
import {
  PatientSchema,
  PersonnelSchema,
  ServiceSchema,
  EtablissementSchema,
} from "./schema";

// Définition des schémas avec relations circulaires
const BaseServiceSchema = ServiceSchema.omit({ etablissement: true as never });
const BaseEtablissementSchema = EtablissementSchema.omit({
  services: true as never,
});

// Créer les schémas avec relations
export const serviceWithRelationsSchema = BaseServiceSchema.extend({
  personnels: z.array(PersonnelSchema).optional(),
  lits: z.array(z.any()).optional(),
  etablissement: BaseEtablissementSchema.optional(),
  materiels: z.array(z.any()).optional(),
  transfertsDepart: z.array(z.any()).optional(),
  transfertsArrivee: z.array(z.any()).optional(),
});

export const etablissementWithRelationsSchema = BaseEtablissementSchema.extend({
  services: z.array(BaseServiceSchema).optional(),
});

export const personnelWithRelationsSchema = PersonnelSchema.extend({
  service: BaseServiceSchema.optional(),
  prisesEnCharge: z.array(z.any()).optional(),
});

export const patientWithRelationsSchema = PatientSchema.extend({
  transferts: z.array(z.any()).optional(),
  prisesEnCharge: z.array(z.any()).optional(),
  reservationsLit: z.array(z.any()).optional(),
});

export const transfertWithRelationsSchema = z.object({
  id: z.string().optional(),
  patientId: z.string(),
  serviceDepartId: z.string(),
  serviceArriveeId: z.string(),
  date: z.coerce.date(),
  patient: PatientSchema.optional(),
  serviceDepart: serviceWithRelationsSchema.optional(),
  serviceArrivee: serviceWithRelationsSchema.optional(),
});
