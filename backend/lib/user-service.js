"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const schema_1 = require("../schema");
const prisma = new client_1.PrismaClient();
class UserService {
    // Créer un utilisateur avec validation
    async createUser(data) {
        // Valider les données avec Zod
        const result = schema_1.userSchema.safeParse(data);
        if (!result.success) {
            return {
                success: false,
                error: result.error.format(),
            };
        }
        const validatedData = result.data;
        try {
            const user = await prisma.user.create({
                data: validatedData,
            });
            return {
                success: true,
                data: user,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code,
                },
            };
        }
    }
    // Récupérer tous les utilisateurs
    async getAllUsers() {
        try {
            const users = await prisma.user.findMany();
            return {
                success: true,
                data: users,
            };
        }
        catch (error) {
            return {
                success: false,
                error: {
                    message: error.message,
                },
            };
        }
    }
}
exports.UserService = UserService;
