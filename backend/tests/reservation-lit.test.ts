import {
  reservationLitSchema,
  createReservationLitSchema,
  updateReservationLitSchema,
} from "../schema";
import { validateData } from "../validation-utils";

describe("ReservationLit Schema", () => {
  const validReservationLitData = {
    patientId: "507f1f77bcf86cd799439011",
    litId: "507f1f77bcf86cd799439022",
    dateArrivee: new Date("2023-03-01T14:00:00Z"),
    dateDepart: new Date("2023-03-05T11:00:00Z"),
    etablissementDestinationId: "507f1f77bcf86cd799439033",
  };

  test("validates a correct reservationLit", async () => {
    const result = await validateData(
      reservationLitSchema,
      validReservationLitData
    );
    expect(result).toEqual(validReservationLitData);
  });

  test("validates a reservationLit with id", async () => {
    const reservationLitWithId = {
      ...validReservationLitData,
      id: "507f1f77bcf86cd799439044",
    };
    const result = await validateData(
      reservationLitSchema,
      reservationLitWithId
    );
    expect(result).toEqual(reservationLitWithId);
  });

  test("handles string date conversion", async () => {
    const reservationLitWithStringDates = {
      ...validReservationLitData,
      dateArrivee: "2023-03-01T14:00:00Z",
      dateDepart: "2023-03-05T11:00:00Z",
    };
    const result = await validateData(
      reservationLitSchema,
      reservationLitWithStringDates
    );
    expect(result.dateArrivee).toBeInstanceOf(Date);
    expect(result.dateDepart).toBeInstanceOf(Date);
  });

  test("fails with missing required fields", async () => {
    const { litId, ...invalidReservationLit } = validReservationLitData;
    await expect(
      validateData(reservationLitSchema, invalidReservationLit)
    ).rejects.toThrow();
  });

  test("fails with invalid date format", async () => {
    const invalidReservationLit = {
      ...validReservationLitData,
      dateArrivee: "not-a-date",
    };
    await expect(
      validateData(reservationLitSchema, invalidReservationLit)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("createReservationLitSchema rejects id field", async () => {
    const reservationLitWithId = {
      ...validReservationLitData,
      id: "507f1f77bcf86cd799439044",
    };
    const result = await validateData(
      createReservationLitSchema,
      reservationLitWithId
    );
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("updateReservationLitSchema requires id field", async () => {
    const reservationLitWithoutId = {
      dateDepart: new Date("2023-03-06T10:00:00Z"),
    };
    await expect(
      validateData(updateReservationLitSchema, reservationLitWithoutId)
    ).rejects.toThrow();
  });

  test("updateReservationLitSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439044",
      dateDepart: new Date("2023-03-06T10:00:00Z"),
    };
    const result = await validateData(
      updateReservationLitSchema,
      partialUpdate
    );
    expect(result).toEqual(partialUpdate);
  });
});
