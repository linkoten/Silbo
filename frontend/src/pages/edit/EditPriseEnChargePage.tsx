import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  priseEnChargeFormSchema,
  PatientFormValues,
  PersonnelFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import du store Zustand et des composants Dialog
import { useDialogStore } from "@/stores/dialog-store";
import { usePriseEnChargeStore } from "@/stores/prise-en-charge-store";
import PatientDialog from "@/components/dialogs/PatientDialog";
import PersonnelDialog from "@/components/dialogs/PersonnelDialog";

// Utilisation du type fourni par Zod pour le formulaire
type PriseEnChargeFormData = z.infer<typeof priseEnChargeFormSchema>;

const EditPriseEnChargePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // État initial du formulaire
  const [formData, setFormData] = useState<PriseEnChargeFormData>({
    patientId: "",
    personnelId: "",
    dateDebut: new Date(),
    dateFin: null,
    description: "",
    diagnostic: "",
    traitement: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // États pour les listes de patients et personnels
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [personnels, setPersonnels] = useState<PersonnelFormValues[]>([]);
  const [loadingRelations, setLoadingRelations] = useState<boolean>(false);

  // Utilisation des stores pour la gestion d'état
  const { setShowPatientDialog, setShowPersonnelDialog } = useDialogStore();
  const {
    priseEnChargeSelectionnee,
    isLoading,
    error,
    fetchPriseEnChargeDetails,
    updatePriseEnCharge,
  } = usePriseEnChargeStore();

  // Charger les détails de la prise en charge lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPriseEnChargeDetails(id);
    }
  }, [id, fetchPriseEnChargeDetails]);

  // Charger les patients et personnels
  useEffect(() => {
    const fetchRelations = async () => {
      setLoadingRelations(true);
      try {
        // Charger les patients
        const patientsResponse = await fetch("http://localhost:3000/patients");
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json();
          setPatients(patientsData);
        }

        // Charger les personnels
        const personnelsResponse = await fetch(
          "http://localhost:3000/personnels"
        );
        if (personnelsResponse.ok) {
          const personnelsData = await personnelsResponse.json();
          setPersonnels(personnelsData);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des relations:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données associées",
          variant: "destructive",
        });
      } finally {
        setLoadingRelations(false);
      }
    };

    fetchRelations();
  }, [toast]);

  // Mettre à jour le formulaire lorsque les détails de la prise en charge sont chargés
  useEffect(() => {
    if (priseEnChargeSelectionnee) {
      setFormData({
        patientId: priseEnChargeSelectionnee.patientId,
        personnelId: priseEnChargeSelectionnee.personnelId,
        dateDebut: new Date(priseEnChargeSelectionnee.dateDebut),
        dateFin: priseEnChargeSelectionnee.dateFin
          ? new Date(priseEnChargeSelectionnee.dateFin)
          : null,
        description: priseEnChargeSelectionnee.description || "",
        diagnostic: priseEnChargeSelectionnee.diagnostic || "",
        traitement: priseEnChargeSelectionnee.traitement || "",
        notes: priseEnChargeSelectionnee.notes || "",
      });
    }
  }, [priseEnChargeSelectionnee]);

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
      priseEnChargeFormSchema.parse(formData);
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
    if (!validateForm() || !id) {
      return;
    }

    setSubmitError(null);

    try {
      // Convert Date objects to ISO strings before submission
      const formDataForSubmit = {
        ...formData,
        dateDebut: formData.dateDebut ? formData.dateDebut.toISOString() : "",
        dateFin: formData.dateFin ? formData.dateFin.toISOString() : null,
      };

      // Utiliser le store pour mettre à jour la prise en charge
      await updatePriseEnCharge(id, formDataForSubmit);

      toast({
        title: "Succès",
        description: "La prise en charge a été mise à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail de la prise en charge après modification réussie
      navigate(`/prises-en-charge/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la prise en charge",
        variant: "destructive",
      });
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

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading || loadingRelations) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations de la prise en charge...
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
          onClick={() => navigate("/prises-en-charge")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des prises en charge
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Modifier la prise en charge</h1>

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

        {/* PersonnelId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="personnelId"
            >
              Personnel soignant
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
                {personnel.nom} {personnel.prenom} ({personnel.profession})
              </option>
            ))}
          </select>
          {errors.personnelId && (
            <p className="text-red-500 text-xs italic">{errors.personnelId}</p>
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

        {/* DateFin (Optionnel) */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateFin"
          >
            Date de fin (optionnel)
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
                ? new Date(formData.dateFin).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateFin && (
            <p className="text-red-500 text-xs italic">{errors.dateFin}</p>
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

        {/* Notes */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="notes"
          >
            Notes complémentaires
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

        {/* Boutons d'action */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            onClick={() =>
              id
                ? navigate(`/prises-en-charge/${id}`)
                : navigate("/prises-en-charge")
            }
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

export default EditPriseEnChargePage;
