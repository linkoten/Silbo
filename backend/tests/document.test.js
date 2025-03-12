"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_utils_1 = require("../validation-utils");
const schema_1 = require("../lib/schema");
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
        const result = await (0, validation_utils_1.validateData)(schema_1.DocumentSchema, validDocumentData);
        expect(result).toEqual(validDocumentData);
    });
    test("validates a document with id", async () => {
        const documentWithId = Object.assign(Object.assign({}, validDocumentData), { id: "507f1f77bcf86cd799439044" });
        const result = await (0, validation_utils_1.validateData)(schema_1.DocumentSchema, documentWithId);
        expect(result).toEqual(documentWithId);
    });
    test("fails with missing required fields", async () => {
        const { titre } = validDocumentData, invalidDocument = __rest(validDocumentData, ["titre"]);
        await expect((0, validation_utils_1.validateData)(schema_1.DocumentSchema, invalidDocument)).rejects.toThrow();
    });
    test("fails with empty typeDocument", async () => {
        const invalidDocument = Object.assign(Object.assign({}, validDocumentData), { typeDocument: "" });
        await expect((0, validation_utils_1.validateData)(schema_1.DocumentSchema, invalidDocument)).rejects.toThrow();
    });
    // Create schema tests
    test("CreateDocumentSchema rejects id field", async () => {
        const documentWithId = Object.assign(Object.assign({}, validDocumentData), { id: "507f1f77bcf86cd799439044" });
        const result = await (0, validation_utils_1.validateData)(schema_1.CreateDocumentSchema, documentWithId);
        expect(result).not.toHaveProperty("id");
    });
    // Update schema tests
    test("UpdateDocumentSchema requires id field", async () => {
        const documentWithoutId = { titre: "Nouveau titre" };
        await expect((0, validation_utils_1.validateData)(schema_1.UpdateDocumentSchema, documentWithoutId)).rejects.toThrow();
    });
    test("UpdateDocumentSchema allows partial updates", async () => {
        const partialUpdate = {
            id: "507f1f77bcf86cd799439044",
            titre: "Dossier mis à jour",
        };
        const result = await (0, validation_utils_1.validateData)(schema_1.UpdateDocumentSchema, partialUpdate);
        expect(result).toEqual(partialUpdate);
    });
});
