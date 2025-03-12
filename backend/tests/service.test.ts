import { validateData } from "../validation-utils";
import {
  ServiceSchema,
  CreateServiceSchema,
  UpdateServiceSchema,
} from "../lib/schema";

describe("Service Schema Validation", () => {
  const validServiceData = {
    nom: "Cardiologie",
    etablissementId: "507f1f77bcf86cd799439011",
    capacite: 20, // Ajout du champ capacite
    description: "Service de cardiologie",
    etage: "3",
    aile: "Est",
    statut: "Actif",
    specialite: "Cardiologie",
    responsableId: null,
  };

  test("validates a correct service", async () => {
    const result = await validateData(ServiceSchema, validServiceData);
    expect(result).toEqual(validServiceData);
  });

  test("validates a service with id", async () => {
    const serviceWithId = {
      ...validServiceData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(ServiceSchema, serviceWithId);
    expect(result).toEqual(serviceWithId);
  });

  test("fails with missing required fields", async () => {
    const { etablissementId, ...invalidService } = validServiceData;
    await expect(validateData(ServiceSchema, invalidService)).rejects.toThrow();
  });

  test("fails with empty nom", async () => {
    const invalidService = { ...validServiceData, nom: "" };
    await expect(validateData(ServiceSchema, invalidService)).rejects.toThrow();
  });

  test("validates with default capacite", async () => {
    const { capacite, ...serviceWithoutCapacite } = validServiceData;
    const result = await validateData(ServiceSchema, serviceWithoutCapacite);
    expect(result.capacite).toBe(0); // Vérification de la valeur par défaut
  });

  test("fails with negative capacite", async () => {
    const invalidService = { ...validServiceData, capacite: -5 };
    await expect(validateData(ServiceSchema, invalidService)).rejects.toThrow();
  });

  // Create schema tests
  test("CreateServiceSchema rejects id field", async () => {
    const serviceWithId = {
      ...validServiceData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreateServiceSchema, serviceWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdateServiceSchema requires id field", async () => {
    const serviceWithoutId = { nom: "Nouveau Service" };
    await expect(
      validateData(UpdateServiceSchema, serviceWithoutId)
    ).rejects.toThrow();
  });

  test("UpdateServiceSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      nom: "Neurologie",
    };
    const result = await validateData(UpdateServiceSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });

  test("UpdateServiceSchema allows capacite update", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      capacite: 30,
    };
    const result = await validateData(UpdateServiceSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
