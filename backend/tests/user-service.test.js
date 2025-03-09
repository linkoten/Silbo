"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const validation_utils_1 = require("../validation-utils");
describe("User Schema", () => {
    const validUserData = {
        email: "test@example.com",
        name: "Test User",
    };
    test("validates a correct user", async () => {
        const result = await (0, validation_utils_1.validateData)(schema_1.userSchema, validUserData);
        expect(result).toEqual(validUserData);
    });
    test("validates a user with id", async () => {
        const userWithId = Object.assign(Object.assign({}, validUserData), { id: "507f1f77bcf86cd799439011" });
        const result = await (0, validation_utils_1.validateData)(schema_1.userSchema, userWithId);
        expect(result).toEqual(userWithId);
    });
    test("validates a user without name", async () => {
        const userWithoutName = { email: validUserData.email };
        const result = await (0, validation_utils_1.validateData)(schema_1.userSchema, userWithoutName);
        expect(result).toEqual(userWithoutName); // Remove the name: null part
    });
    test("fails with invalid email", async () => {
        const invalidUser = Object.assign(Object.assign({}, validUserData), { email: "not-an-email" });
        await expect((0, validation_utils_1.validateData)(schema_1.userSchema, invalidUser)).rejects.toThrow();
    });
    test("fails with missing email", async () => {
        const invalidUser = { name: validUserData.name };
        await expect((0, validation_utils_1.validateData)(schema_1.userSchema, invalidUser)).rejects.toThrow();
    });
    test("handles null name explicitly", async () => {
        const userWithNullName = Object.assign(Object.assign({}, validUserData), { name: null });
        const result = await (0, validation_utils_1.validateData)(schema_1.userSchema, userWithNullName);
        expect(result).toEqual(userWithNullName);
    });
});
