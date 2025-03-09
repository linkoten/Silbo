import {
  transfertSchema,
  createTransfertSchema,
  updateTransfertSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("Transfert Schema", () => {
  const validTransfertData = {
    patientId: "507f1f77bcf86cd799439011",
    serviceDepartId: "507f1f77bcf86cd799439022",
    serviceArriveeId: "507f1f77bcf86cd799439033",
    dateTransfert: new Date("2023-02-10T08:15:00Z"),
    etablissementDepartId: "507f1f77bcf86cd799439044",
    etablissementArriveeId: "507f1f77bcf86cd799439055",
  };

  test("validates a correct transfert", async () => {
    const result = await validateData(transfertSchema, validTransfertData);
    expect(result).toEqual(validTransfertData);
  });

  test("validates a transfert with id", async () => {
    const transfertWithId = {
      ...validTransfertData,
      id: "507f1f77bcf86cd799439066",
    };
    const result = await validateData(transfertSchema, transfertWithId);
    expect(result).toEqual(transfertWithId);
  });

  test("handles string date conversion", async () => {
    const transfertWithStringDate = {
      ...validTransfertData,
      dateTransfert: "2023-02-10T08:15:00Z",
    };
    const result = await validateData(transfertSchema, transfertWithStringDate);
    expect(result.dateTransfert).toBeInstanceOf(Date);
  });

  test("fails with missing required fields", async () => {
    const { patientId, ...invalidTransfert } = validTransfertData;
    await expect(
      validateData(transfertSchema, invalidTransfert)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createTransfertSchema rejects id field", async () => {
    const transfertWithId = {
      ...validTransfertData,
      id: "507f1f77bcf86cd799439066",
    };
    const result = await validateData(createTransfertSchema, transfertWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateTransfertSchema requires id field", async () => {
    const transfertWithoutId = {
      dateTransfert: new Date("2023-02-11T10:00:00Z"),
    };
    await expect(
      validateData(updateTransfertSchema, transfertWithoutId)
    ).rejects.toThrow();
  });

  test("updateTransfertSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439066",
      serviceArriveeId: "507f1f77bcf86cd799439077",
    };
    const result = await validateData(updateTransfertSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
