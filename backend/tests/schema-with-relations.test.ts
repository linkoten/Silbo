import {
  patientWithRelationsSchema,
  personnelWithRelationsSchema,
  serviceWithRelationsSchema,
  transfertWithRelationsSchema,
} from "../schema-with-relations";
import { validateData } from "../validation-utils";

describe("Schemas With Relations", () => {
  // Patient with relations
  it("validates patient with relations", async () => {
    const patientWithRelations = {
      id: "507f1f77bcf86cd799439011",
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: new Date("1980-01-01"),
      numeroSecu: "180018001800180",
      transferts: [
        {
          id: "507f1f77bcf86cd799439022",
          patientId: "507f1f77bcf86cd799439011",
          serviceDepartId: "507f1f77bcf86cd799439033",
          serviceArriveeId: "507f1f77bcf86cd799439044",
          dateTransfert: new Date("2023-02-10"),
        },
      ],
      prisesEnCharge: [],
      reservationsLit: [],
    };

    const result = await validateData(
      patientWithRelationsSchema,
      patientWithRelations
    );
    expect(result).toEqual(patientWithRelations);
  });

  // Personnel with relations
  it("validates personnel with relations", async () => {
    const personnelWithRelations = {
      id: "507f1f77bcf86cd799439011",
      nom: "Martin",
      prenom: "Sophie",
      profession: "Médecin",
      serviceId: "507f1f77bcf86cd799439022",
      service: {
        id: "507f1f77bcf86cd799439022",
        nom: "Cardiologie",
        etablissementId: "507f1f77bcf86cd799439033",
      },
      prisesEnCharge: [],
    };

    const result = await validateData(
      personnelWithRelationsSchema,
      personnelWithRelations
    );
    expect(result).toEqual(personnelWithRelations);
  });

  // Service with relations
  it("validates service with relations", async () => {
    const serviceWithRelations = {
      id: "507f1f77bcf86cd799439011",
      nom: "Cardiologie",
      etablissementId: "507f1f77bcf86cd799439022",
      personnel: [],
      lits: [],
      etablissement: {
        id: "507f1f77bcf86cd799439022",
        nom: "Hôpital Central",
        adresse: "123 Avenue de la Santé",
      },
      materiels: [],
      transfertsDepart: [],
      transfertsArrivee: [],
    };

    const result = await validateData(
      serviceWithRelationsSchema,
      serviceWithRelations
    );
    expect(result).toEqual(serviceWithRelations);
  });

  // Test other relation schemas
  it("validates transfert with relations", async () => {
    const transfertWithRelations = {
      id: "507f1f77bcf86cd799439011",
      patientId: "507f1f77bcf86cd799439022",
      serviceDepartId: "507f1f77bcf86cd799439033",
      serviceArriveeId: "507f1f77bcf86cd799439044",
      dateTransfert: new Date("2023-02-10"),
      patient: {
        id: "507f1f77bcf86cd799439022",
        nom: "Dupont",
        prenom: "Jean",
        dateNaissance: new Date("1980-01-01"),
        numeroSecu: "180018001800180",
      },
    };

    const result = await validateData(
      transfertWithRelationsSchema,
      transfertWithRelations
    );
    expect(result).toEqual(transfertWithRelations);
  });
});
