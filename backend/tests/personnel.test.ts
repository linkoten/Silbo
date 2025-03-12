import { validateData } from "../validation-utils";
import {
  PersonnelSchema,
  CreatePersonnelSchema,
  UpdatePersonnelSchema,
} from "../lib/schema";

describe("Personnel Schema Validation", () => {
  const validPersonnelData = {
    nom: "Martin",
    prenom: "Sophie",
    profession: "Médecin",
    dateNaissance: new Date("1985-05-15"),
    email: "sophie.martin@hopital.fr",
    telephone: "0601020304",
    specialite: "Cardiologie",
    matricule: "MED12345",
    serviceId: "507f1f77bcf86cd799439022",
    dateEmbauche: new Date("2015-01-10"),
    statut: "Actif",
  };

  test("validates a correct personnel", async () => {
    const result = await validateData(PersonnelSchema, validPersonnelData);
    expect(result).toEqual(validPersonnelData);
  });

  test("validates a personnel with id", async () => {
    const personnelWithId = {
      ...validPersonnelData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(PersonnelSchema, personnelWithId);
    expect(result).toEqual(personnelWithId);
  });

  test("fails with missing required fields", async () => {
    const { profession, ...invalidPersonnel } = validPersonnelData;
    await expect(
      validateData(PersonnelSchema, invalidPersonnel)
    ).rejects.toThrow();
  });

  // Create schema tests
  test("CreatePersonnelSchema rejects id field", async () => {
    const personnelWithId = {
      ...validPersonnelData,
      id: "507f1f77bcf86cd799439011",
    };
    const result = await validateData(CreatePersonnelSchema, personnelWithId);
    expect(result).not.toHaveProperty("id");
  });

  // Update schema tests
  test("UpdatePersonnelSchema requires id field", async () => {
    const personnelWithoutId = { nom: "Nouveau Nom" };
    await expect(
      validateData(UpdatePersonnelSchema, personnelWithoutId)
    ).rejects.toThrow();
  });

  test("UpdatePersonnelSchema allows partial updates", async () => {
    const partialUpdate = {
      id: "507f1f77bcf86cd799439011",
      profession: "Chirurgien",
    };
    const result = await validateData(UpdatePersonnelSchema, partialUpdate);
    expect(result).toEqual(partialUpdate);
  });
});
