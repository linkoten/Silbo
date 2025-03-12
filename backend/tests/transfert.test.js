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
describe("Transfert Schema Validation", () => {
    const validTransfertData = {
        patientId: "507f1f77bcf86cd799439011",
        serviceDepartId: "507f1f77bcf86cd799439022",
        serviceArriveeId: "507f1f77bcf86cd799439033",
        date: new Date("2023-02-10T08:15:00Z"),
        motif: "Besoin d'une prise en charge spécialisée",
        statut: "Planifié",
        autorisePar: "507f1f77bcf86cd799439044",
        realiseePar: "507f1f77bcf86cd799439055",
    };
    test("validates a correct transfert", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.TransfertSchema, validTransfertData);
        expect(result).toEqual(validTransfertData);
    });
    test("validates a transfert with id", async () => {
        const transfertWithId = Object.assign(Object.assign({}, validTransfertData), { id: "507f1f77bcf86cd799439066" });
        const result = await (0, validation_utils_1.validateData)(schema_1.TransfertSchema, transfertWithId);
        expect(result).toEqual(transfertWithId);
    });
    test("handles string date conversion", async () => {
        const transfertWithStringDate = Object.assign(Object.assign({}, validTransfertData), { date: "2023-02-10T08:15:00Z" });
        const result = await (0, validation_utils_1.validateData)(schema_1.TransfertSchema, transfertWithStringDate);
        expect(result.date).toBeInstanceOf(Date);
    });
    test("fails with missing required fields", async () => {
        const { patientId } = validTransfertData, invalidTransfert = __rest(validTransfertData, ["patientId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.TransfertSchema, invalidTransfert)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateTransfertSchema rejects id field", async () => {
        const transfertWithId = Object.assign(Object.assign({}, validTransfertData), { id: "507f1f77bcf86cd799439066" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateTransfertSchema, transfertWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateTransfertSchema requires id field", async () => {
        const transfertWithoutId = {
            date: new Date("2023-02-11T10:00:00Z"),
        };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateTransfertSchema, transfertWithoutId)).rejects.toThrow();
    });
    test("UpdateTransfertSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439066",
            statut: "En cours",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateTransfertSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
