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
describe("Service Schema Validation", () => {
    const validServiceData = {
        nom: "Cardiologie",
        etablissementId: "507f1f77bcf86cd799439011",
        capacite: 20, // Ajout du champ capacite
        description: "Service de cardiologie",
        etage: "3",
        aile: "Est",
        statut: "Actif",
        specialite: "Cardiologie",
        responsableId: null,
    };
    test("validates a correct service", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.ServiceSchema, validServiceData);
        expect(result).toEqual(validServiceData);
    });
    test("validates a service with id", async () => {
        const serviceWithId = Object.assign(Object.assign({}, validServiceData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.ServiceSchema, serviceWithId);
        expect(result).toEqual(serviceWithId);
    });
    test("fails with missing required fields", async () => {
        const { etablissementId } = validServiceData, invalidService = __rest(validServiceData, ["etablissementId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.ServiceSchema, invalidService)).rejects.toThrow();
    });
    test("fails with empty nom", async () => {
        const invalidService = Object.assign(Object.assign({}, validServiceData), { nom: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.ServiceSchema, invalidService)).rejects.toThrow();
    });
    test("validates with default capacite", async () => {
        const { capacite } = validServiceData, serviceWithoutCapacite = __rest(validServiceData, ["capacite"]);
        const result = await (0, validation_utils_1.validateData)(schema_1.ServiceSchema, serviceWithoutCapacite);
        expect(result.capacite).toBe(0); // Vérification de la valeur par défaut
    });
    test("fails with negative capacite", async () => {
        const invalidService = Object.assign(Object.assign({}, validServiceData), { capacite: -5 });
        await expect((0, validation_utils_1.validateData)(schema_1.ServiceSchema, invalidService)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateServiceSchema rejects id field", async () => {
        const serviceWithId = Object.assign(Object.assign({}, validServiceData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateServiceSchema, serviceWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateServiceSchema requires id field", async () => {
        const serviceWithoutId = { nom: "Nouveau Service" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateServiceSchema, serviceWithoutId)).rejects.toThrow();
    });
    test("UpdateServiceSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            nom: "Neurologie",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateServiceSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
    test("UpdateServiceSchema allows capacite update", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            capacite: 30,
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateServiceSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
