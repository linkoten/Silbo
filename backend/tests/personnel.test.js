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
describe("Personnel Schema", () => {
    const validPersonnelData = {
        nom: "Martin",
        prenom: "Sophie",
        profession: "Médecin",
        serviceId: "507f1f77bcf86cd799439011",
    };
    test("validates a correct personnel", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.personnelSchema, validPersonnelData);
        expect(result).toEqual(validPersonnelData);
    });
    test("validates a personnel with id", async () => {
        const personnelWithId = Object.assign(Object.assign({}, validPersonnelData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.personnelSchema, personnelWithId);
        expect(result).toEqual(personnelWithId);
    });
    test("fails with missing required fields", async () => {
        const { profession } = validPersonnelData, invalidPersonnel = __rest(validPersonnelData, ["profession"]);
        await expect((0, validation_utils_1.validateData)(schema_1.personnelSchema, invalidPersonnel)).rejects.toThrow();
    });
    test("fails with invalid serviceId format", async () => {
        const invalidPersonnel = Object.assign(Object.assign({}, validPersonnelData), { serviceId: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.personnelSchema, invalidPersonnel)).rejects.toThrow();
    });
    // Create schema tests
    test("createPersonnelSchema rejects id field", async () => {
        const personnelWithId = Object.assign(Object.assign({}, validPersonnelData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createPersonnelSchema, personnelWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updatePersonnelSchema requires id field", async () => {
        const personnelWithoutId = { nom: "Nouveau Nom" };
        await expect((0, validation_utils_1.validateData)(schema_1.updatePersonnelSchema, personnelWithoutId)).rejects.toThrow();
    });
    test("updatePersonnelSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            profession: "Chirurgien",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updatePersonnelSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
