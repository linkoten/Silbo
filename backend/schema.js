"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationLitSchema = exports.createReservationLitSchema = exports.updateTransfertSchema = exports.createTransfertSchema = exports.updatePriseEnChargeSchema = exports.createPriseEnChargeSchema = exports.updateEtablissementSchema = exports.createEtablissementSchema = exports.updateLitSchema = exports.createLitSchema = exports.updateMaterielSchema = exports.createMaterielSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.updatePersonnelSchema = exports.createPersonnelSchema = exports.updatePatientSchema = exports.createPatientSchema = exports.reservationLitSchema = exports.transfertSchema = exports.priseEnChargeSchema = exports.etablissementSchema = exports.litSchema = exports.materielSchema = exports.personnelSchema = exports.serviceSchema = exports.patientSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
// Base ObjectId schema
const objectId = zod_1.z.string().min(1);
// User schema
exports.userSchema = zod_1.z.object({
    id: objectId.optional(), // Optional for creation
    email: zod_1.z.string().email(),
    name: zod_1.z.string().nullable().optional(),
});
// Patient schema
exports.patientSchema = zod_1.z.object({
    id: objectId.optional(),
    nom: zod_1.z.string().min(1),
    prenom: zod_1.z.string().min(1),
    dateNaissance: zod_1.z.coerce.date(), // Utilisation de coerce.date()
    numeroSecu: zod_1.z.string().min(1),
    dossierMedical: zod_1.z.string().nullable().optional(),
});
// Service schema (forward declaration due to circular references)
exports.serviceSchema = zod_1.z.object({
    id: objectId.optional(),
    nom: zod_1.z.string().min(1),
    etablissementId: objectId,
});
// Personnel schema
exports.personnelSchema = zod_1.z.object({
    id: objectId.optional(),
    nom: zod_1.z.string().min(1),
    prenom: zod_1.z.string().min(1),
    profession: zod_1.z.string().min(1),
    serviceId: objectId,
});
// Materiel schema
exports.materielSchema = zod_1.z.object({
    id: objectId.optional(),
    nom: zod_1.z.string().min(1),
    description: zod_1.z.string().nullable().optional(),
    quantite: zod_1.z.number().int().min(0),
    serviceId: objectId,
});
// Lit schema
exports.litSchema = zod_1.z.object({
    id: objectId.optional(),
    numeroLit: zod_1.z.string().min(1),
    serviceId: objectId,
});
// Etablissement schema
exports.etablissementSchema = zod_1.z.object({
    id: objectId.optional(),
    nom: zod_1.z.string().min(1),
    adresse: zod_1.z.string().nullable().optional(),
});
// PriseEnCharge schema
exports.priseEnChargeSchema = zod_1.z.object({
    id: objectId.optional(),
    patientId: objectId,
    personnelId: objectId,
    datePriseEnCharge: zod_1.z.coerce.date(),
});
// Transfert schema
exports.transfertSchema = zod_1.z.object({
    id: objectId.optional(),
    patientId: objectId,
    serviceDepartId: objectId,
    serviceArriveeId: objectId,
    dateTransfert: zod_1.z.coerce.date(),
    etablissementDepartId: objectId.nullable().optional(),
    etablissementArriveeId: objectId.nullable().optional(),
});
// ReservationLit schema
exports.reservationLitSchema = zod_1.z.object({
    id: objectId.optional(),
    patientId: objectId,
    litId: objectId,
    dateArrivee: zod_1.z.coerce.date(),
    dateDepart: zod_1.z.coerce.date(),
    etablissementDestinationId: objectId.nullable().optional(),
});
// Form schemas (for creating/updating)
exports.createPatientSchema = exports.patientSchema.omit({ id: true });
exports.updatePatientSchema = exports.patientSchema
    .partial()
    .required({ id: true });
exports.createPersonnelSchema = exports.personnelSchema.omit({ id: true });
exports.updatePersonnelSchema = exports.personnelSchema
    .partial()
    .required({ id: true });
exports.createServiceSchema = exports.serviceSchema.omit({ id: true });
exports.updateServiceSchema = exports.serviceSchema
    .partial()
    .required({ id: true });
exports.createMaterielSchema = exports.materielSchema.omit({ id: true });
exports.updateMaterielSchema = exports.materielSchema
    .partial()
    .required({ id: true });
exports.createLitSchema = exports.litSchema.omit({ id: true });
exports.updateLitSchema = exports.litSchema.partial().required({ id: true });
exports.createEtablissementSchema = exports.etablissementSchema.omit({ id: true });
exports.updateEtablissementSchema = exports.etablissementSchema
    .partial()
    .required({ id: true });
exports.createPriseEnChargeSchema = exports.priseEnChargeSchema.omit({ id: true });
exports.updatePriseEnChargeSchema = exports.priseEnChargeSchema
    .partial()
    .required({ id: true });
exports.createTransfertSchema = exports.transfertSchema.omit({ id: true });
exports.updateTransfertSchema = exports.transfertSchema
    .partial()
    .required({ id: true });
exports.createReservationLitSchema = exports.reservationLitSchema.omit({
    id: true,
});
exports.updateReservationLitSchema = exports.reservationLitSchema
    .partial()
    .required({ id: true });
