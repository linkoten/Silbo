import fastify from "fastify";
import cors from "@fastify/cors";
import { User } from "@prisma/client";
import { generateModelRoutes } from "./lib/route-generator";

const server = fastify();

async function startServer() {
  // Configuration CORS pour autoriser les requêtes du frontend
  await server.register(cors, {
    origin: true, // Autorise toutes les origines en développement
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  // Enregistrer les routes dynamiques pour chaque modèle
  const models = [
    { modelName: "patient", pluralName: "patients" },
    { modelName: "lit", pluralName: "lits" },
    { modelName: "service", pluralName: "services" },
    { modelName: "etablissement", pluralName: "etablissements" },
    { modelName: "reservationLit", pluralName: "reservationsLit" },
    { modelName: "priseEnCharge", pluralName: "prisesEnCharge" },
    { modelName: "materiel", pluralName: "materiels" },
    { modelName: "transfert", pluralName: "transferts" },
    { modelName: "personnel", pluralName: "personnels" },
  ];

  // Enregistrer les routes pour chaque modèle
  for (const model of models) {
    await generateModelRoutes(server, model);
  }

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
