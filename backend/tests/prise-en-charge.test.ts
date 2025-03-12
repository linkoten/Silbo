import { validateData } from "../validation-utils";
import {
  PriseEnChargeSchema,
  CreatePriseEnChargeSchema,
  UpdatePriseEnChargeSchema,
} from "../lib/schema";

describe("PriseEnCharge Schema Validation", () => {
  const validPriseEnChargeData = {
    patientId: "507f1f77bcf86cd799439011",
    personnelId: "507f1f77bcf86cd799439022",
    dateDebut: new Date("2023-01-15T10:30:00Z"),
    dateFin: new Date("2023-01-20T16:00:00Z"),
    description: "Prise en charge post-opératoire",
    diagnostic: "Récupération normale",
    traitement: "Analgésiques et physiothérapie",
    notes: "Patient répond bien au traitement",
  };

  test("validates a correct priseEnCharge", async () => {
    const result = await validateData(
      PriseEnChargeSchema,
      validPriseEnChargeData
    );
    expect(result).toEqual(validPriseEnChargeData);
  });

  test("validates a priseEnCharge with id", async () => {
    const priseEnChargeWithId = {
      ...validPriseEnChargeData,
      id: "507f1f77bcf86cd799439033",
    };
    const result = await validateData(PriseEnChargeSchema, priseEnChargeWithId);
    expect(result).toEqual(priseEnChargeWithId);
  });

  test("handles string date conversion", async () => {
    const priseEnChargeWithStringDate = {
      ...validPriseEnChargeData,
      dateDebut: "2023-01-15T10:30:00Z",
    };
    const result = await validateData(
      PriseEnChargeSchema,
      priseEnChargeWithStringDate
    );
    expect(result.dateDebut).toBeInstanceOf(Date);
  });

  test("fails with missing required fields", async () => {
    const { patientId, ...invalidPriseEnCharge } = validPriseEnChargeData;
    await expect(
      validateData(PriseEnChargeSchema, invalidPriseEnCharge)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreatePriseEnChargeSchema rejects id field", async () => {
    const priseEnChargeWithId = {
      ...validPriseEnChargeData,
      id: "507f1f77bcf86cd799439033",
    };
    const result = await validateData(
      CreatePriseEnChargeSchema,
      priseEnChargeWithId
    );
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdatePriseEnChargeSchema requires id field", async () => {
    const priseEnChargeWithoutId = { personnelId: "507f1f77bcf86cd799439044" };
    await expect(
      validateData(UpdatePriseEnChargeSchema, priseEnChargeWithoutId)
    ).rejects.toThrow();
  });

  test("UpdatePriseEnChargeSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439033",
      notes: "Nouvelle observation",
    };
    const result = await validateData(UpdatePriseEnChargeSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
