import { validateData } from "../validation-utils";
import {
  MedicamentSchema,
  CreateMedicamentSchema,
  UpdateMedicamentSchema,
} from "../lib/schema";

describe("Medicament Schema Validation", () => {
  const validMedicamentData = {
    nom: "Paracétamol",
    dosage: "500mg",
    description: "Analgésique et antipyrétique",
    categorie: "Analgésique",
    fabricant: "Laboratoire PharmaCo",
    stockActuel: 200,
    stockMinimum: 50,
    datePeremption: new Date("2025-01-15"),
  };

  test("validates a correct medicament", async () => {
    const result = await validateData(MedicamentSchema, validMedicamentData);
    expect(result).toEqual(validMedicamentData);
  });

  test("validates a medicament with id", async () => {
    const medicamentWithId = {
      ...validMedicamentData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(MedicamentSchema, medicamentWithId);
    expect(result).toEqual(medicamentWithId);
  });

  test("fails with negative stockActuel", async () => {
    const invalidMedicament = { ...validMedicamentData, stockActuel: -10 };
    await expect(
      validateData(MedicamentSchema, invalidMedicament)
    ).rejects.toThrow();
  });

  test("fails with missing required fields", async () => {
    const { nom, ...invalidMedicament } = validMedicamentData;
    await expect(
      validateData(MedicamentSchema, invalidMedicament)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreateMedicamentSchema rejects id field", async () => {
    const medicamentWithId = {
      ...validMedicamentData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreateMedicamentSchema, medicamentWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateMedicamentSchema requires id field", async () => {
    const medicamentWithoutId = { stockActuel: 300 };
    await expect(
      validateData(UpdateMedicamentSchema, medicamentWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateMedicamentSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      stockActuel: 150,
    };
    const result = await validateData(UpdateMedicamentSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
