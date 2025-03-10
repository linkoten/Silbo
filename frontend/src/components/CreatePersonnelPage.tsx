import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { personnelFormSchema } from "./userFormSchema"; // Ou le chemin correct

import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire (sans l'ID qui est généré automatiquement)
type PersonnelFormData = z.infer<typeof personnelFormSchema>;

const CreatePersonnelPage: React.FC = () => {
  const [formData, setFormData] = useState<PersonnelFormData>({
    nom: "",
    prenom: "",
    profession: "",
    serviceId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target as HTMLInputElement;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    try {
      // Utiliser le schéma Zod pour valider les données
      personnelFormSchema.parse(formData);
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
    };

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/personnels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du personnel"
        );
      }

      // Redirection vers la liste des personnels après création réussie
      navigate("/personnels");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau personnel</h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Nom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nom"
          >
            Nom
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.nom ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="nom"
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
          {errors.nom && (
            <p className="text-red-500 text-xs italic">{errors.nom}</p>
          )}
        </div>

        {/* Prenom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prenom"
          >
            Prenom
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.prenom ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
          {errors.prenom && (
            <p className="text-red-500 text-xs italic">{errors.prenom}</p>
          )}
        </div>

        {/* Profession */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profession"
          >
            Profession
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.profession ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="profession"
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
          />
          {errors.profession && (
            <p className="text-red-500 text-xs italic">{errors.profession}</p>
          )}
        </div>

        {/* ServiceId */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="serviceId"
          >
            Service Id
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.serviceId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="serviceId"
            type="text"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          />
          {errors.serviceId && (
            <p className="text-red-500 text-xs italic">{errors.serviceId}</p>
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
            onClick={() => navigate("/personnels")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePersonnelPage;
