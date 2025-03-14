import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  litFormSchema,
  PatientFormValues,
  ServiceFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de ShadcnUI
import { Button } from "@/components/ui/button";

// Import du store Zustand et des composants Dialog
import { useDialogStore } from "@/stores/dialog-store";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import PatientDialog from "@/components/dialogs/PatientDialog";

// Utilisation du type fourni par Zod pour le formulaire
type LitFormData = z.infer<typeof litFormSchema>;

const CreateLitPage: React.FC = () => {
  const [formData, setFormData] = useState<LitFormData>({
    numeroLit: "",
    type: null,
    statut: "Disponible",
    serviceId: "",
    chambre: null,
    etage: null,
    patientId: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // État pour les listes de services et patients
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false);

  // Accès au store dialog avec actions pour ouvrir les dialogs
  const { setShowServiceDialog, setShowPatientDialog } = useDialogStore();

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

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/lits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  // Callbacks pour les créations de service et patient
  const handleServiceCreated = (newService: ServiceFormValues): void => {
    setServices((prevServices) => [...prevServices, newService]);
    setFormData((prevData) => ({
      ...prevData,
      serviceId: newService.id as string,
    }));
  };

  const handlePatientCreated = (newPatient: PatientFormValues): void => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
    setFormData((prevData) => ({
      ...prevData,
      patientId: newPatient.id as string,
    }));
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
                  value={formData.type ?? ""}
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
                  value={formData.statut ?? ""}
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
                  value={formData.chambre ?? ""}
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
                  value={formData.etage ?? ""}
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
                    onClick={() => setShowServiceDialog(true)}
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
                    onClick={() => setShowPatientDialog(true)}
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
                  value={formData.patientId ?? ""}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/lits")}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enregistrement..." : "Créer le lit"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Intégration des composants Dialog avec callbacks */}
      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <PatientDialog onPatientCreated={handlePatientCreated} />
    </div>
  );
};

export default CreateLitPage;
