import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  EtablissementFormValues,
  serviceFormSchema,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de base
import { Button } from "@/components/ui/button";

// Import du store Zustand et du composant EtablissementDialog
import { useDialogStore } from "@/stores/dialog-store";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Utilisation du type fourni par Zod pour le formulaire
type ServiceFormData = z.infer<typeof serviceFormSchema>;

const CreateServicePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const etablissementIdParam = searchParams.get("etablissementId") || "";

  // État pour le formulaire de service
  const [formData, setFormData] = useState<ServiceFormData>({
    nom: "",
    description: "",
    etablissementId: etablissementIdParam,
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

  // État pour gérer le chargement
  const [loading, setLoading] = useState(false);

  // Accès au store dialog pour gérer le dialog d'établissement
  const { setShowEtablissementDialog } = useDialogStore();

  // Chargement des établissements existants
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);

          // Si un établissement existe et qu'aucun n'est sélectionné, on prend le premier
          if (data.length > 0 && !formData.etablissementId) {
            setFormData((prev) => ({ ...prev, etablissementId: data[0].id }));
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEtablissements();
  }, []);

  // Gestion des changements dans le formulaire de service
  const handleServiceChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "capacite") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Soumission du formulaire de service
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/services");
      } else {
        alert("Erreur lors de la création du service");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la communication avec le serveur");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8">
            <h1 className="text-2xl font-bold text-white">
              Créer un nouveau service
            </h1>
          </div>

          <form onSubmit={handleServiceSubmit} className="p-8">
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
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
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
                  value={formData.etablissementId}
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Sélectionnez un établissement</option>
                  {etablissements.map((etablissement) => (
                    <option key={etablissement.id} value={etablissement.id}>
                      {etablissement.nom}
                    </option>
                  ))}
                </select>
                {loading && (
                  <p className="text-sm text-gray-500 mt-1">
                    Chargement des établissements...
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
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
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
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
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
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut ?? ""}
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="En maintenance">En maintenance</option>
                </select>
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
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/services")}
                >
                  Annuler
                </Button>
                <Button type="submit">Créer le service</Button>
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

export default CreateServicePage;
