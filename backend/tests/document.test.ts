import { validateData } from "../validation-utils";
import {
  DocumentSchema,
  CreateDocumentSchema,
  UpdateDocumentSchema,
} from "../lib/schema";

describe("Document Schema Validation", () => {
  const validDocumentData = {
    titre: "Dossier médical patient 12345",
    typeDocument: "Dossier médical",
    contenu: "Détails du dossier médical du patient",
    url: "https://storage.hopital.fr/documents/12345.pdf",
    patientId: "507f1f77bcf86cd799439011",
    personnelId: "507f1f77bcf86cd799439022",
    serviceId: "507f1f77bcf86cd799439033",
  };

  test("validates a correct document", async () => {
    const result = await validateData(DocumentSchema, validDocumentData);
    expect(result).toEqual(validDocumentData);
  });

  test("validates a document with id", async () => {
    const documentWithId = {
      ...validDocumentData,
      id: "507f1f77bcf86cd799439044",
    };
    const result = await validateData(DocumentSchema, documentWithId);
    expect(result).toEqual(documentWithId);
  });

  test("fails with missing required fields", async () => {
    const { titre, ...invalidDocument } = validDocumentData;
    await expect(
      validateData(DocumentSchema, invalidDocument)
    ).rejects.toThrow();
  });

  test("fails with empty typeDocument", async () => {
    const invalidDocument = { ...validDocumentData, typeDocument: "" };
    await expect(
      validateData(DocumentSchema, invalidDocument)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreateDocumentSchema rejects id field", async () => {
    const documentWithId = {
      ...validDocumentData,
      id: "507f1f77bcf86cd799439044",
    };
    const result = await validateData(CreateDocumentSchema, documentWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateDocumentSchema requires id field", async () => {
    const documentWithoutId = { titre: "Nouveau titre" };
    await expect(
      validateData(UpdateDocumentSchema, documentWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateDocumentSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439044",
      titre: "Dossier mis à jour",
    };
    const result = await validateData(UpdateDocumentSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
