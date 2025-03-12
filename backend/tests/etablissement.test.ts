import { validateData } from "../validation-utils";
import {
  EtablissementSchema,
  CreateEtablissementSchema,
  UpdateEtablissementSchema,
} from "../lib/schema";

describe("Etablissement Schema Validation", () => {
  const validEtablissementData = {
    nom: "Hôpital Central",
    adresse: "123 Avenue de la Santé",
    capacite: 500, // Ajout du champ capacite
    telephone: "0123456789",
    email: "contact@hopital.fr",
    codePostal: "75000",
    ville: "Paris",
    pays: "France",
    statut: "Actif",
    typology: "CHU",
    siteWeb: "https://hopital-central.fr",
  };

  test("validates a correct etablissement", async () => {
    const result = await validateData(
      EtablissementSchema,
      validEtablissementData
    );
    expect(result).toEqual(validEtablissementData);
  });

  test("validates an etablissement with id", async () => {
    const etablissementWithId = {
      ...validEtablissementData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(EtablissementSchema, etablissementWithId);
    expect(result).toEqual(etablissementWithId);
  });

  test("fails with missing required fields", async () => {
    const { nom, ...invalidEtablissement } = validEtablissementData;
    await expect(
      validateData(EtablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  test("fails with empty nom", async () => {
    const invalidEtablissement = { ...validEtablissementData, nom: "" };
    await expect(
      validateData(EtablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  test("validates with default capacite", async () => {
    const { capacite, ...etablissementWithoutCapacite } =
      validEtablissementData;
    const result = await validateData(
      EtablissementSchema,
      etablissementWithoutCapacite
    );
    expect(result.capacite).toBe(0); // Vérification de la valeur par défaut
  });

  test("fails with negative capacite", async () => {
    const invalidEtablissement = { ...validEtablissementData, capacite: -10 };
    await expect(
      validateData(EtablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  test("validates with valid email", async () => {
    const result = await validateData(
      EtablissementSchema,
      validEtablissementData
    );
    expect(result.email).toBe("contact@hopital.fr");
  });

  test("fails with invalid email", async () => {
    const invalidEtablissement = {
      ...validEtablissementData,
      email: "not-an-email",
    };
    await expect(
      validateData(EtablissementSchema, invalidEtablissement)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreateEtablissementSchema rejects id field", async () => {
    const etablissementWithId = {
      ...validEtablissementData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(
      CreateEtablissementSchema,
      etablissementWithId
    );
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateEtablissementSchema requires id field", async () => {
    const etablissementWithoutId = { nom: "Nouvel Hôpital" };
    await expect(
      validateData(UpdateEtablissementSchema, etablissementWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateEtablissementSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      adresse: "Nouvelle adresse",
    };
    const result = await validateData(UpdateEtablissementSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });

  test("UpdateEtablissementSchema allows capacite update", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      capacite: 650,
    };
    const result = await validateData(UpdateEtablissementSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
