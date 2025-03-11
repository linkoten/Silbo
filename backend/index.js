"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
exports.startServer = startServer;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const user_service_1 = require("./lib/user-service");
const route_generator_1 = require("./lib/route-generator");
const server = (0, fastify_1.default)();
exports.server = server;
const userService = new user_service_1.UserService();
async function startServer() {
    // Configuration CORS pour autoriser les requêtes du frontend
    await server.register(cors_1.default, {
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
        await (0, route_generator_1.generateModelRoutes)(server, model);
    }
    // Route pour créer un utilisateur
    server.post("/users", async (request, reply) => {
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
// Démarrer le serveur si ce fichier est exécuté directement
if (require.main === module) {
    startServer();
}
