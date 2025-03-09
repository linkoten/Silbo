import { litSchema, createLitSchema, updateLitSchema } from "../schema";
import { validateData } from "../validation-utils";

describe("Lit Schema", () => {
  const validLitData = {
    numeroLit: "A101",
    serviceId: "507f1f77bcf86cd799439011",
  };

  test("validates a correct lit", async () => {
    const result = await validateData(litSchema, validLitData);
    expect(result).toEqual(validLitData);
  });

  test("validates a lit with id", async () => {
    const litWithId = {
      ...validLitData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(litSchema, litWithId);
    expect(result).toEqual(litWithId);
  });

  test("fails with missing required fields", async () => {
    const { numeroLit, ...invalidLit } = validLitData;
    await expect(validateData(litSchema, invalidLit)).rejects.toThrow();
  });

  test("fails with empty numeroLit", async () => {
    const invalidLit = { ...validLitData, numeroLit: "" };
    await expect(validateData(litSchema, invalidLit)).rejects.toThrow();
  });

  // Create schema tests
  test("createLitSchema rejects id field", async () => {
    const litWithId = {
      ...validLitData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(createLitSchema, litWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateLitSchema requires id field", async () => {
    const litWithoutId = { numeroLit: "B202" };
    await expect(validateData(updateLitSchema, litWithoutId)).rejects.toThrow();
  });

  test("updateLitSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      numeroLit: "B202",
    };
    const result = await validateData(updateLitSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
