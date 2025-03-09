import {
  priseEnChargeSchema,
  createPriseEnChargeSchema,
  updatePriseEnChargeSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("PriseEnCharge Schema", () => {
  const validPriseEnChargeData = {
    patientId: "507f1f77bcf86cd799439011",
    personnelId: "507f1f77bcf86cd799439022",
    datePriseEnCharge: new Date("2023-01-15T10:30:00Z"),
  };

  test("validates a correct priseEnCharge", async () => {
    const result = await validateData(
      priseEnChargeSchema,
      validPriseEnChargeData
    );
    expect(result).toEqual(validPriseEnChargeData);
  });

  test("validates a priseEnCharge with id", async () => {
    const priseEnChargeWithId = {
      ...validPriseEnChargeData,
      id: "507f1f77bcf86cd799439033",
    };
    const result = await validateData(priseEnChargeSchema, priseEnChargeWithId);
    expect(result).toEqual(priseEnChargeWithId);
  });

  test("handles string date conversion", async () => {
    const priseEnChargeWithStringDate = {
      ...validPriseEnChargeData,
      datePriseEnCharge: "2023-01-15T10:30:00Z",
    };
    const result = await validateData(
      priseEnChargeSchema,
      priseEnChargeWithStringDate
    );
    expect(result.datePriseEnCharge).toBeInstanceOf(Date);
  });

  test("fails with missing required fields", async () => {
    const { patientId, ...invalidPriseEnCharge } = validPriseEnChargeData;
    await expect(
      validateData(priseEnChargeSchema, invalidPriseEnCharge)
    ).rejects.toThrow();
  });

  test("fails with invalid patientId format", async () => {
    const invalidPriseEnCharge = { ...validPriseEnChargeData, patientId: "" };
    await expect(
      validateData(priseEnChargeSchema, invalidPriseEnCharge)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createPriseEnChargeSchema rejects id field", async () => {
    const priseEnChargeWithId = {
      ...validPriseEnChargeData,
      id: "507f1f77bcf86cd799439033",
    };
    const result = await validateData(
      createPriseEnChargeSchema,
      priseEnChargeWithId
    );
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updatePriseEnChargeSchema requires id field", async () => {
    const priseEnChargeWithoutId = { personnelId: "507f1f77bcf86cd799439044" };
    await expect(
      validateData(updatePriseEnChargeSchema, priseEnChargeWithoutId)
    ).rejects.toThrow();
  });

  test("updatePriseEnChargeSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439033",
      datePriseEnCharge: new Date("2023-01-16T14:00:00Z"),
    };
    const result = await validateData(updatePriseEnChargeSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
