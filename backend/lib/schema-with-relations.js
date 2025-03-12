"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transfertWithRelationsSchema = exports.patientWithRelationsSchema = exports.personnelWithRelationsSchema = exports.etablissementWithRelationsSchema = exports.serviceWithRelationsSchema = void 0;
const zod_1 = require("zod");
const schema_1 = require("./schema");
// Définition des schémas avec relations circulaires
const BaseServiceSchema = schema_1.ServiceSchema.omit({ etablissement: true });
const BaseEtablissementSchema = schema_1.EtablissementSchema.omit({
    services: true,
});
// Créer les schémas avec relations
exports.serviceWithRelationsSchema = BaseServiceSchema.extend({
    personnels: zod_1.z.array(schema_1.PersonnelSchema).optional(),
    lits: zod_1.z.array(zod_1.z.any()).optional(),
    etablissement: BaseEtablissementSchema.optional(),
    materiels: zod_1.z.array(zod_1.z.any()).optional(),
    transfertsDepart: zod_1.z.array(zod_1.z.any()).optional(),
    transfertsArrivee: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.etablissementWithRelationsSchema = BaseEtablissementSchema.extend({
    services: zod_1.z.array(BaseServiceSchema).optional(),
});
exports.personnelWithRelationsSchema = schema_1.PersonnelSchema.extend({
    service: BaseServiceSchema.optional(),
    prisesEnCharge: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.patientWithRelationsSchema = schema_1.PatientSchema.extend({
    transferts: zod_1.z.array(zod_1.z.any()).optional(),
    prisesEnCharge: zod_1.z.array(zod_1.z.any()).optional(),
    reservationsLit: zod_1.z.array(zod_1.z.any()).optional(),
});
exports.transfertWithRelationsSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    patientId: zod_1.z.string(),
    serviceDepartId: zod_1.z.string(),
    serviceArriveeId: zod_1.z.string(),
    date: zod_1.z.coerce.date(),
    patient: schema_1.PatientSchema.optional(),
    serviceDepart: exports.serviceWithRelationsSchema.optional(),
    serviceArrivee: exports.serviceWithRelationsSchema.optional(),
});
