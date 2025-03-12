import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  transfertFormSchema,
  patientFormSchema,
  serviceFormSchema,
} from "./userFormSchema";
import { z } from "zod";

// Types pour le formulaire
type TransfertFormData = z.infer<typeof transfertFormSchema>;
type PatientFormData = z.infer<typeof patientFormSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface Service {
  id: string;
  nom: string;
}

const CreateTransfertPage: React.FC = () => {
  const [formData, setFormData] = useState<TransfertFormData>({
    serviceDepartId: "",
    serviceArriveeId: "",
    patientId: "",
    motif: null,
    date: new Date(),
    statut: "Planifié",
    autorisePar: null,
    realiseePar: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes de données
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // États pour les modales
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);
  const [showServiceModal, setShowServiceModal] = useState<boolean>(false);

  // États pour les formulaires de modales
  const [patientForm, setPatientForm] = useState<PatientFormData>({
    nom: "",
    prenom: "",
    dateNaissance: new Date(),
    adresse: null,
    telephone: null,
    email: null,
    numeroSecu: null,
    groupeSanguin: null,
    allergie: null,
    antecedents: null,
    dateAdmission: new Date(),
    dateSortie: null,
    statut: "Hospitalisé",
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

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/patients");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des patients");
        const data = await response.json();
        setPatients(data);
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

    fetchPatients();
    fetchServices();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    if (type === "date") {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : new Date(),
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
      transfertFormSchema.parse(formData);
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
      const response = await fetch("http://localhost:3000/transferts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du transfert"
        );
      }

      // Redirection vers la liste des transferts après création réussie
      navigate("/transferts");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaires pour les formulaires de modales
  const handlePatientChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "date") {
      setPatientForm({
        ...patientForm,
        [name]: value ? new Date(value) : null,
      });
    } else {
      setPatientForm({
        ...patientForm,
        [name]: value,
      });
    }
  };

  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setServiceForm({ ...serviceForm, [name]: value });
  };

  const handlePatientSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patientForm),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création du patient");

      const newPatient = await response.json();
      setPatients([...patients, newPatient]);
      setShowPatientModal(false);

      // Sélectionner automatiquement le nouveau patient
      setFormData({ ...formData, patientId: newPatient.id });
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
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau transfert</h1>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {submitError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* PatientId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="patientId"
            >
              Patient
            </label>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setShowPatientModal(true)}
            >
              + Ajouter un patient
            </button>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.patientId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="patientId"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.nom} {patient.prenom}
              </option>
            ))}
          </select>
          {errors.patientId && (
            <p className="text-red-500 text-xs italic">{errors.patientId}</p>
          )}
        </div>

        {/* ServiceDepartId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="serviceDepartId"
            >
              Service de départ
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
              errors.serviceDepartId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="serviceDepartId"
            name="serviceDepartId"
            value={formData.serviceDepartId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un service de départ</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
          {errors.serviceDepartId && (
            <p className="text-red-500 text-xs italic">
              {errors.serviceDepartId}
            </p>
          )}
        </div>

        {/* ServiceArriveeId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="serviceArriveeId"
            >
              Service d'arrivée
            </label>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.serviceArriveeId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="serviceArriveeId"
            name="serviceArriveeId"
            value={formData.serviceArriveeId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un service d'arrivée</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
          {errors.serviceArriveeId && (
            <p className="text-red-500 text-xs italic">
              {errors.serviceArriveeId}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date de transfert
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.date ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="date"
            type="date"
            name="date"
            value={formData.date.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
          {errors.date && (
            <p className="text-red-500 text-xs italic">{errors.date}</p>
          )}
        </div>

        {/* Motif */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="motif"
          >
            Motif
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.motif ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="motif"
            name="motif"
            value={formData.motif || ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.motif && (
            <p className="text-red-500 text-xs italic">{errors.motif}</p>
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
            value={formData.statut || "Planifié"}
            onChange={handleChange}
          >
            <option value="Planifié">Planifié</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="Annulé">Annulé</option>
          </select>
          {errors.statut && (
            <p className="text-red-500 text-xs italic">{errors.statut}</p>
          )}
        </div>

        {/* AutorisePar */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="autorisePar"
          >
            Autorisé par
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.autorisePar ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="autorisePar"
            type="text"
            name="autorisePar"
            value={formData.autorisePar || ""}
            onChange={handleChange}
          />
          {errors.autorisePar && (
            <p className="text-red-500 text-xs italic">{errors.autorisePar}</p>
          )}
        </div>

        {/* RealiseePar */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="realiseePar"
          >
            Réalisé par
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.realiseePar ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="realiseePar"
            type="text"
            name="realiseePar"
            value={formData.realiseePar || ""}
            onChange={handleChange}
          />
          {errors.realiseePar && (
            <p className="text-red-500 text-xs italic">{errors.realiseePar}</p>
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
            onClick={() => navigate("/transferts")}
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Modal pour créer un patient */}
      <Modal
        show={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        title="Ajouter un patient"
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="patient-nom"
            >
              Nom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="patient-nom"
              type="text"
              name="nom"
              value={patientForm.nom}
              onChange={handlePatientChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="patient-prenom"
            >
              Prénom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="patient-prenom"
              type="text"
              name="prenom"
              value={patientForm.prenom}
              onChange={handlePatientChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="patient-dateNaissance"
            >
              Date de naissance
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="patient-dateNaissance"
              type="date"
              name="dateNaissance"
              value={patientForm.dateNaissance.toISOString().split("T")[0]}
              onChange={handlePatientChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => setShowPatientModal(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePatientSubmit}
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

export default CreateTransfertPage;
