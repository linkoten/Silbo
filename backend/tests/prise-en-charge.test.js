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
describe("PriseEnCharge Schema Validation", () => {
    const validPriseEnChargeData = {
        patientId: "507f1f77bcf86cd799439011",
        personnelId: "507f1f77bcf86cd799439022",
        dateDebut: new Date("2023-01-15T10:30:00Z"),
        dateFin: new Date("2023-01-20T16:00:00Z"),
        description: "Prise en charge post-opératoire",
        diagnostic: "Récupération normale",
        traitement: "Analgésiques et physiothérapie",
        notes: "Patient répond bien au traitement",
    };
    test("validates a correct priseEnCharge", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.PriseEnChargeSchema, validPriseEnChargeData);
        expect(result).toEqual(validPriseEnChargeData);
    });
    test("validates a priseEnCharge with id", async () => {
        const priseEnChargeWithId = Object.assign(Object.assign({}, validPriseEnChargeData), { id: "507f1f77bcf86cd799439033" });
        const result = await (0, validation_utils_1.validateData)(schema_1.PriseEnChargeSchema, priseEnChargeWithId);
        expect(result).toEqual(priseEnChargeWithId);
    });
    test("handles string date conversion", async () => {
        const priseEnChargeWithStringDate = Object.assign(Object.assign({}, validPriseEnChargeData), { dateDebut: "2023-01-15T10:30:00Z" });
        const result = await (0, validation_utils_1.validateData)(schema_1.PriseEnChargeSchema, priseEnChargeWithStringDate);
        expect(result.dateDebut).toBeInstanceOf(Date);
    });
    test("fails with missing required fields", async () => {
        const { patientId } = validPriseEnChargeData, invalidPriseEnCharge = __rest(validPriseEnChargeData, ["patientId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.PriseEnChargeSchema, invalidPriseEnCharge)).rejects.toThrow();
    });
    // Create schema tests
    test("CreatePriseEnChargeSchema rejects id field", async () => {
        const priseEnChargeWithId = Object.assign(Object.assign({}, validPriseEnChargeData), { id: "507f1f77bcf86cd799439033" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreatePriseEnChargeSchema, priseEnChargeWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdatePriseEnChargeSchema requires id field", async () => {
        const priseEnChargeWithoutId = { personnelId: "507f1f77bcf86cd799439044" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdatePriseEnChargeSchema, priseEnChargeWithoutId)).rejects.toThrow();
    });
    test("UpdatePriseEnChargeSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439033",
            notes: "Nouvelle observation",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdatePriseEnChargeSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
