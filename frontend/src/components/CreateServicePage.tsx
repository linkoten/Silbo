import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Etablissement, serviceFormSchema } from "./userFormSchema";
import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire
type ServiceFormData = z.infer<typeof serviceFormSchema>;

// Composant Modal réutilisable
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg mx-auto my-6">
        <div className="bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-medium text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

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

  // État pour la modal d'ajout d'établissement
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État pour le formulaire d'établissement
  const [newEtablissement, setNewEtablissement] = useState<
    Omit<Etablissement, "id">
  >({
    nom: "",
    adresse: "",
    capacite: 0,
    telephone: "",
    email: "",
    siteWeb: "",
    codePostal: "",
    ville: "",
    pays: "France",
    statut: "Actif",
    typology: "",
  });

  // État pour la liste des établissements
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

  // État pour gérer le chargement
  const [loading, setLoading] = useState(false);

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

  // Gestion des changements dans le formulaire d'établissement
  const handleEtablissementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: string | number = value;

    // Convert numeric fields to numbers
    if (name === "capacite") {
      processedValue = value === "" ? 0 : parseInt(value, 10);
    }

    setNewEtablissement({ ...newEtablissement, [name]: processedValue });
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

  // Soumission du formulaire d'établissement
  const handleEtablissementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEtablissement),
      });

      if (response.ok) {
        // Récupération de l'établissement créé pour obtenir son ID
        const createdEtablissement = await response.json();

        // Mise à jour de la liste des établissements
        setEtablissements([...etablissements, createdEtablissement]);

        // Sélection automatique du nouvel établissement
        setFormData({ ...formData, etablissementId: createdEtablissement.id });

        // Fermeture de la modal et réinitialisation du formulaire
        setIsModalOpen(false);
        setNewEtablissement({
          nom: "",
          adresse: "",
          capacite: 0,
          telephone: "",
          email: "",
          siteWeb: "",
          codePostal: "",
          ville: "",
          pays: "France",
          statut: "Actif",
          typology: "",
        });

        // Message de confirmation
        alert("Établissement créé avec succès !");
      } else {
        alert("Erreur lors de la création de l'établissement");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la communication avec le serveur");
    }
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
                  value={formData.description as string}
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
                    onClick={() => setIsModalOpen(true)}
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
                  value={formData.etage as string}
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
                  value={formData.aile as string}
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
                  value={formData.statut as string}
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
                  value={formData.specialite as string}
                  onChange={handleServiceChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/services")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer le service
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal pour créer un nouvel établissement */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un nouvel établissement"
      >
        <form onSubmit={handleEtablissementSubmit} className="space-y-6">
          {/* Nom de l'établissement */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'établissement
            </label>
            <input
              type="text"
              name="nom"
              value={newEtablissement.nom}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              name="adresse"
              value={newEtablissement.adresse}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Code Postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code Postal
            </label>
            <input
              type="text"
              name="codePostal"
              value={newEtablissement.codePostal as string}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Ville */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Ville
            </label>
            <input
              type="text"
              name="ville"
              value={newEtablissement.ville as string}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
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
              value={newEtablissement.capacite}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={newEtablissement.telephone as string}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={newEtablissement.email as string}
              onChange={handleEtablissementChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer l'établissement
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateServicePage;
