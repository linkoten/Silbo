import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { etablissementFormSchema } from "@/components/userFormSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEtablissementStore } from "@/stores/etablissement-store";

// Utilisation du type fourni par Zod pour le formulaire
type EtablissementFormData = z.infer<typeof etablissementFormSchema>;

const EditEtablissementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // État initial du formulaire
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Utilisation du store pour la gestion d'état
  const {
    etablissementSelectionne,
    isLoading,
    error,
    fetchEtablissementDetails,
    updateEtablissement,
  } = useEtablissementStore();

  // Charger les détails de l'établissement lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchEtablissementDetails(id);
    }
  }, [id, fetchEtablissementDetails]);

  // Mettre à jour le formulaire lorsque les détails de l'établissement sont chargés
  useEffect(() => {
    if (etablissementSelectionne) {
      setFormData({
        nom: etablissementSelectionne.nom,
        adresse: etablissementSelectionne.adresse,
        capacite: etablissementSelectionne.capacite || 0,
        telephone: etablissementSelectionne.telephone || null,
        email: etablissementSelectionne.email || null,
        siteWeb: etablissementSelectionne.siteWeb || null,
        codePostal: etablissementSelectionne.codePostal || null,
        ville: etablissementSelectionne.ville || null,
        pays: etablissementSelectionne.pays || "France",
        statut: etablissementSelectionne.statut || "Actif",
        typology: etablissementSelectionne.typology || null,
      });
    }
  }, [etablissementSelectionne]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    // Traitement spécial pour les champs numériques
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === "" ? null : value,
      });
    }
  };

  const validateForm = (): boolean => {
    try {
      // Utiliser le schéma Zod pour valider les données
      etablissementFormSchema.parse(formData);
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
    if (!validateForm() || !id) {
      return;
    }

    setSubmitError(null);

    try {
      // Utiliser le store pour mettre à jour l'établissement
      await updateEtablissement(id, formData);

      toast({
        title: "Succès",
        description:
          "Les informations de l'établissement ont été mises à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail de l'établissement après modification réussie
      navigate(`/etablissements/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour les informations de l'établissement",
        variant: "destructive",
      });
    }
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations de l'établissement...
          </p>
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur si le chargement a échoué
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <Button
          onClick={() => navigate("/etablissements")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des établissements
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Modifier les informations de l'établissement
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

        {/* Code postal */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="codePostal"
          >
            Code postal
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
            value={formData.siteWeb || ""}
            onChange={handleChange}
            placeholder="https://"
          />
          {errors.siteWeb && (
            <p className="text-red-500 text-xs italic">{errors.siteWeb}</p>
          )}
        </div>

        {/* Typology */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="typology"
          >
            Type d'établissement
          </label>
          <select
            className={`shadow appearance-none border ${
              errors.typology ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="typology"
            name="typology"
            value={formData.typology || ""}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un type</option>
            <option value="Hôpital">Hôpital</option>
            <option value="Clinique">Clinique</option>
            <option value="EHPAD">EHPAD</option>
            <option value="Centre de soins">Centre de soins</option>
            <option value="Autre">Autre</option>
          </select>
          {errors.typology && (
            <p className="text-red-500 text-xs italic">{errors.typology}</p>
          )}
        </div>

        {/* Capacite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="capacite"
          >
            Capacité (nombre de lits)
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.capacite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="capacite"
            type="number"
            name="capacite"
            value={formData.capacite}
            onChange={handleChange}
            min="0"
          />
          {errors.capacite && (
            <p className="text-red-500 text-xs italic">{errors.capacite}</p>
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
            <option value="En maintenance">En maintenance</option>
          </select>
          {errors.statut && (
            <p className="text-red-500 text-xs italic">{errors.statut}</p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() =>
              id
                ? navigate(`/etablissements/${id}`)
                : navigate("/etablissements")
            }
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEtablissementPage;
