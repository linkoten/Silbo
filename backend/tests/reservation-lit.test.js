"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const validation_utils_1 = require("../validation-utils");
describe("ReservationLit Schema", () => {
    const validReservationLitData = {
        patientId: "507f1f77bcf86cd799439011",
        litId: "507f1f77bcf86cd799439022",
        dateArrivee: new Date("2023-03-01T14:00:00Z"),
        dateDepart: new Date("2023-03-05T11:00:00Z"),
        etablissementDestinationId: "507f1f77bcf86cd799439033",
    };
    test("validates a correct reservationLit", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.reservationLitSchema, validReservationLitData);
        expect(result).toEqual(validReservationLitData);
    });
    test("validates a reservationLit with id", async () => {
        const reservationLitWithId = Object.assign(Object.assign({}, validReservationLitData), { id: "507f1f77bcf86cd799439044" });
        const result = await (0, validation_utils_1.validateData)(schema_1.reservationLitSchema, reservationLitWithId);
        expect(result).toEqual(reservationLitWithId);
    });
    test("handles string date conversion", async () => {
        const reservationLitWithStringDates = Object.assign(Object.assign({}, validReservationLitData), { dateArrivee: "2023-03-01T14:00:00Z", dateDepart: "2023-03-05T11:00:00Z" });
        const result = await (0, validation_utils_1.validateData)(schema_1.reservationLitSchema, reservationLitWithStringDates);
        expect(result.dateArrivee).toBeInstanceOf(Date);
        expect(result.dateDepart).toBeInstanceOf(Date);
    });
    test("fails with missing required fields", async () => {
        const { litId } = validReservationLitData, invalidReservationLit = __rest(validReservationLitData, ["litId"]);
        await expect((0, validation_utils_1.validateData)(schema_1.reservationLitSchema, invalidReservationLit)).rejects.toThrow();
    });
    test("fails with invalid date format", async () => {
        const invalidReservationLit = Object.assign(Object.assign({}, validReservationLitData), { dateArrivee: "not-a-date" });
        await expect((0, validation_utils_1.validateData)(schema_1.reservationLitSchema, invalidReservationLit)).rejects.toThrow();
    });
    // Create schema tests
    test("createReservationLitSchema rejects id field", async () => {
        const reservationLitWithId = Object.assign(Object.assign({}, validReservationLitData), { id: "507f1f77bcf86cd799439044" });
        const result = await (0, validation_utils_1.validateData)(schema_1.createReservationLitSchema, reservationLitWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("updateReservationLitSchema requires id field", async () => {
        const reservationLitWithoutId = {
            dateDepart: new Date("2023-03-06T10:00:00Z"),
        };
        await expect((0, validation_utils_1.validateData)(schema_1.updateReservationLitSchema, reservationLitWithoutId)).rejects.toThrow();
    });
    test("updateReservationLitSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439044",
            dateDepart: new Date("2023-03-06T10:00:00Z"),
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.updateReservationLitSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
