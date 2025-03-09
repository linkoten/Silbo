import {
  etablissementSchema,
  createEtablissementSchema,
  updateEtablissementSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Etablissement Schema", () => {
  const validEtablissementData = {
    nom: "Hôpital Central",
    adresse: "123 Avenue de la Santé, 75001 Paris",
  };

  test("validates a correct etablissement", async () => {
    const result = await validateData(
      etablissementSchema,
      validEtablissementData
    );
    expect(result).toEqual(validEtablissementData);
  });

  test("validates an etablissement with id", async () => {
    const etablissementWithId = {
      ...validEtablissementData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(etablissementSchema, etablissementWithId);
    expect(result).toEqual(etablissementWithId);
  });

  test("fails with missing required fields", async () => {
    const { nom, ...invalidEtablissement } = validEtablissementData;
    await expect(
      validateData(etablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  test("fails with empty nom", async () => {
    const invalidEtablissement = { ...validEtablissementData, nom: "" };
    await expect(
      validateData(etablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createEtablissementSchema rejects id field", async () => {
    const etablissementWithId = {
      ...validEtablissementData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(
      createEtablissementSchema,
      etablissementWithId
    );
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateEtablissementSchema requires id field", async () => {
    const etablissementWithoutId = { nom: "Nouvel Hôpital" };
    await expect(
      validateData(updateEtablissementSchema, etablissementWithoutId)
    ).rejects.toThrow();
  });

  test("updateEtablissementSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      adresse: "Nouvelle adresse",
    };
    const result = await validateData(updateEtablissementSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
