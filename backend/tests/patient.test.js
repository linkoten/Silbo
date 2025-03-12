"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("../lib/schema");
describe("Patient Schema Validation", () => {
    const validPatientData = {
        nom: "Dupont",
        prenom: "Jean",
        dateNaissance: new Date("1980-01-01"),
        adresse: "123 Rue des Patients",
        telephone: "0612345678",
        email: "jean.dupont@exemple.fr",
        numeroSecu: "180018001800180",
        groupeSanguin: "A+",
        allergie: "Pénicilline",
        antecedents: "Hypertension",
        dateAdmission: new Date("2023-01-01"),
        statut: "Hospitalisé",
    };
    test("validates a correct patient", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.PatientSchema, validPatientData);
        expect(result).toEqual(validPatientData);
    });
    test("validates a patient with id", async () => {
        const patientWithId = Object.assign(Object.assign({}, validPatientData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.PatientSchema, patientWithId);
        expect(result).toEqual(patientWithId);
    });
    test("handles string date conversion", async () => {
        const patientWithStringDate = Object.assign(Object.assign({}, validPatientData), { dateNaissance: "1980-01-01" });
        const result = await (0, validation_utils_1.validateData)(schema_1.PatientSchema, patientWithStringDate);
        expect(result.dateNaissance).toBeInstanceOf(Date);
        expect(result.dateNaissance.toISOString().split("T")[0]).toBe("1980-01-01");
    });
    test("fails with missing required fields", async () => {
        const invalidPatient = { nom: "Dupont" };
        await expect((0, validation_utils_1.validateData)(schema_1.PatientSchema, invalidPatient)).rejects.toThrow();
    });
    // Create schema tests
    test("CreatePatientSchema rejects id field", async () => {
        const patientWithId = Object.assign(Object.assign({}, validPatientData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreatePatientSchema, patientWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdatePatientSchema requires id field", async () => {
        const patientWithoutId = { nom: "Nouveau Nom" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdatePatientSchema, patientWithoutId)).rejects.toThrow();
    });
    test("UpdatePatientSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439011",
            nom: "Nouveau Nom",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdatePatientSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
