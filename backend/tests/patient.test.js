"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const validation_utils_1 = require("../validation-utils");
describe("Patient Schema", () => {
    const validPatientData = {
        nom: "Dupont",
        prenom: "Jean",
        dateNaissance: new Date("1980-01-01"),
        numeroSecu: "180018001800180",
        dossierMedical: "Notes sur le patient",
    };
    test("validates a correct patient", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.patientSchema, validPatientData);
        expect(result).toEqual(validPatientData);
    });
    test("validates a patient with id", async () => {
        const patientWithId = Object.assign(Object.assign({}, validPatientData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.patientSchema, patientWithId);
        expect(result).toEqual(patientWithId);
    });
    test("handles string date conversion", async () => {
        const patientWithStringDate = Object.assign(Object.assign({}, validPatientData), { dateNaissance: "1980-01-01" });
        const result = await (0, validation_utils_1.validateData)(schema_1.patientSchema, patientWithStringDate);
        expect(result.dateNaissance).toBeInstanceOf(Date);
        expect(result.dateNaissance.toISOString().split("T")[0]).toBe("1980-01-01");
    });
    test("fails with missing required fields", async () => {
        const invalidPatient = { nom: "Dupont" };
        await expect((0, validation_utils_1.validateData)(schema_1.patientSchema, invalidPatient)).rejects.toThrow();
    });
    test("fails with invalid numeroSecu format", async () => {
        const invalidPatient = Object.assign(Object.assign({}, validPatientData), { numeroSecu: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.patientSchema, invalidPatient)).rejects.toThrow();
    });
    // Create schema tests
    test("createPatientSchema rejects id field", async () => {
        const patientWithId = Object.assign(Object.assign({}, validPatientData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createPatientSchema, patientWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updatePatientSchema requires id field", async () => {
        const patientWithoutId = { nom: "Nouveau Nom" };
        await expect((0, validation_utils_1.validateData)(schema_1.updatePatientSchema, patientWithoutId)).rejects.toThrow();
    });
    test("updatePatientSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            nom: "Nouveau Nom",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updatePatientSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
