import { userSchema, type User } from "../schema";
import { validateData } from "../validation-utils";

describe("User Schema", () => {
  const validUserData: Omit<User, "id"> = {
    email: "test@example.com",
    name: "Test User",
  };

  test("validates a correct user", async () => {
    const result = await validateData(userSchema, validUserData);
    expect(result).toEqual(validUserData);
  });

  test("validates a user with id", async () => {
    const userWithId = { ...validUserData, id: "507f1f77bcf86cd799439011" };
    const result = await validateData(userSchema, userWithId);
    expect(result).toEqual(userWithId);
  });

  test("validates a user without name", async () => {
    const userWithoutName = { email: validUserData.email };
    const result = await validateData(userSchema, userWithoutName);
    expect(result).toEqual(userWithoutName); // Remove the name: null part
  });

  test("fails with invalid email", async () => {
    const invalidUser = { ...validUserData, email: "not-an-email" };
    await expect(validateData(userSchema, invalidUser)).rejects.toThrow();
  });

  test("fails with missing email", async () => {
    const invalidUser = { name: validUserData.name };
    await expect(validateData(userSchema, invalidUser)).rejects.toThrow();
  });

  test("handles null name explicitly", async () => {
    const userWithNullName = { ...validUserData, name: null };
    const result = await validateData(userSchema, userWithNullName);
    expect(result).toEqual(userWithNullName);
  });
});
