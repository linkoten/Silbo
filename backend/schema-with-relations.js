"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.etablissementWithRelationsSchema = exports.reservationLitWithRelationsSchema = exports.litWithRelationsSchema = exports.priseEnChargeWithRelationsSchema = exports.materielWithRelationsSchema = exports.transfertWithRelationsSchema = exports.serviceWithRelationsSchema = exports.personnelWithRelationsSchema = exports.patientWithRelationsSchema = void 0;
const zod_1 = require("zod");
const schema_1 = require("./schema");
// Schemas with relations included
exports.patientWithRelationsSchema = schema_1.patientSchema.extend({
    transferts: zod_1.z.array(schema_1.transfertSchema).optional(),
    prisesEnCharge: zod_1.z.array(schema_1.priseEnChargeSchema).optional(),
    reservationsLit: zod_1.z.array(schema_1.reservationLitSchema).optional(),
});
exports.personnelWithRelationsSchema = schema_1.personnelSchema.extend({
    service: schema_1.serviceSchema.optional(),
    prisesEnCharge: zod_1.z.array(schema_1.priseEnChargeSchema).optional(),
});
exports.serviceWithRelationsSchema = schema_1.serviceSchema.extend({
    personnel: zod_1.z.array(schema_1.personnelSchema).optional(),
    lits: zod_1.z.array(schema_1.litSchema).optional(),
    etablissement: schema_1.etablissementSchema.optional(),
    materiels: zod_1.z.array(schema_1.materielSchema).optional(),
    transfertsDepart: zod_1.z.array(schema_1.transfertSchema).optional(),
    transfertsArrivee: zod_1.z.array(schema_1.transfertSchema).optional(),
});
exports.transfertWithRelationsSchema = schema_1.transfertSchema.extend({
    patient: schema_1.patientSchema.optional(),
    serviceDepart: schema_1.serviceSchema.optional(),
    serviceArrivee: schema_1.serviceSchema.optional(),
    etablissementDepart: schema_1.etablissementSchema.nullable().optional(),
    etablissementArrivee: schema_1.etablissementSchema.nullable().optional(),
});
exports.materielWithRelationsSchema = schema_1.materielSchema.extend({
    service: schema_1.serviceSchema.optional(),
});
exports.priseEnChargeWithRelationsSchema = schema_1.priseEnChargeSchema.extend({
    patient: schema_1.patientSchema.optional(),
    personnel: schema_1.personnelSchema.optional(),
});
exports.litWithRelationsSchema = schema_1.litSchema.extend({
    service: schema_1.serviceSchema.optional(),
    reservations: zod_1.z.array(schema_1.reservationLitSchema).optional(),
});
exports.reservationLitWithRelationsSchema = schema_1.reservationLitSchema.extend({
    patient: schema_1.patientSchema.optional(),
    lit: schema_1.litSchema.optional(),
    etablissementDestination: schema_1.etablissementSchema.nullable().optional(),
});
exports.etablissementWithRelationsSchema = schema_1.etablissementSchema.extend({
    services: zod_1.z.array(schema_1.serviceSchema).optional(),
    reservationsLit: zod_1.z.array(schema_1.reservationLitSchema).optional(),
    transfertsDepart: zod_1.z.array(schema_1.transfertSchema).optional(),
    transfertsArrivee: zod_1.z.array(schema_1.transfertSchema).optional(),
});
