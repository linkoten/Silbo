import fastify from "fastify";
import cors from "@fastify/cors";
import { User } from "@prisma/client";
import { UserService } from "./lib/user-service";
import { patientRoutes } from "./routes/patients";
import { litRoutes } from "./routes/lits";
import { serviceRoutes } from "./routes/services";
import { etablissementRoutes } from "./routes/etablissement";
import { reservationLitRoutes } from "./routes/reservationLit";
import { priseEnChargeRoutes } from "./routes/priseEnCharge";
import { materielRoutes } from "./routes/materiel";
import { transfertRoutes } from "./routes/transfert";
import { personnelRoutes } from "./routes/personnel";

const server = fastify();
const userService = new UserService();

async function startServer() {
  // Configuration CORS pour autoriser les requêtes du frontend
  await server.register(cors, {
    origin: true, // Autorise toutes les origines en développement
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  // Enregistrer les routes
  await server.register(patientRoutes);
  await server.register(litRoutes);
  await server.register(serviceRoutes);
  await server.register(etablissementRoutes);
  await server.register(reservationLitRoutes);
  await server.register(priseEnChargeRoutes);
  await server.register(materielRoutes);
  await server.register(transfertRoutes);
  await server.register(personnelRoutes);

  // Route pour créer un utilisateur
  server.post<{
    Body: Omit<User, "id">; // Exclude id as it's usually auto-generated
  }>("/users", async (request, reply) => {
    const result = await userService.createUser(request.body);

    if (!result.success) {
      return reply.status(400).send({
        error: "Validation échouée",
        details: result.error,
      });
    }

    return reply.status(201).send(result.data);
  });

  // Route pour récupérer tous les utilisateurs
  server.get("/users", async (_, reply) => {
    const result = await userService.getAllUsers();

    if (!result.success) {
      return reply.status(500).send({
        error: "Erreur lors de la récupération des utilisateurs",
        details: result.error,
      });
    }

    return reply.send(result.data);
  });

  server.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

// Exporter pour les tests
export { server, startServer };

// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
  startServer();
}
