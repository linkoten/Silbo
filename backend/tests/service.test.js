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
describe("Service Schema", () => {
    const validServiceData = {
        nom: "Cardiologie",
        etablissementId: "507f1f77bcf86cd799439011",
    };
    test("validates a correct service", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.serviceSchema, validServiceData);
        expect(result).toEqual(validServiceData);
    });
    test("validates a service with id", async () => {
        const serviceWithId = Object.assign(Object.assign({}, validServiceData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.serviceSchema, serviceWithId);
        expect(result).toEqual(serviceWithId);
    });
    test("fails with missing required fields", async () => {
        const { etablissementId } = validServiceData, invalidService = __rest(validServiceData, ["etablissementId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.serviceSchema, invalidService)).rejects.toThrow();
    });
    test("fails with empty nom", async () => {
        const invalidService = Object.assign(Object.assign({}, validServiceData), { nom: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.serviceSchema, invalidService)).rejects.toThrow();
    });
    // Create schema tests
    test("createServiceSchema rejects id field", async () => {
        const serviceWithId = Object.assign(Object.assign({}, validServiceData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createServiceSchema, serviceWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updateServiceSchema requires id field", async () => {
        const serviceWithoutId = { nom: "Nouveau Service" };
        await expect((0, validation_utils_1.validateData)(schema_1.updateServiceSchema, serviceWithoutId)).rejects.toThrow();
    });
    test("updateServiceSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            nom: "Neurologie",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updateServiceSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
