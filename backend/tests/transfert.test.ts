import { validateData } from "../validation-utils";
import {
  TransfertSchema,
  CreateTransfertSchema,
  UpdateTransfertSchema,
} from "../lib/schema";

describe("Transfert Schema Validation", () => {
  const validTransfertData = {
    patientId: "507f1f77bcf86cd799439011",
    serviceDepartId: "507f1f77bcf86cd799439022",
    serviceArriveeId: "507f1f77bcf86cd799439033",
    date: new Date("2023-02-10T08:15:00Z"),
    motif: "Besoin d'une prise en charge spécialisée",
    statut: "Planifié",
    autorisePar: "507f1f77bcf86cd799439044",
    realiseePar: "507f1f77bcf86cd799439055",
  };

  test("validates a correct transfert", async () => {
    const result = await validateData(TransfertSchema, validTransfertData);
    expect(result).toEqual(validTransfertData);
  });

  test("validates a transfert with id", async () => {
    const transfertWithId = {
      ...validTransfertData,
      id: "507f1f77bcf86cd799439066",
    };
    const result = await validateData(TransfertSchema, transfertWithId);
    expect(result).toEqual(transfertWithId);
  });

  test("handles string date conversion", async () => {
    const transfertWithStringDate = {
      ...validTransfertData,
      date: "2023-02-10T08:15:00Z",
    };
    const result = await validateData(TransfertSchema, transfertWithStringDate);
    expect(result.date).toBeInstanceOf(Date);
  });

  test("fails with missing required fields", async () => {
    const { patientId, ...invalidTransfert } = validTransfertData;
    await expect(
      validateData(TransfertSchema, invalidTransfert)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreateTransfertSchema rejects id field", async () => {
    const transfertWithId = {
      ...validTransfertData,
      id: "507f1f77bcf86cd799439066",
    };
    const result = await validateData(CreateTransfertSchema, transfertWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateTransfertSchema requires id field", async () => {
    const transfertWithoutId = {
      date: new Date("2023-02-11T10:00:00Z"),
    };
    await expect(
      validateData(UpdateTransfertSchema, transfertWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateTransfertSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439066",
      statut: "En cours",
    };
    const result = await validateData(UpdateTransfertSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
