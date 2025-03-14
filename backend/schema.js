"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDocumentSchema = exports.UpdateMedicamentSchema = exports.UpdateEtablissementSchema = exports.UpdateReservationLitSchema = exports.UpdateLitSchema = exports.UpdatePriseEnChargeSchema = exports.UpdateMaterielSchema = exports.UpdateTransfertSchema = exports.UpdateServiceSchema = exports.UpdatePersonnelSchema = exports.UpdatePatientSchema = exports.UpdateUserSchema = exports.CreateDocumentSchema = exports.CreateMedicamentSchema = exports.CreateEtablissementSchema = exports.CreateReservationLitSchema = exports.CreateLitSchema = exports.CreatePriseEnChargeSchema = exports.CreateMaterielSchema = exports.CreateTransfertSchema = exports.CreateServiceSchema = exports.CreatePersonnelSchema = exports.CreatePatientSchema = exports.CreateUserSchema = exports.DocumentSchema = exports.MedicamentSchema = exports.EtablissementSchema = exports.ReservationLitSchema = exports.LitSchema = exports.PriseEnChargeSchema = exports.MaterielSchema = exports.TransfertSchema = exports.ServiceSchema = exports.PersonnelSchema = exports.PatientSchema = exports.UserSchema = void 0;
const zod_1 = require("zod");
// Schéma pour User
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }),
    name: zod_1.z.string().optional(),
});
// Schéma pour Patient
exports.PatientSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom est requis" }),
    prenom: zod_1.z.string().min(1, { message: "Le prénom est requis" }),
    dateNaissance: zod_1.z.coerce.date(),
    adresse: zod_1.z.string().optional(),
    telephone: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).optional(),
    numeroSecu: zod_1.z.string().optional(),
    groupeSanguin: zod_1.z.string().optional(),
    allergie: zod_1.z.string().optional(),
    antecedents: zod_1.z.string().optional(),
    dateAdmission: zod_1.z.coerce.date().optional(),
    dateSortie: zod_1.z.coerce.date().optional(),
    statut: zod_1.z.string().default("Hospitalisé"),
});
// Schéma pour Personnel
exports.PersonnelSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom est requis" }),
    prenom: zod_1.z.string().min(1, { message: "Le prénom est requis" }),
    dateNaissance: zod_1.z.coerce.date().optional(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).optional(),
    telephone: zod_1.z.string().optional(),
    profession: zod_1.z.string().min(1, { message: "La profession est requise" }),
    specialite: zod_1.z.string().optional(),
    matricule: zod_1.z.string().optional(),
    serviceId: zod_1.z.string().optional(),
    dateEmbauche: zod_1.z.coerce.date().optional(),
    statut: zod_1.z.string().default("Actif"),
});
// Schéma pour Service
exports.ServiceSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du service est requis" }),
    description: zod_1.z.string().optional(),
    etablissementId: zod_1.z.string().min(1, { message: "L'établissement est requis" }),
    etage: zod_1.z.string().optional(),
    aile: zod_1.z.string().optional(),
    capacite: zod_1.z.number().int().nonnegative().default(0),
    statut: zod_1.z.string().default("Actif"),
    specialite: zod_1.z.string().optional(),
    responsableId: zod_1.z.string().optional(),
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
    motif: zod_1.z.string().optional(),
    date: zod_1.z.coerce.date().default(() => new Date()),
    statut: zod_1.z.string().default("Planifié"),
    autorisePar: zod_1.z.string().optional(),
    realiseePar: zod_1.z.string().optional(),
});
// Schéma pour Materiel
exports.MaterielSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du matériel est requis" }),
    description: zod_1.z.string().optional(),
    quantite: zod_1.z.number().int().positive().default(1),
    type: zod_1.z.string().optional(),
    marque: zod_1.z.string().optional(),
    modele: zod_1.z.string().optional(),
    numeroSerie: zod_1.z.string().optional(),
    dateAchat: zod_1.z.coerce.date().optional(),
    dateMaintenance: zod_1.z.coerce.date().optional(),
    statut: zod_1.z.string().default("En Service"),
    serviceId: zod_1.z.string().optional(),
});
// Schéma pour PriseEnCharge
exports.PriseEnChargeSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    personnelId: zod_1.z.string().min(1, { message: "Le personnel est requis" }),
    patientId: zod_1.z.string().min(1, { message: "Le patient est requis" }),
    dateDebut: zod_1.z.coerce.date().default(() => new Date()),
    dateFin: zod_1.z.coerce.date().optional(),
    description: zod_1.z.string().optional(),
    diagnostic: zod_1.z.string().optional(),
    traitement: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
});
// Schéma pour Lit
exports.LitSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    numeroLit: zod_1.z.string().min(1, { message: "Le numéro du lit est requis" }),
    type: zod_1.z.string().optional(),
    statut: zod_1.z.string().default("Disponible"),
    serviceId: zod_1.z.string().min(1, { message: "Le service est requis" }),
    chambre: zod_1.z.string().optional(),
    etage: zod_1.z.string().optional(),
    patientId: zod_1.z.string().optional(),
});
// Schéma pour ReservationLit
exports.ReservationLitSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    patientId: zod_1.z.string().min(1, { message: "Le patient est requis" }),
    litId: zod_1.z.string().min(1, { message: "Le lit est requis" }),
    dateArrivee: zod_1.z.coerce.date(),
    dateDepart: zod_1.z.coerce.date(),
    etablissementDestinationId: zod_1.z.string().optional(),
});
// Schéma pour Etablissement
exports.EtablissementSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom de l'établissement est requis" }),
    adresse: zod_1.z.string().min(1, { message: "L'adresse est requise" }),
    capacite: zod_1.z.number().int().nonnegative().default(0),
    telephone: zod_1.z.string().optional(),
    email: zod_1.z.string().email({ message: "Format d'email invalide" }).optional(),
    siteWeb: zod_1.z.string().url({ message: "URL invalide" }).optional(),
    codePostal: zod_1.z.string().optional(),
    ville: zod_1.z.string().optional(),
    pays: zod_1.z.string().default("France"),
    statut: zod_1.z.string().default("Actif"),
    typology: zod_1.z.string().optional(),
});
// Schéma pour Medicament
exports.MedicamentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    nom: zod_1.z.string().min(1, { message: "Le nom du médicament est requis" }),
    dosage: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    categorie: zod_1.z.string().optional(),
    fabricant: zod_1.z.string().optional(),
    stockActuel: zod_1.z.number().int().nonnegative().default(0),
    stockMinimum: zod_1.z.number().int().nonnegative().default(5),
    datePeremption: zod_1.z.coerce.date().optional(),
});
// Schéma pour Document
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    titre: zod_1.z.string().min(1, { message: "Le titre est requis" }),
    typeDocument: zod_1.z
        .string()
        .min(1, { message: "Le type de document est requis" }),
    contenu: zod_1.z.string().optional(),
    url: zod_1.z.string().optional(),
    patientId: zod_1.z.string().optional(),
    personnelId: zod_1.z.string().optional(),
    serviceId: zod_1.z.string().optional(),
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
