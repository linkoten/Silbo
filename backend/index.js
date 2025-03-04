"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const server = (0, fastify_1.default)();
const prisma = new client_1.PrismaClient();
async function startServer() {
    // Configuration CORS pour autoriser les requêtes du frontend
    await server.register(cors_1.default, {
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
    server.listen({ port: 3000 }, (err, address) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Server listening at ${address}`);
    });
}
startServer();
