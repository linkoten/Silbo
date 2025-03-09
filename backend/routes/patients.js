"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRoutes = patientRoutes;
const patients_service_1 = require("../lib/patients-service");
async function patientRoutes(server) {
    const patientService = new patients_service_1.PatientService();
    // Route pour récupérer tous les patients
    server.get("/patients", async (_, reply) => {
        const result = await patientService.getAllPatients();
        if (!result.success) {
            return reply.status(500).send({
                error: "Erreur lors de la récupération des patients",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour créer un patient
    server.post("/patients", async (request, reply) => {
        const result = await patientService.createPatient(request.body);
        if (!result.success) {
            return reply.status(400).send({
                error: "Validation échouée",
                details: result.error,
            });
        }
        return reply.status(201).send(result.data);
    });
}
