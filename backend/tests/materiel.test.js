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
describe("Materiel Schema Validation", () => {
    const validMaterielData = {
        nom: "Scanner IRM",
        description: "Scanner à imagerie par résonance magnétique",
        quantite: 5,
        type: "Médical",
        marque: "MedTech",
        modele: "IRM-500",
        numeroSerie: "MT12345",
        dateAchat: new Date("2022-01-15"),
        dateMaintenance: new Date("2023-01-15"),
        statut: "En Service",
        serviceId: "507f1f77bcf86cd799439011",
    };
    test("validates a correct materiel", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.MaterielSchema, validMaterielData);
        expect(result).toEqual(validMaterielData);
    });
    test("validates a materiel with id", async () => {
        const materielWithId = Object.assign(Object.assign({}, validMaterielData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.MaterielSchema, materielWithId);
        expect(result).toEqual(materielWithId);
    });
    test("fails with negative quantite", async () => {
        const invalidMateriel = Object.assign(Object.assign({}, validMaterielData), { quantite: -1 });
        await expect((0, validation_utils_1.validateData)(schema_1.MaterielSchema, invalidMateriel)).rejects.toThrow();
    });
    test("fails with non-integer quantite", async () => {
        const invalidMateriel = Object.assign(Object.assign({}, validMaterielData), { quantite: 5.5 });
        await expect((0, validation_utils_1.validateData)(schema_1.MaterielSchema, invalidMateriel)).rejects.toThrow();
    });
    test("fails with missing required fields", async () => {
        const { nom } = validMaterielData, invalidMateriel = __rest(validMaterielData, ["nom"]);
        await expect((0, validation_utils_1.validateData)(schema_1.MaterielSchema, invalidMateriel)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateMaterielSchema rejects id field", async () => {
        const materielWithId = Object.assign(Object.assign({}, validMaterielData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateMaterielSchema, materielWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateMaterielSchema requires id field", async () => {
        const materielWithoutId = { quantite: 10 };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateMaterielSchema, materielWithoutId)).rejects.toThrow();
    });
    test("UpdateMaterielSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            quantite: 10,
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateMaterielSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
