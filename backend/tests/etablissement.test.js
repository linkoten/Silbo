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
const schema_1 = require("../schema");
const validation_utils_1 = require("../validation-utils");
describe("Etablissement Schema", () => {
    const validEtablissementData = {
        nom: "Hôpital Central",
        adresse: "123 Avenue de la Santé, 75001 Paris",
    };
    test("validates a correct etablissement", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.etablissementSchema, validEtablissementData);
        expect(result).toEqual(validEtablissementData);
    });
    test("validates an etablissement with id", async () => {
        const etablissementWithId = Object.assign(Object.assign({}, validEtablissementData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.etablissementSchema, etablissementWithId);
        expect(result).toEqual(etablissementWithId);
    });
    test("fails with missing required fields", async () => {
        const { nom } = validEtablissementData, invalidEtablissement = __rest(validEtablissementData, ["nom"]);
        await expect((0, validation_utils_1.validateData)(schema_1.etablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    test("fails with empty nom", async () => {
        const invalidEtablissement = Object.assign(Object.assign({}, validEtablissementData), { nom: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.etablissementSchema, invalidEtablissement)).rejects.toThrow();
    });
    // Create schema tests
    test("createEtablissementSchema rejects id field", async () => {
        const etablissementWithId = Object.assign(Object.assign({}, validEtablissementData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createEtablissementSchema, etablissementWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updateEtablissementSchema requires id field", async () => {
        const etablissementWithoutId = { nom: "Nouvel Hôpital" };
        await expect((0, validation_utils_1.validateData)(schema_1.updateEtablissementSchema, etablissementWithoutId)).rejects.toThrow();
    });
    test("updateEtablissementSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            adresse: "Nouvelle adresse",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updateEtablissementSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
