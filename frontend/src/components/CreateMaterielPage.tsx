import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { materielFormSchema, serviceFormSchema } from "./userFormSchema";
import { z } from "zod";

// Types pour le formulaire
type MaterielFormData = z.infer<typeof materielFormSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface Service {
  id: string;
  nom: string;
}

const CreateMaterielPage: React.FC = () => {
  const [formData, setFormData] = useState<MaterielFormData>({
    nom: "",
    description: null,
    quantite: 1,
    type: null,
    marque: null,
    modele: null,
    numeroSerie: null,
    dateAchat: null,
    dateMaintenance: null,
    statut: "En Service",
    serviceId: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // État pour la liste des services
  const [services, setServices] = useState<Service[]>([]);

  // État pour la modale de création de service
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
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

  // Charger la liste des services au chargement de la page
  useEffect(() => {
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

    fetchServices();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    if (name === "quantite") {
      // Pour le champ quantité, convertir la valeur en nombre
      setFormData({
        ...formData,
        [name]: parseInt(value) || 1,
      });
    } else if (type === "date") {
      // Pour les champs de date
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
      materielFormSchema.parse(formData);
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
      const response = await fetch("http://localhost:3000/materiels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du matériel"
        );
      }

      // Redirection vers la liste des matériels après création réussie
      navigate("/materiels");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire pour le formulaire de la modale de service
  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
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

      // Sélectionner automatiquement le nouveau service
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
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau matériel</h1>

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
            Nom du matériel
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

        {/* Description */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.description ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-xs italic">{errors.description}</p>
          )}
        </div>

        {/* Type */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.type ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="type"
            type="text"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
          />
          {errors.type && (
            <p className="text-red-500 text-xs italic">{errors.type}</p>
          )}
        </div>

        {/* Marque */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="marque"
          >
            Marque
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.marque ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="marque"
            type="text"
            name="marque"
            value={formData.marque || ""}
            onChange={handleChange}
          />
          {errors.marque && (
            <p className="text-red-500 text-xs italic">{errors.marque}</p>
          )}
        </div>

        {/* Modele */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="modele"
          >
            Modèle
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.modele ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="modele"
            type="text"
            name="modele"
            value={formData.modele || ""}
            onChange={handleChange}
          />
          {errors.modele && (
            <p className="text-red-500 text-xs italic">{errors.modele}</p>
          )}
        </div>

        {/* NumeroSerie */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numeroSerie"
          >
            Numéro de série
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.numeroSerie ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="numeroSerie"
            type="text"
            name="numeroSerie"
            value={formData.numeroSerie || ""}
            onChange={handleChange}
          />
          {errors.numeroSerie && (
            <p className="text-red-500 text-xs italic">{errors.numeroSerie}</p>
          )}
        </div>

        {/* Quantite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quantite"
          >
            Quantité
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.quantite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="quantite"
            type="number"
            name="quantite"
            min="1"
            value={formData.quantite}
            onChange={handleChange}
            required
          />
          {errors.quantite && (
            <p className="text-red-500 text-xs italic">{errors.quantite}</p>
          )}
        </div>

        {/* DateAchat */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateAchat"
          >
            Date d'achat
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateAchat ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateAchat"
            type="date"
            name="dateAchat"
            value={
              formData.dateAchat
                ? new Date(formData.dateAchat).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateAchat && (
            <p className="text-red-500 text-xs italic">{errors.dateAchat}</p>
          )}
        </div>

        {/* DateMaintenance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateMaintenance"
          >
            Date de maintenance
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateMaintenance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateMaintenance"
            type="date"
            name="dateMaintenance"
            value={
              formData.dateMaintenance
                ? new Date(formData.dateMaintenance).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateMaintenance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateMaintenance}
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
            value={formData.statut || "En Service"}
            onChange={handleChange}
          >
            <option value="En Service">En Service</option>
            <option value="Hors Service">Hors Service</option>
            <option value="En Maintenance">En Maintenance</option>
            <option value="En Réparation">En Réparation</option>
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
            onClick={() => navigate("/materiels")}
          >
            Annuler
          </button>
        </div>
      </form>

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
              ID de l'établissement
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="service-etablissementId"
              type="text"
              name="etablissementId"
              value={serviceForm.etablissementId}
              onChange={handleServiceChange}
              required
            />
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

export default CreateMaterielPage;
