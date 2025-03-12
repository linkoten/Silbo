import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { litFormSchema, serviceFormSchema } from "./userFormSchema"; // Ou le chemin correct

import { z } from "zod";

// Utilisation du type fourni par Zod pour le formulaire (sans l'ID qui est généré automatiquement)
type LitFormData = z.infer<typeof litFormSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

// Type pour les services et patients
interface Service {
  id: string;
  nom: string;
  // Autres propriétés du service...
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  // Autres propriétés du patient...
}

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

const CreateLitPage: React.FC = () => {
  const [formData, setFormData] = useState<LitFormData>({
    numeroLit: "",
    type: "",
    statut: "",
    chambre: "",
    etage: "",
    serviceId: "",
    patientId: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // État pour les listes de services et patients
  const [services, setServices] = useState<Service[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false);

  // États pour les modals
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState<boolean>(false);

  // États pour les formulaires de création
  const [newService, setNewService] = useState<ServiceFormData>({
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

  const [newPatient, setNewPatient] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    adresse: "",
    telephone: "",
    email: "",
  });

  // Chargement des services existants
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await fetch("http://localhost:3000/services");
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  // Chargement des patients existants
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        const response = await fetch("http://localhost:3000/patients");
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des patients:", error);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "capacite") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setNewService({ ...newService, [name]: numericValue });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const handlePatientChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });
  };

  const validateForm = (): boolean => {
    try {
      // Utiliser le schéma Zod pour valider les données
      litFormSchema.parse(formData);
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

    // Créer une copie des données pour l'envoi
    const dataToSend = {
      ...formData,
    };

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/lits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du lit"
        );
      }

      // Redirection vers la liste des lits après création réussie
      navigate("/lits");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newService),
      });

      if (response.ok) {
        // Récupération du service créé pour obtenir son ID
        const createdService = await response.json();

        // Mise à jour de la liste des services
        setServices([...services, createdService]);

        // Sélection automatique du nouveau service
        setFormData({ ...formData, serviceId: createdService.id });

        // Fermeture de la modal et réinitialisation du formulaire
        setIsServiceModalOpen(false);
        setNewService({
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

        alert("Service créé avec succès !");
      } else {
        alert("Erreur lors de la création du service");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la communication avec le serveur");
    }
  };

  const handlePatientSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        // Récupération du patient créé pour obtenir son ID
        const createdPatient = await response.json();

        // Mise à jour de la liste des patients
        setPatients([...patients, createdPatient]);

        // Sélection automatique du nouveau patient
        setFormData({ ...formData, patientId: createdPatient.id });

        // Fermeture de la modal et réinitialisation du formulaire
        setIsPatientModalOpen(false);
        setNewPatient({
          nom: "",
          prenom: "",
          dateNaissance: "",
          adresse: "",
          telephone: "",
          email: "",
        });

        alert("Patient créé avec succès !");
      } else {
        alert("Erreur lors de la création du patient");
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
              Ajouter un nouveau lit
            </h1>
          </div>

          {submitError && (
            <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Numero Lit */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Numéro du lit
                </label>
                <input
                  type="text"
                  name="numeroLit"
                  value={formData.numeroLit}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.numeroLit ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                />
                {errors.numeroLit && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.numeroLit}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de lit
                </label>
                <select
                  name="type"
                  value={formData.type as string}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="Standard">Standard</option>
                  <option value="Médicalisé">Médicalisé</option>
                  <option value="Électrique">Électrique</option>
                  <option value="Pédiatrique">Pédiatrique</option>
                </select>
                {errors.type && (
                  <p className="mt-1 text-red-500 text-xs">{errors.type}</p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut as string}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.statut ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Sélectionnez un statut</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Occupé">Occupé</option>
                  <option value="En maintenance">En maintenance</option>
                  <option value="Hors service">Hors service</option>
                </select>
                {errors.statut && (
                  <p className="mt-1 text-red-500 text-xs">{errors.statut}</p>
                )}
              </div>

              {/* Chambre */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chambre
                </label>
                <input
                  type="text"
                  name="chambre"
                  value={formData.chambre as string}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.chambre ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.chambre && (
                  <p className="mt-1 text-red-500 text-xs">{errors.chambre}</p>
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
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.etage ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                />
                {errors.etage && (
                  <p className="mt-1 text-red-500 text-xs">{errors.etage}</p>
                )}
              </div>

              {/* Service ID - Avec select et bouton pour ajouter */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Service
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsServiceModalOpen(true)}
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
                    Ajouter un service
                  </button>
                </div>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.serviceId ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  required
                >
                  <option value="">Sélectionnez un service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.nom}
                    </option>
                  ))}
                </select>
                {loadingServices && (
                  <p className="text-sm text-gray-500 mt-1">
                    Chargement des services...
                  </p>
                )}
                {errors.serviceId && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.serviceId}
                  </p>
                )}
              </div>

              {/* Patient ID - Avec select et bouton pour ajouter */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Patient (optionnel)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsPatientModalOpen(true)}
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
                    Ajouter un patient
                  </button>
                </div>
                <select
                  name="patientId"
                  value={formData.patientId as string}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.patientId ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Aucun patient assigné</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.nom} {patient.prenom}
                    </option>
                  ))}
                </select>
                {loadingPatients && (
                  <p className="text-sm text-gray-500 mt-1">
                    Chargement des patients...
                  </p>
                )}
                {errors.patientId && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.patientId}
                  </p>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/lits")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? "Enregistrement..." : "Créer le lit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Modal pour créer un nouveau service */}
      <Modal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        title="Ajouter un nouveau service"
      >
        <form onSubmit={handleServiceSubmit} className="space-y-6">
          {/* Nom du service */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom du service
            </label>
            <input
              type="text"
              name="nom"
              value={newService.nom}
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
              value={newService.description as string}
              onChange={handleServiceChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Établissement ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID de l'établissement
            </label>
            <input
              type="text"
              name="etablissementId"
              value={newService.etablissementId}
              onChange={handleServiceChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Étage */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Étage
            </label>
            <input
              type="text"
              name="etage"
              value={newService.etage as string}
              onChange={handleServiceChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsServiceModalOpen(false)}
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
        </form>
      </Modal>

      {/* Modal pour créer un nouveau patient */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Ajouter un nouveau patient"
      >
        <form onSubmit={handlePatientSubmit} className="space-y-6">
          {/* Nom du patient */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={newPatient.nom}
              onChange={handlePatientChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={newPatient.prenom}
              onChange={handlePatientChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Date de naissance */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              type="date"
              name="dateNaissance"
              value={newPatient.dateNaissance}
              onChange={handlePatientChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              value={newPatient.adresse}
              onChange={handlePatientChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPatientModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer le patient
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateLitPage;
