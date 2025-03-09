import {
  patientSchema,
  createPatientSchema,
  updatePatientSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Patient Schema", () => {
  const validPatientData = {
    nom: "Dupont",
    prenom: "Jean",
    dateNaissance: new Date("1980-01-01"),
    numeroSecu: "180018001800180",
    dossierMedical: "Notes sur le patient",
  };

  test("validates a correct patient", async () => {
    const result = await validateData(patientSchema, validPatientData);
    expect(result).toEqual(validPatientData);
  });

  test("validates a patient with id", async () => {
    const patientWithId = {
      ...validPatientData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(patientSchema, patientWithId);
    expect(result).toEqual(patientWithId);
  });

  test("handles string date conversion", async () => {
    const patientWithStringDate = {
      ...validPatientData,
      dateNaissance: "1980-01-01",
    };
    const result = await validateData(patientSchema, patientWithStringDate);
    expect(result.dateNaissance).toBeInstanceOf(Date);
    expect(result.dateNaissance.toISOString().split("T")[0]).toBe("1980-01-01");
  });

  test("fails with missing required fields", async () => {
    const invalidPatient = { nom: "Dupont" };
    await expect(validateData(patientSchema, invalidPatient)).rejects.toThrow();
  });

  test("fails with invalid numeroSecu format", async () => {
    const invalidPatient = { ...validPatientData, numeroSecu: "" };
    await expect(validateData(patientSchema, invalidPatient)).rejects.toThrow();
  });

  // Create schema tests
  test("createPatientSchema rejects id field", async () => {
    const patientWithId = {
      ...validPatientData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(createPatientSchema, patientWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updatePatientSchema requires id field", async () => {
    const patientWithoutId = { nom: "Nouveau Nom" };
    await expect(
      validateData(updatePatientSchema, patientWithoutId)
    ).rejects.toThrow();
  });

  test("updatePatientSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      nom: "Nouveau Nom",
    };
    const result = await validateData(updatePatientSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
