"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("../lib/schema");
describe("Etablissement Schema Validation", () => {
    const validEtablissementData = {
        nom: "Hôpital Central",
        adresse: "123 Avenue de la Santé",
        capacite: 500, // Ajout du champ capacite
        telephone: "0123456789",
        email: "contact@hopital.fr",
        codePostal: "75000",
        ville: "Paris",
        pays: "France",
        statut: "Actif",
        typology: "CHU",
        siteWeb: "https://hopital-central.fr",
    };
    test("validates a correct etablissement", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.EtablissementSchema, validEtablissementData);
        expect(result).toEqual(validEtablissementData);
    });
    test("validates an etablissement with id", async () => {
        const etablissementWithId = Object.assign(Object.assign({}, validEtablissementData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.EtablissementSchema, etablissementWithId);
        expect(result).toEqual(etablissementWithId);
    });
    test("fails with missing required fields", async () => {
        const { nom } = validEtablissementData, invalidEtablissement = __rest(validEtablissementData, ["nom"]);
        await expect((0, validation_utils_1.validateData)(schema_1.EtablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    test("fails with empty nom", async () => {
        const invalidEtablissement = Object.assign(Object.assign({}, validEtablissementData), { nom: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.EtablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    test("validates with default capacite", async () => {
        const { capacite } = validEtablissementData, etablissementWithoutCapacite = __rest(validEtablissementData, ["capacite"]);
        const result = await (0, validation_utils_1.validateData)(schema_1.EtablissementSchema, etablissementWithoutCapacite);
        expect(result.capacite).toBe(0); // Vérification de la valeur par défaut
    });
    test("fails with negative capacite", async () => {
        const invalidEtablissement = Object.assign(Object.assign({}, validEtablissementData), { capacite: -10 });
        await expect((0, validation_utils_1.validateData)(schema_1.EtablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    test("validates with valid email", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.EtablissementSchema, validEtablissementData);
        expect(result.email).toBe("contact@hopital.fr");
    });
    test("fails with invalid email", async () => {
        const invalidEtablissement = Object.assign(Object.assign({}, validEtablissementData), { email: "not-an-email" });
        await expect((0, validation_utils_1.validateData)(schema_1.EtablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateEtablissementSchema rejects id field", async () => {
        const etablissementWithId = Object.assign(Object.assign({}, validEtablissementData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateEtablissementSchema, etablissementWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateEtablissementSchema requires id field", async () => {
        const etablissementWithoutId = { nom: "Nouvel Hôpital" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateEtablissementSchema, etablissementWithoutId)).rejects.toThrow();
    });
    test("UpdateEtablissementSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            adresse: "Nouvelle adresse",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateEtablissementSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
    test("UpdateEtablissementSchema allows capacite update", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            capacite: 650,
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateEtablissementSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
