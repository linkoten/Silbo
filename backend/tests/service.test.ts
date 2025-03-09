import {
  serviceSchema,
  createServiceSchema,
  updateServiceSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Service Schema", () => {
  const validServiceData = {
    nom: "Cardiologie",
    etablissementId: "507f1f77bcf86cd799439011",
  };

  test("validates a correct service", async () => {
    const result = await validateData(serviceSchema, validServiceData);
    expect(result).toEqual(validServiceData);
  });

  test("validates a service with id", async () => {
    const serviceWithId = {
      ...validServiceData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(serviceSchema, serviceWithId);
    expect(result).toEqual(serviceWithId);
  });

  test("fails with missing required fields", async () => {
    const { etablissementId, ...invalidService } = validServiceData;
    await expect(validateData(serviceSchema, invalidService)).rejects.toThrow();
  });

  test("fails with empty nom", async () => {
    const invalidService = { ...validServiceData, nom: "" };
    await expect(validateData(serviceSchema, invalidService)).rejects.toThrow();
  });

  // Create schema tests
  test("createServiceSchema rejects id field", async () => {
    const serviceWithId = {
      ...validServiceData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(createServiceSchema, serviceWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateServiceSchema requires id field", async () => {
    const serviceWithoutId = { nom: "Nouveau Service" };
    await expect(
      validateData(updateServiceSchema, serviceWithoutId)
    ).rejects.toThrow();
  });

  test("updateServiceSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      nom: "Neurologie",
    };
    const result = await validateData(updateServiceSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
