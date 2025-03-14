import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  priseEnChargeFormSchema,
  PersonnelFormValues,
  PatientFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de base
import { Button } from "@/components/ui/button";

// Import du store Zustand et des composants Dialog
import { useDialogStore } from "@/stores/dialog-store";
import PatientDialog from "@/components/dialogs/PatientDialog";
import PersonnelDialog from "@/components/dialogs/PersonnelDialog"; // Ce composant doit être créé

// Types pour le formulaire
type PriseEnChargeFormData = z.infer<typeof priseEnChargeFormSchema>;

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
  const [personnels, setPersonnels] = useState<PersonnelFormValues[]>([]);
  const [patients, setPatients] = useState<PatientFormValues[]>([]);

  // Accès au store dialog avec actions pour ouvrir les dialogs
  const { setShowPatientDialog, setShowPersonnelDialog } = useDialogStore();

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

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues): void => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    setFormData((prevData) => ({
      ...prevData,
      patientId: newPatient.id as string,
    }));
  };

  const handlePersonnelCreated = (newPersonnel: PersonnelFormValues): void => {
    setPersonnels((prevPersonnels) => [...prevPersonnels, newPersonnel]);
    setFormData((prevData) => ({
      ...prevData,
      personnelId: newPersonnel.id as string,
    }));
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
              onClick={() => setShowPersonnelDialog(true)}
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
              onClick={() => setShowPatientDialog(true)}
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
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() => navigate("/prises-en-charge")}
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Intégration des composants Dialog avec callbacks */}
      <PatientDialog onPatientCreated={handlePatientCreated} />
      <PersonnelDialog onPersonnelCreated={handlePersonnelCreated} />
    </div>
  );
};

export default CreatePriseEnChargePage;
