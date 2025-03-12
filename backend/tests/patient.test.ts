import { validateData } from "../validation-utils";
import {
  PatientSchema,
  CreatePatientSchema,
  UpdatePatientSchema,
} from "../lib/schema";

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
    dateSortie: null, // Modifié à null au lieu de date
    statut: "Hospitalisé",
  };

  test("validates a correct patient", async () => {
    const result = await validateData(PatientSchema, validPatientData);
    expect(result).toEqual(validPatientData);
  });

  test("validates a patient with id", async () => {
    const patientWithId = {
      ...validPatientData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(PatientSchema, patientWithId);
    expect(result).toEqual(patientWithId);
  });

  test("handles string date conversion", async () => {
    const patientWithStringDate = {
      ...validPatientData,
      dateNaissance: "1980-01-01",
    };
    const result = await validateData(PatientSchema, patientWithStringDate);
    expect(result.dateNaissance).toBeInstanceOf(Date);
    expect(result.dateNaissance.toISOString().split("T")[0]).toBe("1980-01-01");
  });

  test("fails with missing required fields", async () => {
    const invalidPatient = { nom: "Dupont" };
    await expect(validateData(PatientSchema, invalidPatient)).rejects.toThrow();
  });

  // Create schema tests
  test("CreatePatientSchema rejects id field", async () => {
    const patientWithId = {
      ...validPatientData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreatePatientSchema, patientWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdatePatientSchema requires id field", async () => {
    const patientWithoutId = { nom: "Nouveau Nom" };
    await expect(
      validateData(UpdatePatientSchema, patientWithoutId)
    ).rejects.toThrow();
  });

  test("UpdatePatientSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      nom: "Nouveau Nom",
    };
    const result = await validateData(UpdatePatientSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
