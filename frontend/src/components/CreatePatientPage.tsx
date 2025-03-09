import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { patientFormSchema } from "./userFormSchema"; // Ou le chemin correct

import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire (sans l'ID qui est généré automatiquement)
type PatientFormData = z.infer<typeof patientFormSchema>;

const CreatePatientPage: React.FC = () => {
  const [formData, setFormData] = useState<PatientFormData>({
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    numeroSecu: "",
    dossierMedical: null,
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
      patientFormSchema.parse(formData);
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
      dateNaissance:
        formData.dateNaissance instanceof Date
          ? formData.dateNaissance.toISOString()
          : new Date(formData.dateNaissance).toISOString(),
    };

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du patient"
        );
      }

      // Redirection vers la liste des patients après création réussie
      navigate("/patients");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau patient</h1>

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
            Nom*
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

        {/* Prénom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prenom"
          >
            Prénom*
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

        {/* Date de naissance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateNaissance"
          >
            Date de naissance*
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateNaissance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={
              formData.dateNaissance instanceof Date
                ? formData.dateNaissance.toISOString().split("T")[0]
                : new Date(formData.dateNaissance).toISOString().split("T")[0]
            }
            onChange={handleChange}
            required
          />
          {errors.dateNaissance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateNaissance}
            </p>
          )}
        </div>

        {/* Numéro de sécurité sociale */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numeroSecu"
          >
            Numéro de sécurité sociale*
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.numeroSecu ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="numeroSecu"
            type="text"
            name="numeroSecu"
            value={formData.numeroSecu}
            onChange={handleChange}
            required
          />
          {errors.numeroSecu && (
            <p className="text-red-500 text-xs italic">{errors.numeroSecu}</p>
          )}
        </div>

        {/* Dossier médical */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dossierMedical"
          >
            Dossier médical (optionnel)
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.dossierMedical ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dossierMedical"
            name="dossierMedical"
            value={formData.dossierMedical || ""}
            onChange={handleChange}
            rows={4}
          />
          {errors.dossierMedical && (
            <p className="text-red-500 text-xs italic">
              {errors.dossierMedical}
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
            onClick={() => navigate("/patients")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePatientPage;
