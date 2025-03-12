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
describe("Lit Schema Validation", () => {
    const validLitData = {
        numeroLit: "A101",
        type: "Simple",
        statut: "Disponible",
        serviceId: "507f1f77bcf86cd799439011",
        chambre: "101",
        etage: "1",
        patientId: null,
    };
    test("validates a correct lit", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.LitSchema, validLitData);
        expect(result).toEqual(validLitData);
    });
    test("validates a lit with id", async () => {
        const litWithId = Object.assign(Object.assign({}, validLitData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.LitSchema, litWithId);
        expect(result).toEqual(litWithId);
    });
    test("fails with missing required fields", async () => {
        const { numeroLit } = validLitData, invalidLit = __rest(validLitData, ["numeroLit"]);
        await expect((0, validation_utils_1.validateData)(schema_1.LitSchema, invalidLit)).rejects.toThrow();
    });
    test("fails with empty numeroLit", async () => {
        const invalidLit = Object.assign(Object.assign({}, validLitData), { numeroLit: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.LitSchema, invalidLit)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateLitSchema rejects id field", async () => {
        const litWithId = Object.assign(Object.assign({}, validLitData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateLitSchema, litWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateLitSchema requires id field", async () => {
        const litWithoutId = { numeroLit: "B202" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateLitSchema, litWithoutId)).rejects.toThrow();
    });
    test("UpdateLitSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            numeroLit: "B202",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateLitSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
