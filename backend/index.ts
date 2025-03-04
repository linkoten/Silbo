import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const server = fastify();
const prisma = new PrismaClient();

async function startServer() {
  // Configuration CORS pour autoriser les requêtes du frontend
  await server.register(cors, {
    origin: true, // Autorise toutes les origines en développement
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  // Route pour créer un utilisateur
  server.post("/users", async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string };

    // Validation basique
    if (!name || !email) {
      return reply.status(400).send({ error: "Nom et email requis" });
    }

    try {
      const user = await prisma.user.create({
        data: { name, email },
      });
      reply.send(user);
    } catch (error: any) {
      console.error(error);
      reply.status(500).send({
        error: "Erreur lors de la création de l'utilisateur",
        details: error.message,
      });
    }
  });

  // Route pour récupérer tous les utilisateurs
  server.get("/users", async (_, reply) => {
    try {
      const users = await prisma.user.findMany();
      reply.send(users);
    } catch (error) {
      console.error(error);
      reply
        .status(500)
        .send({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  server.listen({ port: 3000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

startServer();
