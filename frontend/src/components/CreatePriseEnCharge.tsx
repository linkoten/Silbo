import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  priseEnChargeFormSchema,
  personnelFormSchema,
  patientFormSchema,
} from "./userFormSchema";
import { z } from "zod";

// Types pour le formulaire
type PriseEnChargeFormData = z.infer<typeof priseEnChargeFormSchema>;
type PersonnelFormData = z.infer<typeof personnelFormSchema>;
type PatientFormData = z.infer<typeof patientFormSchema>;

interface Personnel {
  id: string;
  nom: string;
  prenom: string;
  profession: string;
}

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

const CreatePriseEnChargePage: React.FC = () => {
  const [formData, setFormData] = useState<PriseEnChargeFormData>({
    personnelId: "",
    patientId: "",
    dateDebut: new Date(),
    dateFin: null,
    description: null,
    diagnostic: null,
    traitement: null,
    notes: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes de données
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  // États pour les modales
  const [showPersonnelModal, setShowPersonnelModal] = useState<boolean>(false);
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);

  // États pour les formulaires de modales
  const [personnelForm, setPersonnelForm] = useState<PersonnelFormData>({
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

  // Charger les données au chargement de la page
  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        const response = await fetch("http://localhost:3000/personnels");
        if (!response.ok)
          throw new Error("Erreur lors du chargement du personnel");
        const data = await response.json();
        setPersonnels(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

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

    fetchPersonnels();
    fetchPatients();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

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
      priseEnChargeFormSchema.parse(formData);
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
      const response = await fetch("http://localhost:3000/prises-en-charge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details ||
            "Erreur lors de la création de la prise en charge"
        );
      }

      // Redirection vers la liste des prises en charge après création réussie
      navigate("/prises-en-charge");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaires pour les formulaires de modales
  const handlePersonnelChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "date") {
      setPersonnelForm({
        ...personnelForm,
        [name]: value ? new Date(value) : null,
      });
    } else {
      setPersonnelForm({
        ...personnelForm,
        [name]: value,
      });
    }
  };

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

  const handlePersonnelSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/personnels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(personnelForm),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création du personnel");

      const newPersonnel = await response.json();
      setPersonnels([...personnels, newPersonnel]);
      setShowPersonnelModal(false);

      // Sélectionner automatiquement le nouveau personnel
      setFormData({ ...formData, personnelId: newPersonnel.id });
    } catch (error) {
      console.error("Erreur:", error);
    }
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
      <h1 className="text-2xl font-bold mb-6">
        Créer une nouvelle prise en charge
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
        {/* PersonnelId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="personnelId"
            >
              Personnel
            </label>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setShowPersonnelModal(true)}
            >
              + Ajouter un personnel
            </button>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.personnelId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="personnelId"
            name="personnelId"
            value={formData.personnelId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un personnel</option>
            {personnels.map((personnel) => (
              <option key={personnel.id} value={personnel.id}>
                {personnel.nom} {personnel.prenom} - {personnel.profession}
              </option>
            ))}
          </select>
          {errors.personnelId && (
            <p className="text-red-500 text-xs italic">{errors.personnelId}</p>
          )}
        </div>

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

        {/* DateDebut */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateDebut"
          >
            Date de début
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateDebut ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateDebut"
            type="date"
            name="dateDebut"
            value={formData.dateDebut.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
          {errors.dateDebut && (
            <p className="text-red-500 text-xs italic">{errors.dateDebut}</p>
          )}
        </div>

        {/* DateFin */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateFin"
          >
            Date de fin
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateFin ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateFin"
            type="date"
            name="dateFin"
            value={
              formData.dateFin
                ? formData.dateFin.toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateFin && (
            <p className="text-red-500 text-xs italic">{errors.dateFin}</p>
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

        {/* Diagnostic */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="diagnostic"
          >
            Diagnostic
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.diagnostic ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="diagnostic"
            name="diagnostic"
            value={formData.diagnostic || ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.diagnostic && (
            <p className="text-red-500 text-xs italic">{errors.diagnostic}</p>
          )}
        </div>

        {/* Traitement */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="traitement"
          >
            Traitement
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.traitement ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="traitement"
            name="traitement"
            value={formData.traitement || ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.traitement && (
            <p className="text-red-500 text-xs italic">{errors.traitement}</p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="notes"
          >
            Notes
          </label>
          <textarea
            className={`shadow appearance-none border ${
              errors.notes ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="notes"
            name="notes"
            value={formData.notes || ""}
            onChange={handleChange}
            rows={3}
          />
          {errors.notes && (
            <p className="text-red-500 text-xs italic">{errors.notes}</p>
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
            onClick={() => navigate("/prises-en-charge")}
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Modal pour créer un personnel */}
      <Modal
        show={showPersonnelModal}
        onClose={() => setShowPersonnelModal(false)}
        title="Ajouter un personnel"
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="personnel-nom"
            >
              Nom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="personnel-nom"
              type="text"
              name="nom"
              value={personnelForm.nom}
              onChange={handlePersonnelChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="personnel-prenom"
            >
              Prénom
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="personnel-prenom"
              type="text"
              name="prenom"
              value={personnelForm.prenom}
              onChange={handlePersonnelChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="personnel-profession"
            >
              Profession
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="personnel-profession"
              type="text"
              name="profession"
              value={personnelForm.profession}
              onChange={handlePersonnelChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => setShowPersonnelModal(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handlePersonnelSubmit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

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
    </div>
  );
};

export default CreatePriseEnChargePage;
