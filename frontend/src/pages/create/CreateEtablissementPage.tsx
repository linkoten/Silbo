import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { etablissementFormSchema } from "@/components/userFormSchema";
import { z } from "zod";

// Type pour le formulaire de l'établissement
type EtablissementFormData = z.infer<typeof etablissementFormSchema>;

const CreateEtablissementPage: React.FC = () => {
  const [formData, setFormData] = useState<EtablissementFormData>({
    nom: "",
    adresse: "",
    capacite: 0,
    telephone: null,
    email: null,
    siteWeb: null,
    codePostal: null,
    ville: null,
    pays: "France",
    statut: "Actif",
    typology: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "capacite") {
      // Pour le champ capacité, convertir la valeur en nombre
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
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
      etablissementFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création de l'établissement"
        );
      }

      // Redirection vers la liste des établissements après création réussie
      navigate("/etablissements");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Ajouter un nouvel établissement
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
        {/* Nom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="nom"
          >
            Nom de l'établissement
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

        {/* Adresse */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="adresse"
          >
            Adresse
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.adresse ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="adresse"
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
          {errors.adresse && (
            <p className="text-red-500 text-xs italic">{errors.adresse}</p>
          )}
        </div>

        {/* Code Postal */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="codePostal"
          >
            Code Postal
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.codePostal ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="codePostal"
            type="text"
            name="codePostal"
            value={formData.codePostal || ""}
            onChange={handleChange}
          />
          {errors.codePostal && (
            <p className="text-red-500 text-xs italic">{errors.codePostal}</p>
          )}
        </div>

        {/* Ville */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ville"
          >
            Ville
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.ville ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="ville"
            type="text"
            name="ville"
            value={formData.ville || ""}
            onChange={handleChange}
          />
          {errors.ville && (
            <p className="text-red-500 text-xs italic">{errors.ville}</p>
          )}
        </div>

        {/* Pays */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="pays"
          >
            Pays
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.pays ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="pays"
            type="text"
            name="pays"
            value={formData.pays}
            onChange={handleChange}
          />
          {errors.pays && (
            <p className="text-red-500 text-xs italic">{errors.pays}</p>
          )}
        </div>

        {/* Telephone */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="telephone"
          >
            Téléphone
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.telephone ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="telephone"
            type="tel"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs italic">{errors.telephone}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.email ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        {/* Site Web */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="siteWeb"
          >
            Site Web
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.siteWeb ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="siteWeb"
            type="url"
            name="siteWeb"
            placeholder="https://example.com"
            value={formData.siteWeb || ""}
            onChange={handleChange}
          />
          {errors.siteWeb && (
            <p className="text-red-500 text-xs italic">{errors.siteWeb}</p>
          )}
        </div>

        {/* Capacite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="capacite"
          >
            Capacité
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.capacite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="capacite"
            type="number"
            name="capacite"
            min="0"
            value={formData.capacite}
            onChange={handleChange}
          />
          {errors.capacite && (
            <p className="text-red-500 text-xs italic">{errors.capacite}</p>
          )}
        </div>

        {/* Typology */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="typology"
          >
            Typologie
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.typology ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="typology"
            type="text"
            name="typology"
            value={formData.typology || ""}
            onChange={handleChange}
          />
          {errors.typology && (
            <p className="text-red-500 text-xs italic">{errors.typology}</p>
          )}
        </div>

        {/* Statut */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="statut"
          >
            Statut
          </label>
          <select
            className={`shadow appearance-none border ${
              errors.statut ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="statut"
            name="statut"
            value={formData.statut || "Actif"}
            onChange={handleChange}
          >
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="En construction">En construction</option>
            <option value="En rénovation">En rénovation</option>
          </select>
          {errors.statut && (
            <p className="text-red-500 text-xs italic">{errors.statut}</p>
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
            onClick={() => navigate("/etablissements")}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEtablissementPage;
