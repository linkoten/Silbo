"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validation_utils_1 = require("../validation-utils");
describe("Validation Utils", () => {
    const testSchema = zod_1.z.object({
        name: zod_1.z.string().min(1),
        age: zod_1.z.number().int().positive(),
        email: zod_1.z.string().email().optional(),
        birthDate: zod_1.z.coerce.date(),
    });
    describe("validateData", () => {
        test("validates correct data", async () => {
            const validData = {
                name: "John Doe",
                age: 30,
                email: "john@example.com",
                birthDate: new Date("1990-01-01"),
            };
            const result = await (0, validation_utils_1.validateData)(testSchema, validData);
            expect(result).toEqual(validData);
        });
        test("validates data with string date", async () => {
            const validData = {
                name: "John Doe",
                age: 30,
                birthDate: "1990-01-01",
            };
            const result = await (0, validation_utils_1.validateData)(testSchema, validData);
            expect(result.birthDate).toBeInstanceOf(Date);
            expect(result.birthDate.toISOString().split("T")[0]).toBe("1990-01-01");
        });
        test("throws formatted error for invalid data", async () => {
            const invalidData = {
                name: "",
                age: -5,
                email: "not-an-email",
            };
            await expect((0, validation_utils_1.validateData)(testSchema, invalidData)).rejects.toThrow("Validation error:");
        });
    });
    describe("validateFormData", () => {
        test("validates form data correctly", async () => {
            const formData = new FormData();
            formData.append("name", "John Doe");
            formData.append("age", "30");
            formData.append("email", "john@example.com");
            formData.append("birthDate", "1990-01-01");
            const result = await (0, validation_utils_1.validateFormData)(testSchema, formData);
            expect(result).toEqual({
                name: "John Doe",
                age: 30,
                email: "john@example.com",
                birthDate: expect.any(Date),
            });
        });
        test("handles date conversion in form data", async () => {
            const formData = new FormData();
            formData.append("name", "John Doe");
            formData.append("age", "30");
            formData.append("birthDate", "1990-01-01T00:00:00");
            const result = await (0, validation_utils_1.validateFormData)(testSchema, formData);
            expect(result.birthDate).toBeInstanceOf(Date);
        });
        test("throws error for invalid form data", async () => {
            const formData = new FormData();
            formData.append("name", "");
            formData.append("age", "not-a-number");
            await expect((0, validation_utils_1.validateFormData)(testSchema, formData)).rejects.toThrow("Validation error:");
        });
    });
});
