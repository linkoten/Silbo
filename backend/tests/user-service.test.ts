import { PrismaClient } from "@prisma/client";
import { UserService } from "../user-service";

// Mock de Prisma
jest.mock("@prisma/client", () => {
  const mockCreate = jest.fn();
  const mockFindMany = jest.fn();

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: mockCreate,
        findMany: mockFindMany,
      },
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    })),
  };
});

describe("UserService", () => {
  let userService: UserService;
  let prisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = new PrismaClient();
    userService = new UserService();
  });

  describe("createUser", () => {
    it("devrait créer un utilisateur avec des données valides", async () => {
      const userData = { name: "Test User", email: "test@example.com" };

      const createdUser = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(createdUser);

      jest.mock("../schema", () => ({
        createUserSchema: {
          safeParse: jest.fn().mockReturnValue({
            success: true,
            data: userData,
          }),
        },
      }));

      const result = await userService.createUser(userData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdUser);
    });

    it("devrait retourner une erreur si la validation échoue", async () => {
      // Mock des données d'entrée
      const invalidUserData = {
        // Données manquantes
        name: "Test User",
        // email manquant
      };

      // Mock de l'erreur de validation zod
      const zodError = {
        format: () => ({
          email: {
            _errors: ["Email est requis"],
          },
        }),
      };

      // Override du mock pour simuler un échec de validation
      jest.doMock("../schema", () => ({
        createUserSchema: {
          safeParse: jest.fn().mockReturnValue({
            success: false,
            error: zodError,
          }),
        },
      }));

      // Appel de la méthode à tester
      const result = await userService.createUser(invalidUserData as any);

      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Mock des données d'entrée
      const userData = {
        name: "Test User",
        email: "test@example.com",
      };

      // Configuration du mock pour simuler une erreur
      (prisma.user.create as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      // Mock de la validation zod (simulons qu'elle réussit)
      jest.mock("../schema", () => ({
        createUserSchema: {
          safeParse: jest.fn().mockReturnValue({
            success: true,
            data: userData,
          }),
        },
      }));

      // Appel de la méthode à tester
      const result = await userService.createUser(userData);

      // Vérifications
      expect(result.success).toStrictEqual(false);
      expect(result.error).toStrictEqual({
        code: undefined,
        message: "Database error",
      });
    });
  });

  describe("getAllUsers", () => {
    it("devrait récupérer tous les utilisateurs avec succès", async () => {
      // Mock de la réponse de Prisma
      const users = [
        {
          id: "1",
          name: "User 1",
          email: "user1@example.com",
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
        },
      ];

      // Configuration du mock
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      // Appel de la méthode à tester
      const result = await userService.getAllUsers();

      // Vérifications
      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
    });

    it("devrait gérer les erreurs lors de la récupération des utilisateurs", async () => {
      // Configuration du mock pour simuler une erreur
      (prisma.user.findMany as jest.Mock).mockRejectedValue(
        new Error("Database connection error")
      );

      // Appel de la méthode à tester
      const result = await userService.getAllUsers();

      // Vérifications
      expect(result.success).toBe(false);
      expect(result.error!.message).toBe("Database connection error");
    });
  });
});
