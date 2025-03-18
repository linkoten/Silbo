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
    // Route pour mettre à jour un patient existant
    server.patch("/patients/:id", async (request, reply) => {
        const { id } = request.params;
        const patientData = request.body;
        const result = await patientService.updatePatient(id, patientData);
        if (!result.success) {
            return reply.status(400).send({
                error: "Mise à jour échouée",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour récupérer un patient spécifique par son ID
    server.get("/patients/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await patientService.getPatientById(id);
        if (!result.success) {
            return reply.status(404).send({
                error: "Patient non trouvé",
                details: result.error,
            });
        }
        return reply.send(result.data);
    });
    // Route pour supprimer un patient
    server.delete("/patients/:id", async (request, reply) => {
        const { id } = request.params;
        const result = await patientService.deletePatient(id);
        if (!result.success) {
            return reply.status(400).send({
                error: "Suppression échouée",
                details: result.error,
            });
        }
        return reply.status(204).send();
    });
}
