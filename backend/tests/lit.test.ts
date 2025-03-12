import { validateData } from "../validation-utils";
import { LitSchema, CreateLitSchema, UpdateLitSchema } from "../lib/schema";

describe("Lit Schema Validation", () => {
  const validLitData = {
    numeroLit: "A101",
    type: "Simple",
    statut: "Disponible",
    serviceId: "507f1f77bcf86cd799439011",
    chambre: "101",
    etage: "1",
    patientId: null,
  };

  test("validates a correct lit", async () => {
    const result = await validateData(LitSchema, validLitData);
    expect(result).toEqual(validLitData);
  });

  test("validates a lit with id", async () => {
    const litWithId = {
      ...validLitData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(LitSchema, litWithId);
    expect(result).toEqual(litWithId);
  });

  test("fails with missing required fields", async () => {
    const { numeroLit, ...invalidLit } = validLitData;
    await expect(validateData(LitSchema, invalidLit)).rejects.toThrow();
  });

  test("fails with empty numeroLit", async () => {
    const invalidLit = { ...validLitData, numeroLit: "" };
    await expect(validateData(LitSchema, invalidLit)).rejects.toThrow();
  });

  // Create schema tests
  test("CreateLitSchema rejects id field", async () => {
    const litWithId = {
      ...validLitData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreateLitSchema, litWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateLitSchema requires id field", async () => {
    const litWithoutId = { numeroLit: "B202" };
    await expect(validateData(UpdateLitSchema, litWithoutId)).rejects.toThrow();
  });

  test("UpdateLitSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      numeroLit: "B202",
    };
    const result = await validateData(UpdateLitSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
