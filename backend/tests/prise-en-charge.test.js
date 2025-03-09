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
describe("PriseEnCharge Schema", () => {
    const validPriseEnChargeData = {
        patientId: "507f1f77bcf86cd799439011",
        personnelId: "507f1f77bcf86cd799439022",
        datePriseEnCharge: new Date("2023-01-15T10:30:00Z"),
    };
    test("validates a correct priseEnCharge", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.priseEnChargeSchema, validPriseEnChargeData);
        expect(result).toEqual(validPriseEnChargeData);
    });
    test("validates a priseEnCharge with id", async () => {
        const priseEnChargeWithId = Object.assign(Object.assign({}, validPriseEnChargeData), { id: "507f1f77bcf86cd799439033" });
        const result = await (0, validation_utils_1.validateData)(schema_1.priseEnChargeSchema, priseEnChargeWithId);
        expect(result).toEqual(priseEnChargeWithId);
    });
    test("handles string date conversion", async () => {
        const priseEnChargeWithStringDate = Object.assign(Object.assign({}, validPriseEnChargeData), { datePriseEnCharge: "2023-01-15T10:30:00Z" });
        const result = await (0, validation_utils_1.validateData)(schema_1.priseEnChargeSchema, priseEnChargeWithStringDate);
        expect(result.datePriseEnCharge).toBeInstanceOf(Date);
    });
    test("fails with missing required fields", async () => {
        const { patientId } = validPriseEnChargeData, invalidPriseEnCharge = __rest(validPriseEnChargeData, ["patientId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.priseEnChargeSchema, invalidPriseEnCharge)).rejects.toThrow();
    });
    test("fails with invalid patientId format", async () => {
        const invalidPriseEnCharge = Object.assign(Object.assign({}, validPriseEnChargeData), { patientId: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.priseEnChargeSchema, invalidPriseEnCharge)).rejects.toThrow();
    });
    // Create schema tests
    test("createPriseEnChargeSchema rejects id field", async () => {
        const priseEnChargeWithId = Object.assign(Object.assign({}, validPriseEnChargeData), { id: "507f1f77bcf86cd799439033" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createPriseEnChargeSchema, priseEnChargeWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updatePriseEnChargeSchema requires id field", async () => {
        const priseEnChargeWithoutId = { personnelId: "507f1f77bcf86cd799439044" };
        await expect((0, validation_utils_1.validateData)(schema_1.updatePriseEnChargeSchema, priseEnChargeWithoutId)).rejects.toThrow();
    });
    test("updatePriseEnChargeSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439033",
            datePriseEnCharge: new Date("2023-01-16T14:00:00Z"),
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updatePriseEnChargeSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
