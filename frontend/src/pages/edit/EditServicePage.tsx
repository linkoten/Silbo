import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EtablissementFormValues,
  serviceFormSchema,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de base
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import du store Zustand et du composant EtablissementDialog
import { useDialogStore } from "@/stores/dialog-store";
import { useServiceStore } from "@/stores/service-store";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Utilisation du type fourni par Zod pour le formulaire
type ServiceFormData = z.infer<typeof serviceFormSchema>;

const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // État pour le formulaire de service
  const [formData, setFormData] = useState<ServiceFormData>({
    nom: "",
    description: "",
    etablissementId: "",
    etage: "",
    aile: "",
    capacite: 0,
    statut: "Actif",
    specialite: "",
    responsableId: null,
  });

  // État pour la liste des établissements
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Accès aux stores
  const { setShowEtablissementDialog } = useDialogStore();
  const {
    serviceSelectionne,
    isLoading,
    error,
    fetchServiceDetails,
    updateService,
  } = useServiceStore();

  // Chargement des détails du service et des établissements au montage du composant
  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await fetchServiceDetails(id);
      }

      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger les établissements",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
        toast({
          title: "Erreur",
          description: "Problème de communication avec le serveur",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [id, fetchServiceDetails, toast]);

  // Mettre à jour le formulaire lorsque les détails du service sont chargés
  useEffect(() => {
    if (serviceSelectionne) {
      setFormData({
        nom: serviceSelectionne.nom || "",
        description: serviceSelectionne.description || "",
        etablissementId: serviceSelectionne.etablissementId || "",
        etage: serviceSelectionne.etage || "",
        aile: serviceSelectionne.aile || "",
        capacite: serviceSelectionne.capacite || 0,
        statut: serviceSelectionne.statut || "Actif",
        specialite: serviceSelectionne.specialite || "",
        responsableId: serviceSelectionne.responsableId || null,
      });
    }
  }, [serviceSelectionne]);

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "capacite") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value === "" ? null : value });
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    try {
      serviceFormSchema.parse(formData);
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

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) {
      return;
    }

    setSubmitError(null);

    try {
      await updateService(id, formData);

      toast({
        title: "Succès",
        description: "Le service a été mis à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail du service
      navigate(`/services/${id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Erreur inconnue"
      );
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le service",
        variant: "destructive",
      });
    }
  };

  // Callback pour l'ajout d'un nouvel établissement
  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ) => {
    // Mise à jour de la liste des établissements
    setEtablissements([...etablissements, newEtablissement]);

    // Sélection automatique du nouvel établissement
    setFormData({
      ...formData,
      etablissementId: newEtablissement.id as string,
    });
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du service...
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
          onClick={() => navigate("/services")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des services
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">
              Modifier le service
            </h1>
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Nom du service */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du service
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.nom ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.nom && (
                  <p className="text-red-500 text-xs italic">{errors.nom}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Établissement */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Établissement
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEtablissementDialog(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Ajouter un établissement
                  </button>
                </div>

                <select
                  name="etablissementId"
                  value={formData.etablissementId || ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.etablissementId
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Sélectionnez un établissement</option>
                  {etablissements.map((etablissement) => (
                    <option key={etablissement.id} value={etablissement.id}>
                      {etablissement.nom}
                    </option>
                  ))}
                </select>
                {errors.etablissementId && (
                  <p className="text-red-500 text-xs italic">
                    {errors.etablissementId}
                  </p>
                )}
              </div>

              {/* Étage */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Étage
                </label>
                <input
                  type="text"
                  name="etage"
                  value={formData.etage ?? ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.etage ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.etage && (
                  <p className="text-red-500 text-xs italic">{errors.etage}</p>
                )}
              </div>

              {/* Aile */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Aile
                </label>
                <input
                  type="text"
                  name="aile"
                  value={formData.aile ?? ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.aile ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.aile && (
                  <p className="text-red-500 text-xs italic">{errors.aile}</p>
                )}
              </div>

              {/* Capacité */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Capacité
                </label>
                <input
                  type="number"
                  name="capacite"
                  value={formData.capacite}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.capacite ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  min="0"
                />
                {errors.capacite && (
                  <p className="text-red-500 text-xs italic">
                    {errors.capacite}
                  </p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut ?? ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.statut ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En maintenance">En maintenance</option>
                </select>
                {errors.statut && (
                  <p className="text-red-500 text-xs italic">{errors.statut}</p>
                )}
              </div>

              {/* Spécialité */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Spécialité
                </label>
                <input
                  type="text"
                  name="specialite"
                  value={formData.specialite ?? ""}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.specialite ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.specialite && (
                  <p className="text-red-500 text-xs italic">
                    {errors.specialite}
                  </p>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    id ? navigate(`/services/${id}`) : navigate("/services")
                  }
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Intégration du composant Dialog avec callback */}
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </div>
  );
};

export default EditServicePage;
