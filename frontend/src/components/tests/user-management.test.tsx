import { userFormSchema, UserFormValues } from "../userFormSchema";

describe("Zod Schema Validation", () => {
  it("validates valid form data", async () => {
    const validData: UserFormValues = {
      name: "John Doe",
      email: "john@example.com",
    };

    const result = userFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("invalidates form data with short name", async () => {
    const invalidData: UserFormValues = {
      name: "J",
      email: "john@example.com",
    };

    const result = userFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Le nom doit contenir au moins 2 caractères."
      );
    }
  });

  it("invalidates form data with invalid email", async () => {
    const invalidData: UserFormValues = {
      name: "John Doe",
      email: "invalid-email",
    };

    const result = userFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        "Veuillez entrer une adresse email valide."
      );
    }
  });
});
