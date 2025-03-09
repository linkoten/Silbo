import { z } from "zod";

/**
 * Utility function to validate data against a Zod schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns The validated data or throws an error
 */
export async function validateData<T extends z.ZodType>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format the error for better readability
      const formattedErrors = error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      throw new Error(
        `Validation error: ${JSON.stringify(formattedErrors, null, 2)}`
      );
    }
    throw error;
  }
}

/**
 * Utility function to validate form data
 * @param schema The Zod schema to validate against
 * @param formData The FormData object to validate
 * @returns The validated data or throws an error
 */
export async function validateFormData<T extends z.ZodType>(
  schema: T,
  formData: FormData
): Promise<z.infer<T>> {
  const data: Record<string, unknown> = {};

  // Convert FormData to a plain object with proper type handling
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(value)) {
        // Date conversion
        data[key] = new Date(value);
      } else if (!isNaN(Number(value))) {
        // Number conversion
        data[key] = Number(value);
      } else {
        // String value
        data[key] = value;
      }
    } else {
      // Non-string value
      data[key] = value;
    }
  }

  return validateData(schema, data);
}
