import {
  materielSchema,
  createMaterielSchema,
  updateMaterielSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Materiel Schema", () => {
  const validMaterielData = {
    nom: "Défibrillateur",
    description: "Appareil de réanimation cardiaque",
    quantite: 5,
    serviceId: "507f1f77bcf86cd799439011",
  };

  test("validates a correct materiel", async () => {
    const result = await validateData(materielSchema, validMaterielData);
    expect(result).toEqual(validMaterielData);
  });

  test("validates a materiel with id", async () => {
    const materielWithId = {
      ...validMaterielData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(materielSchema, materielWithId);
    expect(result).toEqual(materielWithId);
  });

  test("fails with negative quantite", async () => {
    const invalidMateriel = { ...validMaterielData, quantite: -1 };
    await expect(
      validateData(materielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  test("fails with non-integer quantite", async () => {
    const invalidMateriel = { ...validMaterielData, quantite: 5.5 };
    await expect(
      validateData(materielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  test("fails with missing required fields", async () => {
    const { nom, ...invalidMateriel } = validMaterielData;
    await expect(
      validateData(materielSchema, invalidMateriel)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createMaterielSchema rejects id field", async () => {
    const materielWithId = {
      ...validMaterielData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(createMaterielSchema, materielWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateMaterielSchema requires id field", async () => {
    const materielWithoutId = { quantite: 10 };
    await expect(
      validateData(updateMaterielSchema, materielWithoutId)
    ).rejects.toThrow();
  });

  test("updateMaterielSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      quantite: 10,
    };
    const result = await validateData(updateMaterielSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
