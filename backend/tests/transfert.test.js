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
describe("Transfert Schema", () => {
    const validTransfertData = {
        patientId: "507f1f77bcf86cd799439011",
        serviceDepartId: "507f1f77bcf86cd799439022",
        serviceArriveeId: "507f1f77bcf86cd799439033",
        dateTransfert: new Date("2023-02-10T08:15:00Z"),
        etablissementDepartId: "507f1f77bcf86cd799439044",
        etablissementArriveeId: "507f1f77bcf86cd799439055",
    };
    test("validates a correct transfert", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.transfertSchema, validTransfertData);
        expect(result).toEqual(validTransfertData);
    });
    test("validates a transfert with id", async () => {
        const transfertWithId = Object.assign(Object.assign({}, validTransfertData), { id: "507f1f77bcf86cd799439066" });
        const result = await (0, validation_utils_1.validateData)(schema_1.transfertSchema, transfertWithId);
        expect(result).toEqual(transfertWithId);
    });
    test("handles string date conversion", async () => {
        const transfertWithStringDate = Object.assign(Object.assign({}, validTransfertData), { dateTransfert: "2023-02-10T08:15:00Z" });
        const result = await (0, validation_utils_1.validateData)(schema_1.transfertSchema, transfertWithStringDate);
        expect(result.dateTransfert).toBeInstanceOf(Date);
    });
    test("fails with missing required fields", async () => {
        const { patientId } = validTransfertData, invalidTransfert = __rest(validTransfertData, ["patientId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.transfertSchema, invalidTransfert)).rejects.toThrow();
    });
    // Create schema tests
    test("createTransfertSchema rejects id field", async () => {
        const transfertWithId = Object.assign(Object.assign({}, validTransfertData), { id: "507f1f77bcf86cd799439066" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createTransfertSchema, transfertWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updateTransfertSchema requires id field", async () => {
        const transfertWithoutId = {
            dateTransfert: new Date("2023-02-11T10:00:00Z"),
        };
        await expect((0, validation_utils_1.validateData)(schema_1.updateTransfertSchema, transfertWithoutId)).rejects.toThrow();
    });
    test("updateTransfertSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439066",
            serviceArriveeId: "507f1f77bcf86cd799439077",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updateTransfertSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
