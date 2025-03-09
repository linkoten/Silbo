import { FastifyInstance } from "fastify";
import { PatientService } from "../lib/patients-service";

interface PatientBody {
  nom: string;
  prenom: string;
  dateNaissance: Date;
  numeroSecu: string;
  dossierMedical: string | null | undefined;
}

export async function patientRoutes(server: FastifyInstance) {
  const patientService = new PatientService();

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
  server.post<{
    Body: PatientBody;
  }>("/patients", async (request, reply) => {
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
