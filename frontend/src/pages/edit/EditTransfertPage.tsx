import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  transfertFormSchema,
  PatientFormValues,
  ServiceFormValues,
  EtablissementFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import des stores Zustand
import { useDialogStore } from "@/stores/dialog-store";
import { useTransfertStore } from "@/stores/transfert-store";
import PatientDialog from "@/components/dialogs/PatientDialog";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Types pour le formulaire
type TransfertFormData = z.infer<typeof transfertFormSchema>;

// Extend ServiceFormValues to include etablissement info for display purposes
interface ServiceWithEtablissement extends ServiceFormValues {
  etablissement?: {
    nom: string;
  };
}

const EditTransfertPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<TransfertFormData>({
    patientId: "",
    serviceDepartId: "",
    serviceArriveeId: "",
    date: new Date(),
    motif: null,
    statut: "Planifié",
    autorisePar: null,
    realiseePar: null,
    etablissementDepartId: null,
    etablissementArriveeId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [services, setServices] = useState<ServiceWithEtablissement[]>([]);
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);

  // États pour les filtres conditionnels
  const [servicesDepartFiltered, setServicesDepartFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);
  const [servicesArriveeFiltered, setServicesArriveeFiltered] = useState<
    ServiceWithEtablissement[]
  >([]);

  // Accès aux stores
  const {
    setShowPatientDialog,
    setShowServiceDialog,
    setShowEtablissementDialog,
  } = useDialogStore();
  const {
    transfertSelectionne,
    isLoading,
    error,
    fetchTransfertDetails,
    updateTransfert,
  } = useTransfertStore();

  // Charger les données au chargement de la page
  useEffect(() => {
    if (id) {
      fetchTransfertDetails(id);
    }

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

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();

        // Enhance services with etablissement information
        const servicesWithEtablissement = await Promise.all(
          data.map(async (service: ServiceWithEtablissement) => {
            if (service.etablissementId) {
              try {
                const etablissementResponse = await fetch(
                  `http://localhost:3000/etablissements/${service.etablissementId}`
                );
                if (etablissementResponse.ok) {
                  const etablissement = await etablissementResponse.json();
                  return {
                    ...service,
                    etablissement: { nom: etablissement.nom },
                  };
                }
              } catch (error) {
                console.warn(
                  "Couldn't fetch etablissement for service:",
                  error
                );
              }
            }
            return service;
          })
        );

        setServices(servicesWithEtablissement);
        setServicesDepartFiltered(servicesWithEtablissement);
        setServicesArriveeFiltered(servicesWithEtablissement);
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
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

    fetchPatients();
    fetchServices();
    fetchEtablissements();
  }, [id, fetchTransfertDetails, toast]);

  // Mettre à jour le formulaire lorsque les détails du transfert sont chargés
  useEffect(() => {
    if (transfertSelectionne) {
      setFormData({
        patientId: transfertSelectionne.patientId || "",
        serviceDepartId: transfertSelectionne.serviceDepartId || "",
        serviceArriveeId: transfertSelectionne.serviceArriveeId || "",
        date: transfertSelectionne.date
          ? new Date(transfertSelectionne.date)
          : new Date(),
        motif: transfertSelectionne.motif || "",
        statut: transfertSelectionne.statut || "Planifié",
        autorisePar: transfertSelectionne.autorisePar || "",
        realiseePar: transfertSelectionne.realiseePar || "",
        etablissementDepartId: transfertSelectionne.etablissementDepartId || "",
        etablissementArriveeId:
          transfertSelectionne.etablissementArriveeId || "",
      });
    }
  }, [transfertSelectionne]);

  // Filtrer les services d'arrivée lorsqu'un établissement départ est sélectionné
  useEffect(() => {
    if (formData.etablissementDepartId) {
      const filteredServices = services.filter(
        (service) => service.etablissementId === formData.etablissementDepartId
      );
      setServicesDepartFiltered(filteredServices);
    } else {
      setServicesDepartFiltered(services);
    }
  }, [formData.etablissementDepartId, services]);

  // Filtrer les services d'arrivée lorsqu'un établissement arrivée est sélectionné
  useEffect(() => {
    if (formData.etablissementArriveeId) {
      const filteredServices = services.filter(
        (service) => service.etablissementId === formData.etablissementArriveeId
      );
      setServicesArriveeFiltered(filteredServices);
    } else {
      setServicesArriveeFiltered(services);
    }
  }, [formData.etablissementArriveeId, services]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    if (type === "date") {
      setFormData({
        ...formData,
        [name]: value ? new Date(value) : new Date(),
      });
    } else if (
      name === "etablissementDepartId" &&
      value !== formData.etablissementDepartId
    ) {
      // Si l'établissement de départ change, réinitialiser le service de départ
      setFormData({
        ...formData,
        [name]: value || null,
        serviceDepartId: "", // Réinitialiser le service de départ
      });
    } else if (
      name === "etablissementArriveeId" &&
      value !== formData.etablissementArriveeId
    ) {
      // Si l'établissement d'arrivée change, réinitialiser le service d'arrivée
      setFormData({
        ...formData,
        [name]: value || null,
        serviceArriveeId: "", // Réinitialiser le service d'arrivée
      });
    } else {
      setFormData({
        ...formData,
        [name]: value === "" ? null : value,
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

    if (!validateForm() || !id) {
      return;
    }

    setSubmitError(null);

    try {
      // Préparer les données pour l'API
      const transfertData = {
        patientId: formData.patientId,
        serviceDepartId: formData.serviceDepartId,
        serviceArriveeId: formData.serviceArriveeId,
        date: formData.date.toISOString(),
        motif: formData.motif,
        statut: formData.statut,
        autorisePar: formData.autorisePar,
        realiseePar: formData.realiseePar,
        etablissementDepartId: formData.etablissementDepartId,
        etablissementArriveeId: formData.etablissementArriveeId,
      };

      await updateTransfert(id, transfertData);

      toast({
        title: "Succès",
        description: "Le transfert a été mis à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail après mise à jour réussie
      navigate(`/transferts/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le transfert",
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

  const handleServiceCreated = (newService: ServiceFormValues): void => {
    setServices((prevServices) => [...prevServices, newService]);
  };

  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ): void => {
    setEtablissements((prevEtablissements) => [
      ...prevEtablissements,
      newEtablissement,
    ]);
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du transfert...
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
          onClick={() => navigate("/transferts")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des transferts
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Modifier le transfert</h1>

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

        {/* Groupe Établissement et Service de départ */}
        <div className="bg-gray-50 p-4 mb-6 rounded-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Départ</h3>

          {/* EtablissementDepartId - Dropdown (optionnel) */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="etablissementDepartId"
              >
                Établissement de départ (optionnel)
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
                errors.etablissementDepartId ? "border-red-500" : ""
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="etablissementDepartId"
              name="etablissementDepartId"
              value={formData.etablissementDepartId || ""}
              onChange={handleChange}
            >
              <option value="">Aucun établissement spécifique</option>
              {etablissements.map((etablissement) => (
                <option key={etablissement.id} value={etablissement.id}>
                  {etablissement.nom}
                </option>
              ))}
            </select>
            {errors.etablissementDepartId && (
              <p className="text-red-500 text-xs italic">
                {errors.etablissementDepartId}
              </p>
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
                onClick={() => setShowServiceDialog(true)}
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
              <option value="">Sélectionnez un service</option>
              {servicesDepartFiltered.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}{" "}
                  {service.etablissement && `(${service.etablissement.nom})`}
                </option>
              ))}
            </select>
            {errors.serviceDepartId && (
              <p className="text-red-500 text-xs italic">
                {errors.serviceDepartId}
              </p>
            )}
          </div>
        </div>

        {/* Groupe Établissement et Service d'arrivée */}
        <div className="bg-gray-50 p-4 mb-6 rounded-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Arrivée</h3>

          {/* EtablissementArriveeId - Dropdown (optionnel) */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="etablissementArriveeId"
              >
                Établissement d'arrivée (optionnel)
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
                errors.etablissementArriveeId ? "border-red-500" : ""
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="etablissementArriveeId"
              name="etablissementArriveeId"
              value={formData.etablissementArriveeId || ""}
              onChange={handleChange}
            >
              <option value="">Aucun établissement spécifique</option>
              {etablissements.map((etablissement) => (
                <option key={etablissement.id} value={etablissement.id}>
                  {etablissement.nom}
                </option>
              ))}
            </select>
            {errors.etablissementArriveeId && (
              <p className="text-red-500 text-xs italic">
                {errors.etablissementArriveeId}
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
              <button
                type="button"
                className="text-blue-500 hover:text-blue-700 text-sm"
                onClick={() => setShowServiceDialog(true)}
              >
                + Ajouter un service
              </button>
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
              <option value="">Sélectionnez un service</option>
              {servicesArriveeFiltered.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nom}{" "}
                  {service.etablissement && `(${service.etablissement.nom})`}
                </option>
              ))}
            </select>
            {errors.serviceArriveeId && (
              <p className="text-red-500 text-xs italic">
                {errors.serviceArriveeId}
              </p>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date du transfert
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
            Motif du transfert
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
            <option value="Validé">Validé</option>
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

        {/* RealisePar */}
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
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading
              ? "Modification en cours..."
              : "Mettre à jour le transfert"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() =>
              id ? navigate(`/transferts/${id}`) : navigate("/transferts")
            }
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Intégration des composants Dialog avec callbacks */}
      <PatientDialog onPatientCreated={handlePatientCreated} />
      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </div>
  );
};

export default EditTransfertPage;
