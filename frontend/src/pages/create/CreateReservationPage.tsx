import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  reservationLitFormSchema,
  PatientFormValues,
  LitFormValues,
  EtablissementFormValues,
} from "../../components/userFormSchema";
import { z } from "zod";

// Import des composants UI de base
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import du store Zustand et des composants Dialog
import { useDialogStore } from "@/stores/dialog-store";
import { useReservationLitStore } from "@/stores/reservation-lit-store";
import PatientDialog from "@/components/dialogs/PatientDialog";
import LitDialog from "@/components/dialogs/LitDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Types pour le formulaire
type ReservationLitFormData = z.infer<typeof reservationLitFormSchema>;

const CreateReservationLitPage: React.FC = () => {
  const [formData, setFormData] = useState<ReservationLitFormData>({
    patientId: null,
    litId: null,
    dateArrivee: new Date(),
    dateDepart: new Date(new Date().setDate(new Date().getDate() + 1)), // Par défaut : jour suivant
    etablissementDestinationId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [lits, setLits] = useState<LitFormValues[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<any[]>([]);

  // Accès aux stores
  const { setShowPatientDialog, setShowLitDialog, setShowEtablissementDialog } =
    useDialogStore();
  const { createReservationLit, isLoading } = useReservationLitStore();

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
        toast({
          title: "Erreur",
          description: "Impossible de charger les patients",
          variant: "destructive",
        });
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les lits",
          variant: "destructive",
        });
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements",
          variant: "destructive",
        });
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      }
    };

    fetchPatients();
    fetchLits();
    fetchEtablissements();
    fetchServices();
  }, [toast]);

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

    setSubmitError(null);

    try {
      // Utiliser le store pour créer la réservation
      await createReservationLit({
        ...formData,
        dateArrivee: formData.dateArrivee.toISOString(),
        dateDepart: formData.dateDepart.toISOString(),
      });

      toast({
        title: "Succès",
        description: "La réservation a été créée avec succès",
        variant: "success",
      });

      // Redirection vers la liste des réservations après création réussie
      navigate("/reservationsLit");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la réservation",
        variant: "destructive",
      });
    }
  };

  // Callbacks pour les créations d'entités
  const handlePatientCreated = (newPatient: PatientFormValues) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    setFormData((prevData) => ({
      ...prevData,
      patientId: newPatient.id as string,
    }));
  };

  const handleLitCreated = (newLit: LitFormValues) => {
    setLits((prevLits) => [...prevLits, newLit]);
    setFormData((prevData) => ({ ...prevData, litId: newLit.id as string }));
  };

  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ) => {
    setEtablissements((prevEtablissements) => [
      ...prevEtablissements,
      newEtablissement,
    ]);
    setFormData((prevData) => ({
      ...prevData,
      etablissementDestinationId: newEtablissement.id as string,
    }));
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
            value={formData.patientId ?? ""}
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
              onClick={() => setShowLitDialog(true)}
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
            value={formData.litId ?? ""}
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
              onClick={() => setShowEtablissementDialog(true)}
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
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() => navigate("/reservationsLit")}
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Intégration des composants Dialog avec callbacks */}
      <PatientDialog onPatientCreated={handlePatientCreated} />
      <LitDialog onLitCreated={handleLitCreated} services={services} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </div>
  );
};

export default CreateReservationLitPage;
