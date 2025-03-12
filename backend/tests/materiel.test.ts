import { validateData } from "../validation-utils";
import {
  MaterielSchema,
  CreateMaterielSchema,
  UpdateMaterielSchema,
} from "../lib/schema";

describe("Materiel Schema Validation", () => {
  const validMaterielData = {
    nom: "Scanner IRM",
    description: "Scanner à imagerie par résonance magnétique",
    quantite: 5,
    type: "Médical",
    marque: "MedTech",
    modele: "IRM-500",
    numeroSerie: "MT12345",
    dateAchat: new Date("2022-01-15"),
    dateMaintenance: new Date("2023-01-15"),
    statut: "En Service",
    serviceId: "507f1f77bcf86cd799439011",
  };

  test("validates a correct materiel", async () => {
    const result = await validateData(MaterielSchema, validMaterielData);
    expect(result).toEqual(validMaterielData);
  });

  test("validates a materiel with id", async () => {
    const materielWithId = {
      ...validMaterielData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(MaterielSchema, materielWithId);
    expect(result).toEqual(materielWithId);
  });

  test("fails with negative quantite", async () => {
    const invalidMateriel = { ...validMaterielData, quantite: -1 };
    await expect(
      validateData(MaterielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  test("fails with non-integer quantite", async () => {
    const invalidMateriel = { ...validMaterielData, quantite: 5.5 };
    await expect(
      validateData(MaterielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  test("fails with missing required fields", async () => {
    const { nom, ...invalidMateriel } = validMaterielData;
    await expect(
      validateData(MaterielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreateMaterielSchema rejects id field", async () => {
    const materielWithId = {
      ...validMaterielData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreateMaterielSchema, materielWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateMaterielSchema requires id field", async () => {
    const materielWithoutId = { quantite: 10 };
    await expect(
      validateData(UpdateMaterielSchema, materielWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateMaterielSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      quantite: 10,
    };
    const result = await validateData(UpdateMaterielSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
