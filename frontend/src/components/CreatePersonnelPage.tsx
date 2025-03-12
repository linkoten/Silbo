import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  personnelFormSchema,
  etablissementFormSchema,
  serviceFormSchema,
} from "./userFormSchema";

import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire (sans l'ID qui est généré automatiquement)
type PersonnelFormData = z.infer<typeof personnelFormSchema>;
type EtablissementFormData = z.infer<typeof etablissementFormSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface Etablissement {
  id: string;
  nom: string;
}

interface Service {
  id: string;
  nom: string;
}

const CreatePersonnelPage: React.FC = () => {
  const [formData, setFormData] = useState<PersonnelFormData>({
    nom: "",
    prenom: "",
    dateNaissance: null,
    email: null,
    telephone: null,
    profession: "",
    specialite: null,
    matricule: null,
    serviceId: null,
    dateEmbauche: null,
    statut: "Actif",
    etablissementId: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes d'établissements et de services
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // États pour les modales
  const [showEtablissementModal, setShowEtablissementModal] =
    useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  // États pour les formulaires de modales
  const [etablissementForm, setEtablissementForm] =
    useState<EtablissementFormData>({
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

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    nom: "",
    description: null,
    etablissementId: "",
    etage: null,
    aile: null,
    capacite: 0,
    statut: "Actif",
    specialite: null,
    responsableId: null,
  });

  // Charger les établissements et services au chargement de la page
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await fetch("http://localhost:3000/etablissements");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des établissements");
        const data = await response.json();
        setEtablissements(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchEtablissements();
    fetchServices();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    // Traitement spécial pour les champs de date
    if (type === "date") {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : null,
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

  // Gestionnaires pour les formulaires de modales
  const handleEtablissementChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEtablissementForm({ ...etablissementForm, [name]: value });
  };

  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
  };

  const handleEtablissementSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/etablissements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(etablissementForm),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création de l'établissement");

      const newEtablissement = await response.json();
      setEtablissements([...etablissements, newEtablissement]);
      setShowEtablissementModal(false);

      // Optionnel: sélectionner automatiquement le nouvel établissement
      setFormData({ ...formData, etablissementId: newEtablissement.id });
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleServiceSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création du service");

      const newService = await response.json();
      setServices([...services, newService]);
      setShowServiceModal(false);

      // Optionnel: sélectionner automatiquement le nouveau service
      setFormData({ ...formData, serviceId: newService.id });
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Composant Modal réutilisable
  const Modal: React.FC<{
    show: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          {children}
        </div>
      </div>
    );
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

        {/* DateNaissance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateNaissance"
          >
            Date de naissance
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateNaissance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={
              formData.dateNaissance
                ? new Date(formData.dateNaissance).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateNaissance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateNaissance}
            </p>
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

        {/* Specialite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="specialite"
          >
            Spécialité
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.specialite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="specialite"
            type="text"
            name="specialite"
            value={formData.specialite || ""}
            onChange={handleChange}
          />
          {errors.specialite && (
            <p className="text-red-500 text-xs italic">{errors.specialite}</p>
          )}
        </div>

        {/* Matricule */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="matricule"
          >
            Matricule
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.matricule ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="matricule"
            type="text"
            name="matricule"
            value={formData.matricule || ""}
            onChange={handleChange}
          />
          {errors.matricule && (
            <p className="text-red-500 text-xs italic">{errors.matricule}</p>
          )}
        </div>

        {/* EtablissementId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="etablissementId"
            >
              Établissement
            </label>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setShowEtablissementModal(true)}
            >
              + Ajouter un établissement
            </button>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.etablissementId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="etablissementId"
            name="etablissementId"
            value={formData.etablissementId || ""}
            onChange={handleChange}
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

        {/* ServiceId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="serviceId"
            >
              Service
            </label>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setShowServiceModal(true)}
            >
              + Ajouter un service
            </button>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.serviceId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="serviceId"
            name="serviceId"
            value={formData.serviceId || ""}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="text-red-500 text-xs italic">{errors.serviceId}</p>
          )}
        </div>

        {/* DateEmbauche */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateEmbauche"
          >
            Date d'embauche
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateEmbauche ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateEmbauche"
            type="date"
            name="dateEmbauche"
            value={
              formData.dateEmbauche
                ? new Date(formData.dateEmbauche).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateEmbauche && (
            <p className="text-red-500 text-xs italic">{errors.dateEmbauche}</p>
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
            <option value="En congé">En congé</option>
            <option value="En formation">En formation</option>
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
            onClick={() => navigate("/personnels")}
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Modal pour créer un établissement */}
      <Modal
        show={showEtablissementModal}
        onClose={() => setShowEtablissementModal(false)}
        title="Ajouter un établissement"
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="etablissement-nom"
            >
              Nom de l'établissement
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="etablissement-nom"
              type="text"
              name="nom"
              value={etablissementForm.nom}
              onChange={handleEtablissementChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="etablissement-adresse"
            >
              Adresse
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="etablissement-adresse"
              type="text"
              name="adresse"
              value={etablissementForm.adresse}
              onChange={handleEtablissementChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => setShowEtablissementModal(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleEtablissementSubmit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal pour créer un service */}
      <Modal
        show={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Ajouter un service"
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="service-nom"
            >
              Nom du service
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service-nom"
              type="text"
              name="nom"
              value={serviceForm.nom}
              onChange={handleServiceChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="service-description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service-description"
              name="description"
              value={serviceForm.description || ""}
              onChange={handleServiceChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="service-etablissementId"
            >
              Établissement
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service-etablissementId"
              name="etablissementId"
              value={serviceForm.etablissementId}
              onChange={handleServiceChange}
              required
            >
              <option value="">Sélectionnez un établissement</option>
              {etablissements.map((etablissement) => (
                <option key={etablissement.id} value={etablissement.id}>
                  {etablissement.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => setShowServiceModal(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleServiceSubmit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatePersonnelPage;
