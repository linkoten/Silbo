"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentSchema = exports.UpdateMedicamentSchema = exports.UpdateEtablissementSchema = exports.UpdateReservationLitSchema = exports.UpdateLitSchema = exports.UpdatePriseEnChargeSchema = exports.UpdateMaterielSchema = exports.UpdateTransfertSchema = exports.UpdateServiceSchema = exports.UpdatePersonnelSchema = exports.UpdatePatientSchema = exports.UpdateUserSchema = exports.CreateDocumentSchema = exports.CreateMedicamentSchema = exports.CreateEtablissementSchema = exports.CreateReservationLitSchema = exports.CreateLitSchema = exports.CreatePriseEnChargeSchema = exports.CreateMaterielSchema = exports.CreateTransfertSchema = exports.CreateServiceSchema = exports.CreatePersonnelSchema = exports.CreatePatientSchema = exports.CreateUserSchema = exports.DocumentSchema = exports.MedicamentSchema = exports.EtablissementSchema = exports.ReservationLitSchema = exports.LitSchema = exports.PriseEnChargeSchema = exports.MaterielSchema = exports.TransfertSchema = exports.ServiceSchema = exports.PersonnelSchema = exports.PatientSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// Schéma pour User
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }),
    name: zod_1.z.string().nullable(),
});
// Schéma pour Patient
exports.PatientSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom est requis" }),
    prenom: zod_1.z.string().min(1, { message: "Le prénom est requis" }),
    dateNaissance: zod_1.z.coerce.date(),
    adresse: zod_1.z.string().nullable(),
    telephone: zod_1.z.string().nullable(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).nullable(),
    numeroSecu: zod_1.z.string().nullable(),
    groupeSanguin: zod_1.z.string().nullable(),
    allergie: zod_1.z.string().nullable(),
    antecedents: zod_1.z.string().nullable(),
    dateAdmission: zod_1.z.coerce.date().nullable(),
    dateSortie: zod_1.z.coerce.date().nullable(),
    statut: zod_1.z.string().nullable().default("Hospitalisé"),
});
// Schéma pour Personnel
exports.PersonnelSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom est requis" }),
    prenom: zod_1.z.string().min(1, { message: "Le prénom est requis" }),
    dateNaissance: zod_1.z.coerce.date().nullable(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).nullable(),
    telephone: zod_1.z.string().nullable(),
    profession: zod_1.z.string().min(1, { message: "La profession est requise" }),
    specialite: zod_1.z.string().nullable(),
    matricule: zod_1.z.string().nullable(),
    serviceId: zod_1.z.string().nullable(),
    dateEmbauche: zod_1.z.coerce.date().nullable(),
    statut: zod_1.z.string().nullable().default("Actif"),
});
// Schéma pour Service
exports.ServiceSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du service est requis" }),
    description: zod_1.z.string().nullable(),
    etablissementId: zod_1.z.string().min(1, { message: "L'établissement est requis" }),
    etage: zod_1.z.string().nullable(),
    aile: zod_1.z.string().nullable(),
    capacite: zod_1.z.number().int().nonnegative().default(0),
    statut: zod_1.z.string().nullable().default("Actif"),
    specialite: zod_1.z.string().nullable(),
    responsableId: zod_1.z.string().nullable(),
});
// Schéma pour Transfert
exports.TransfertSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    serviceDepartId: zod_1.z
        .string()
        .min(1, { message: "Le service de départ est requis" }),
    serviceArriveeId: zod_1.z
        .string()
        .min(1, { message: "Le service d'arrivée est requis" }),
    patientId: zod_1.z.string().min(1, { message: "Le patient est requis" }),
    motif: zod_1.z.string().nullable(),
    date: zod_1.z.coerce.date().default(() => new Date()),
    statut: zod_1.z.string().nullable().default("Planifié"),
    autorisePar: zod_1.z.string().nullable(),
    realiseePar: zod_1.z.string().nullable(),
});
// Schéma pour Materiel
exports.MaterielSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du matériel est requis" }),
    description: zod_1.z.string().nullable(),
    quantite: zod_1.z.number().int().positive().default(1),
    type: zod_1.z.string().nullable(),
    marque: zod_1.z.string().nullable(),
    modele: zod_1.z.string().nullable(),
    numeroSerie: zod_1.z.string().nullable(),
    dateAchat: zod_1.z.coerce.date().nullable(),
    dateMaintenance: zod_1.z.coerce.date().nullable(),
    statut: zod_1.z.string().nullable().default("En Service"),
    serviceId: zod_1.z.string().nullable(),
});
// Schéma pour PriseEnCharge
exports.PriseEnChargeSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    personnelId: zod_1.z.string().min(1, { message: "Le personnel est requis" }),
    patientId: zod_1.z.string().min(1, { message: "Le patient est requis" }),
    dateDebut: zod_1.z.coerce.date().default(() => new Date()),
    dateFin: zod_1.z.coerce.date().nullable(),
    description: zod_1.z.string().nullable(),
    diagnostic: zod_1.z.string().nullable(),
    traitement: zod_1.z.string().nullable(),
    notes: zod_1.z.string().nullable(),
});
// Schéma pour Lit
exports.LitSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    numeroLit: zod_1.z.string().min(1, { message: "Le numéro du lit est requis" }),
    type: zod_1.z.string().nullable(),
    statut: zod_1.z.string().nullable().default("Disponible"),
    serviceId: zod_1.z.string().min(1, { message: "Le service est requis" }),
    chambre: zod_1.z.string().nullable(),
    etage: zod_1.z.string().nullable(),
    patientId: zod_1.z.string().nullable(),
});
// Schéma pour ReservationLit
exports.ReservationLitSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    patientId: zod_1.z.string().min(1, { message: "Le patient est requis" }),
    litId: zod_1.z.string().min(1, { message: "Le lit est requis" }),
    dateArrivee: zod_1.z.coerce.date(),
    dateDepart: zod_1.z.coerce.date(),
    etablissementDestinationId: zod_1.z.string().nullable(),
});
// Schéma pour Etablissement
exports.EtablissementSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom de l'établissement est requis" }),
    adresse: zod_1.z.string().min(1, { message: "L'adresse est requise" }),
    capacite: zod_1.z.number().int().nonnegative().default(0),
    telephone: zod_1.z.string().nullable(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).nullable(),
    siteWeb: zod_1.z.string().url({ message: "URL invalide" }).nullable(),
    codePostal: zod_1.z.string().nullable(),
    ville: zod_1.z.string().nullable(),
    pays: zod_1.z.string().default("France"),
    statut: zod_1.z.string().nullable().default("Actif"),
    typology: zod_1.z.string().nullable(),
});
// Schéma pour Medicament
exports.MedicamentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du médicament est requis" }),
    dosage: zod_1.z.string().nullable(),
    description: zod_1.z.string().nullable(),
    categorie: zod_1.z.string().nullable(),
    fabricant: zod_1.z.string().nullable(),
    stockActuel: zod_1.z.number().int().nonnegative().default(0),
    stockMinimum: zod_1.z.number().int().nonnegative().default(5),
    datePeremption: zod_1.z.coerce.date().nullable(),
});
// Schéma pour Document
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    titre: zod_1.z.string().min(1, { message: "Le titre est requis" }),
    typeDocument: zod_1.z
        .string()
        .min(1, { message: "Le type de document est requis" }),
    contenu: zod_1.z.string().nullable(),
    url: zod_1.z.string().nullable(),
    patientId: zod_1.z.string().nullable(),
    personnelId: zod_1.z.string().nullable(),
    serviceId: zod_1.z.string().nullable(),
});
// Schémas pour les créations (sans id obligatoire)
exports.CreateUserSchema = exports.UserSchema.omit({ id: true });
exports.CreatePatientSchema = exports.PatientSchema.omit({ id: true });
exports.CreatePersonnelSchema = exports.PersonnelSchema.omit({ id: true });
exports.CreateServiceSchema = exports.ServiceSchema.omit({ id: true });
exports.CreateTransfertSchema = exports.TransfertSchema.omit({ id: true });
exports.CreateMaterielSchema = exports.MaterielSchema.omit({ id: true });
exports.CreatePriseEnChargeSchema = exports.PriseEnChargeSchema.omit({ id: true });
exports.CreateLitSchema = exports.LitSchema.omit({ id: true });
exports.CreateReservationLitSchema = exports.ReservationLitSchema.omit({
    id: true,
});
exports.CreateEtablissementSchema = exports.EtablissementSchema.omit({ id: true });
exports.CreateMedicamentSchema = exports.MedicamentSchema.omit({ id: true });
exports.CreateDocumentSchema = exports.DocumentSchema.omit({ id: true });
// Schémas pour les mises à jour (tout optionnel sauf id)
exports.UpdateUserSchema = exports.UserSchema.partial().required({ id: true });
exports.UpdatePatientSchema = exports.PatientSchema.partial().required({
    id: true,
});
exports.UpdatePersonnelSchema = exports.PersonnelSchema.partial().required({
    id: true,
});
exports.UpdateServiceSchema = exports.ServiceSchema.partial().required({
    id: true,
});
exports.UpdateTransfertSchema = exports.TransfertSchema.partial().required({
    id: true,
});
exports.UpdateMaterielSchema = exports.MaterielSchema.partial().required({
    id: true,
});
exports.UpdatePriseEnChargeSchema = exports.PriseEnChargeSchema.partial().required({ id: true });
exports.UpdateLitSchema = exports.LitSchema.partial().required({ id: true });
exports.UpdateReservationLitSchema = exports.ReservationLitSchema.partial().required({ id: true });
exports.UpdateEtablissementSchema = exports.EtablissementSchema.partial().required({ id: true });
exports.UpdateMedicamentSchema = exports.MedicamentSchema.partial().required({
    id: true,
});
exports.UpdateDocumentSchema = exports.DocumentSchema.partial().required({
    id: true,
});
