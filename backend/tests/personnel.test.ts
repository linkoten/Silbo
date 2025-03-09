import {
  personnelSchema,
  createPersonnelSchema,
  updatePersonnelSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Personnel Schema", () => {
  const validPersonnelData = {
    nom: "Martin",
    prenom: "Sophie",
    profession: "Médecin",
    serviceId: "507f1f77bcf86cd799439011",
  };

  test("validates a correct personnel", async () => {
    const result = await validateData(personnelSchema, validPersonnelData);
    expect(result).toEqual(validPersonnelData);
  });

  test("validates a personnel with id", async () => {
    const personnelWithId = {
      ...validPersonnelData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(personnelSchema, personnelWithId);
    expect(result).toEqual(personnelWithId);
  });

  test("fails with missing required fields", async () => {
    const { profession, ...invalidPersonnel } = validPersonnelData;
    await expect(
      validateData(personnelSchema, invalidPersonnel)
    ).rejects.toThrow();
  });

  test("fails with invalid serviceId format", async () => {
    const invalidPersonnel = { ...validPersonnelData, serviceId: "" };
    await expect(
      validateData(personnelSchema, invalidPersonnel)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createPersonnelSchema rejects id field", async () => {
    const personnelWithId = {
      ...validPersonnelData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(createPersonnelSchema, personnelWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updatePersonnelSchema requires id field", async () => {
    const personnelWithoutId = { nom: "Nouveau Nom" };
    await expect(
      validateData(updatePersonnelSchema, personnelWithoutId)
    ).rejects.toThrow();
  });

  test("updatePersonnelSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      profession: "Chirurgien",
    };
    const result = await validateData(updatePersonnelSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
