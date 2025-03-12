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
describe("Medicament Schema Validation", () => {
    const validMedicamentData = {
        nom: "Paracétamol",
        dosage: "500mg",
        description: "Analgésique et antipyrétique",
        categorie: "Analgésique",
        fabricant: "Laboratoire PharmaCo",
        stockActuel: 200,
        stockMinimum: 50,
        datePeremption: new Date("2025-01-15"),
    };
    test("validates a correct medicament", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.MedicamentSchema, validMedicamentData);
        expect(result).toEqual(validMedicamentData);
    });
    test("validates a medicament with id", async () => {
        const medicamentWithId = Object.assign(Object.assign({}, validMedicamentData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.MedicamentSchema, medicamentWithId);
        expect(result).toEqual(medicamentWithId);
    });
    test("fails with negative stockActuel", async () => {
        const invalidMedicament = Object.assign(Object.assign({}, validMedicamentData), { stockActuel: -10 });
        await expect((0, validation_utils_1.validateData)(schema_1.MedicamentSchema, invalidMedicament)).rejects.toThrow();
    });
    test("fails with missing required fields", async () => {
        const { nom } = validMedicamentData, invalidMedicament = __rest(validMedicamentData, ["nom"]);
        await expect((0, validation_utils_1.validateData)(schema_1.MedicamentSchema, invalidMedicament)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateMedicamentSchema rejects id field", async () => {
        const medicamentWithId = Object.assign(Object.assign({}, validMedicamentData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateMedicamentSchema, medicamentWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateMedicamentSchema requires id field", async () => {
        const medicamentWithoutId = { stockActuel: 300 };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateMedicamentSchema, medicamentWithoutId)).rejects.toThrow();
    });
    test("UpdateMedicamentSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            stockActuel: 150,
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateMedicamentSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
