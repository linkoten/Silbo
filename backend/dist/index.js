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
        const { name, email } = request.body;
        // Validation basique
        if (!name || !email) {
            return reply.status(400).send({ error: "Nom et email requis" });
        }
        try {
            const user = await prisma.user.create({
                data: { name, email },
            });
            reply.send(user);
        }
        catch (error) {
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
        }
        catch (error) {
            console.error(error);
            reply
                .status(500)
                .send({ error: "Erreur lors de la récupération des utilisateurs" });
        }
    });
    // Lancer le serveur
    try {
        const address = await server.listen({ port: 3000, host: "0.0.0.0" });
        console.log(`Serveur démarré sur ${address}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
startServer();
