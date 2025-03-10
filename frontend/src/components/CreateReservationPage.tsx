import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { reservationLitFormSchema } from "./userFormSchema"; // Ou le chemin correct

import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire (sans l'ID qui est généré automatiquement)
type ReservationLitFormData = z.infer<typeof reservationLitFormSchema>;

const CreateReservationLitPage: React.FC = () => {
  const [formData, setFormData] = useState<ReservationLitFormData>({
    litId: "",
    patientId: "",
    dateDepart: new Date(),
    dateArrivee: new Date(),
    etablissementDestinationId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "date") {
      setFormData({
        ...formData,
        [name]: value, // value est déjà au format YYYY-MM-DD
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      // Utiliser le schéma Zod pour valider les données
      reservationLitFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convertir les erreurs Zod en un format utilisable pour l'interface
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // Valider le formulaire avant de soumettre
    if (!validateForm()) {
      return;
    }

    console.log(formData);

    // Créer une copie des données pour l'envoi
    const dataToSend = {
      ...formData,
      // S'assurer que la date est au format ISO 8601 (YYYY-MM-DD)
      dateDepart:
        formData.dateDepart instanceof Date
          ? formData.dateDepart.toISOString()
          : new Date(formData.dateDepart).toISOString(),
      dateArrivee:
        formData.dateArrivee instanceof Date
          ? formData.dateArrivee.toISOString()
          : new Date(formData.dateArrivee).toISOString(),
    };

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/reservationsLit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du reservationLit"
        );
      }

      // Redirection vers la liste des reservationsLit après création réussie
      navigate("/reservationsLit");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Ajouter un nouveau reservationLit
      </h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Lit Id */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="litId"
          >
            Lit Id
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.litId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="litId"
            type="text"
            name="litId"
            value={formData.litId}
            onChange={handleChange}
            required
          />
          {errors.litId && (
            <p className="text-red-500 text-xs italic">{errors.litId}</p>
          )}
        </div>

        {/* Patient Id */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prenom"
          >
            Patient Id
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.patientId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="patientId"
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
          {errors.patientId && (
            <p className="text-red-500 text-xs italic">{errors.patientId}</p>
          )}
        </div>

        {/* Date de Départ */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateDepart"
          >
            Date de Départ
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateDepart ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateDepart"
            type="date"
            name="dateDepart"
            value={
              formData.dateDepart instanceof Date
                ? formData.dateDepart.toISOString().split("T")[0]
                : new Date(formData.dateDepart).toISOString().split("T")[0]
            }
            onChange={handleChange}
            required
          />
          {errors.dateDepart && (
            <p className="text-red-500 text-xs italic">{errors.dateDepart}</p>
          )}
        </div>

        {/* Date D'arrivée */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateArrivee"
          >
            Date D'arrivée
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateArrivee ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateArrivee"
            type="date"
            name="dateArrivee"
            value={
              formData.dateArrivee instanceof Date
                ? formData.dateArrivee.toISOString().split("T")[0]
                : new Date(formData.dateArrivee).toISOString().split("T")[0]
            }
            onChange={handleChange}
            required
          />
          {errors.dateArrivee && (
            <p className="text-red-500 text-xs italic">{errors.dateArrivee}</p>
          )}
        </div>

        {/* Etablissement Destination Id */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="etablissementDestinationId"
          >
            Etablissement Destination Id
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.etablissementDestinationId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="etablissementDestinationId"
            type="text"
            name="etablissementDestinationId"
            value={formData.etablissementDestinationId}
            onChange={handleChange}
            required
          />
          {errors.etablissementDestinationId && (
            <p className="text-red-500 text-xs italic">
              {errors.etablissementDestinationId}
            </p>
          )}
        </div>

        {/* Boutons */}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate("/reservationsLit")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReservationLitPage;
