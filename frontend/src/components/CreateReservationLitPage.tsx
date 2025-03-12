import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  reservationLitFormSchema,
  patientFormSchema,
  litFormSchema,
  etablissementFormSchema,
} from "./userFormSchema";
import { z } from "zod";

// Types pour le formulaire
type ReservationLitFormData = z.infer<typeof reservationLitFormSchema>;
type PatientFormData = z.infer<typeof patientFormSchema>;
type LitFormData = z.infer<typeof litFormSchema>;
type EtablissementFormData = z.infer<typeof etablissementFormSchema>;

interface Patient {
  id: string;
  nom: string;
  prenom: string;
}

interface Lit {
  id: string;
  numeroLit: string;
  chambre: string | null;
}

interface Etablissement {
  id: string;
  nom: string;
}

const CreateReservationLitPage: React.FC = () => {
  const [formData, setFormData] = useState<ReservationLitFormData>({
    patientId: null,
    litId: null,
    dateArrivee: new Date(),
    dateDepart: new Date(new Date().setDate(new Date().getDate() + 1)), // Par défaut : jour suivant
    etablissementDestinationId: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes de données
  const [patients, setPatients] = useState<Patient[]>([]);
  const [lits, setLits] = useState<Lit[]>([]);
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

  // États pour les modales
  const [showPatientModal, setShowPatientModal] = useState<boolean>(false);
  const [showLitModal, setShowLitModal] = useState<boolean>(false);
  const [showEtablissementModal, setShowEtablissementModal] =
    useState<boolean>(false);

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

  const [litForm, setLitForm] = useState<LitFormData>({
    numeroLit: "",
    type: null,
    statut: "Disponible",
    serviceId: "",
    chambre: null,
    etage: null,
    patientId: null,
  });

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

    const fetchLits = async () => {
      try {
        const response = await fetch("http://localhost:3000/lits");
        if (!response.ok) throw new Error("Erreur lors du chargement des lits");
        const data = await response.json();
        setLits(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

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

    fetchPatients();
    fetchLits();
    fetchEtablissements();
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
      reservationLitFormSchema.parse(formData);
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
      const response = await fetch("http://localhost:3000/reservations-lits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création de la réservation"
        );
      }

      // Redirection vers la liste des réservations après création réussie
      navigate("/reservations-lits");
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

  const handleLitChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setLitForm({ ...litForm, [name]: value });
  };

  const handleEtablissementChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "capacite") {
      setEtablissementForm({
        ...etablissementForm,
        [name]: parseInt(value) || 0,
      });
    } else {
      setEtablissementForm({
        ...etablissementForm,
        [name]: value,
      });
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

  const handleLitSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/lits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(litForm),
      });

      if (!response.ok) throw new Error("Erreur lors de la création du lit");

      const newLit = await response.json();
      setLits([...lits, newLit]);
      setShowLitModal(false);

      // Sélectionner automatiquement le nouveau lit
      setFormData({ ...formData, litId: newLit.id });
    } catch (error) {
      console.error("Erreur:", error);
    }
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

      // Sélectionner automatiquement le nouvel établissement
      setFormData({
        ...formData,
        etablissementDestinationId: newEtablissement.id,
      });
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
      <h1 className="text-2xl font-bold mb-6">Créer une réservation de lit</h1>

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
            value={formData.patientId as string}
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

        {/* LitId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="litId"
            >
              Lit
            </label>
            <button
              type="button"
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setShowLitModal(true)}
            >
              + Ajouter un lit
            </button>
          </div>
          <select
            className={`shadow appearance-none border ${
              errors.litId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="litId"
            name="litId"
            value={formData.litId as string}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un lit</option>
            {lits.map((lit) => (
              <option key={lit.id} value={lit.id}>
                {lit.numeroLit} {lit.chambre ? `- Chambre ${lit.chambre}` : ""}
              </option>
            ))}
          </select>
          {errors.litId && (
            <p className="text-red-500 text-xs italic">{errors.litId}</p>
          )}
        </div>

        {/* DateArrivee */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateArrivee"
          >
            Date d'arrivée
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateArrivee ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateArrivee"
            type="date"
            name="dateArrivee"
            value={formData.dateArrivee.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
          {errors.dateArrivee && (
            <p className="text-red-500 text-xs italic">{errors.dateArrivee}</p>
          )}
        </div>

        {/* DateDepart */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateDepart"
          >
            Date de départ
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateDepart ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateDepart"
            type="date"
            name="dateDepart"
            value={formData.dateDepart.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
          {errors.dateDepart && (
            <p className="text-red-500 text-xs italic">{errors.dateDepart}</p>
          )}
        </div>

        {/* EtablissementDestinationId - Dropdown (optionnel) */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="etablissementDestinationId"
            >
              Établissement de destination (optionnel)
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
              errors.etablissementDestinationId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="etablissementDestinationId"
            name="etablissementDestinationId"
            value={formData.etablissementDestinationId || ""}
            onChange={handleChange}
          >
            <option value="">Aucun établissement de destination</option>
            {etablissements.map((etablissement) => (
              <option key={etablissement.id} value={etablissement.id}>
                {etablissement.nom}
              </option>
            ))}
          </select>
          {errors.etablissementDestinationId && (
            <p className="text-red-500 text-xs italic">
              {errors.etablissementDestinationId}
            </p>
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
            onClick={() => navigate("/reservations-lits")}
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

      {/* Modal pour créer un lit */}
      <Modal
        show={showLitModal}
        onClose={() => setShowLitModal(false)}
        title="Ajouter un lit"
      >
        <div className="p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lit-numeroLit"
            >
              Numéro du lit
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lit-numeroLit"
              type="text"
              name="numeroLit"
              value={litForm.numeroLit}
              onChange={handleLitChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lit-chambre"
            >
              Chambre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lit-chambre"
              type="text"
              name="chambre"
              value={litForm.chambre || ""}
              onChange={handleLitChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lit-serviceId"
            >
              ID du service
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lit-serviceId"
              type="text"
              name="serviceId"
              value={litForm.serviceId}
              onChange={handleLitChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={() => setShowLitModal(false)}
            >
              Annuler
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLitSubmit}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

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
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="etablissement-ville"
            >
              Ville
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="etablissement-ville"
              type="text"
              name="ville"
              value={etablissementForm.ville || ""}
              onChange={handleEtablissementChange}
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
    </div>
  );
};

export default CreateReservationLitPage;
