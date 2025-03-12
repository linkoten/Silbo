"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etablissementWithRelationsSchema = exports.reservationLitWithRelationsSchema = exports.litWithRelationsSchema = exports.priseEnChargeWithRelationsSchema = exports.materielWithRelationsSchema = exports.transfertWithRelationsSchema = exports.serviceWithRelationsSchema = exports.personnelWithRelationsSchema = exports.patientWithRelationsSchema = void 0;
const zod_1 = require("zod");
const schema_1 = require("./lib/schema");
// Schemas with relations included
exports.patientWithRelationsSchema = schema_1.PatientSchema.extend({
    transferts: zod_1.z.array(schema_1.TransfertSchema).optional(),
    prisesEnCharge: zod_1.z.array(schema_1.PriseEnChargeSchema).optional(),
    reservationsLit: zod_1.z.array(schema_1.ReservationLitSchema).optional(),
});
exports.personnelWithRelationsSchema = schema_1.PersonnelSchema.extend({
    service: schema_1.ServiceSchema.optional(),
    prisesEnCharge: zod_1.z.array(schema_1.PriseEnChargeSchema).optional(),
});
exports.serviceWithRelationsSchema = schema_1.ServiceSchema.extend({
    personnel: zod_1.z.array(schema_1.PersonnelSchema).optional(),
    lits: zod_1.z.array(schema_1.LitSchema).optional(),
    etablissement: schema_1.EtablissementSchema.optional(),
    materiels: zod_1.z.array(schema_1.MaterielSchema).optional(),
    transfertsDepart: zod_1.z.array(schema_1.TransfertSchema).optional(),
    transfertsArrivee: zod_1.z.array(schema_1.TransfertSchema).optional(),
});
exports.transfertWithRelationsSchema = schema_1.TransfertSchema.extend({
    patient: schema_1.PatientSchema.optional(),
    serviceDepart: schema_1.ServiceSchema.optional(),
    serviceArrivee: schema_1.ServiceSchema.optional(),
    etablissementDepart: schema_1.EtablissementSchema.nullable().optional(),
    etablissementArrivee: schema_1.EtablissementSchema.nullable().optional(),
});
exports.materielWithRelationsSchema = schema_1.MaterielSchema.extend({
    service: schema_1.ServiceSchema.optional(),
});
exports.priseEnChargeWithRelationsSchema = schema_1.PriseEnChargeSchema.extend({
    patient: schema_1.PatientSchema.optional(),
    personnel: schema_1.PersonnelSchema.optional(),
});
exports.litWithRelationsSchema = schema_1.LitSchema.extend({
    service: schema_1.ServiceSchema.optional(),
    reservations: zod_1.z.array(schema_1.ReservationLitSchema).optional(),
});
exports.reservationLitWithRelationsSchema = schema_1.ReservationLitSchema.extend({
    patient: schema_1.PatientSchema.optional(),
    lit: schema_1.LitSchema.optional(),
    etablissementDestination: schema_1.EtablissementSchema.nullable().optional(),
});
exports.etablissementWithRelationsSchema = schema_1.EtablissementSchema.extend({
    services: zod_1.z.array(schema_1.ServiceSchema).optional(),
    reservationsLit: zod_1.z.array(schema_1.ReservationLitSchema).optional(),
    transfertsDepart: zod_1.z.array(schema_1.TransfertSchema).optional(),
    transfertsArrivee: zod_1.z.array(schema_1.TransfertSchema).optional(),
});
