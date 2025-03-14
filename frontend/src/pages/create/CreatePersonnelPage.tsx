import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  personnelFormSchema,
  EtablissementFormValues,
  ServiceFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de ShadcnUI
import { Button } from "@/components/ui/button";

// Import du store Zustand et des composants Dialog
import { useDialogStore } from "@/stores/dialog-store";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Utilisation du type fourni par Zod pour le formulaire
type PersonnelFormData = z.infer<typeof personnelFormSchema>;

const CreatePersonnelPage: React.FC = () => {
  const [formData, setFormData] = useState<PersonnelFormData>({
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

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes d'établissements et de services
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [loadingEtablissements, setLoadingEtablissements] =
    useState<boolean>(false);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);

  // Accès au store dialog avec actions pour ouvrir les dialogs
  const { setShowServiceDialog, setShowEtablissementDialog } = useDialogStore();

  // Charger les établissements et services au chargement de la page
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        setLoadingEtablissements(true);
        const response = await fetch("http://localhost:3000/etablissements");
        if (response.ok) {
          const data = await response.json();
          setEtablissements(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des établissements:", error);
      } finally {
        setLoadingEtablissements(false);
      }
    };

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

    fetchEtablissements();
    fetchServices();
  }, []);

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
      personnelFormSchema.parse(formData);
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

    console.log(formData);

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/personnels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du personnel"
        );
      }

      // Redirection vers la liste des personnels après création réussie
      navigate("/personnels");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Callbacks pour les créations d'entités
  const handleServiceCreated = (newService: ServiceFormValues): void => {
    setServices((prevServices) => [...prevServices, newService]);
    setFormData((prevData) => ({
      ...prevData,
      serviceId: newService.id as string,
    }));
  };

  const handleEtablissementCreated = (
    newEtablissement: EtablissementFormValues
  ): void => {
    setEtablissements((prevEtablissements) => [
      ...prevEtablissements,
      newEtablissement,
    ]);
    setFormData((prevData) => ({
      ...prevData,
      etablissementId: newEtablissement.id as string,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Ajouter un nouveau personnel</h1>

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
            Nom
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

        {/* Prenom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prenom"
          >
            Prenom
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.prenom ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="prenom"
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
          {errors.prenom && (
            <p className="text-red-500 text-xs italic">{errors.prenom}</p>
          )}
        </div>

        {/* DateNaissance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateNaissance"
          >
            Date de naissance
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateNaissance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={
              formData.dateNaissance
                ? new Date(formData.dateNaissance).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateNaissance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateNaissance}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.email ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>

        {/* Telephone */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="telephone"
          >
            Téléphone
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.telephone ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="telephone"
            type="tel"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
          />
          {errors.telephone && (
            <p className="text-red-500 text-xs italic">{errors.telephone}</p>
          )}
        </div>

        {/* Profession */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="profession"
          >
            Profession
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.profession ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="profession"
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            required
          />
          {errors.profession && (
            <p className="text-red-500 text-xs italic">{errors.profession}</p>
          )}
        </div>

        {/* Specialite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="specialite"
          >
            Spécialité
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.specialite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="specialite"
            type="text"
            name="specialite"
            value={formData.specialite || ""}
            onChange={handleChange}
          />
          {errors.specialite && (
            <p className="text-red-500 text-xs italic">{errors.specialite}</p>
          )}
        </div>

        {/* Matricule */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="matricule"
          >
            Matricule
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.matricule ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="matricule"
            type="text"
            name="matricule"
            value={formData.matricule || ""}
            onChange={handleChange}
          />
          {errors.matricule && (
            <p className="text-red-500 text-xs italic">{errors.matricule}</p>
          )}
        </div>

        {/* EtablissementId - Dropdown */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label
              className="block text-gray-700 text-sm font-bold"
              htmlFor="etablissementId"
            >
              Établissement
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
              errors.etablissementId ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="etablissementId"
            name="etablissementId"
            value={formData.etablissementId || ""}
            onChange={handleChange}
          >
            <option value="">Sélectionnez un établissement</option>
            {etablissements.map((etablissement) => (
              <option key={etablissement.id} value={etablissement.id}>
                {etablissement.nom}
              </option>
            ))}
          </select>
          {loadingEtablissements && (
            <p className="text-sm text-gray-500 mt-1">
              Chargement des établissements...
            </p>
          )}
          {errors.etablissementId && (
            <p className="text-red-500 text-xs italic">
              {errors.etablissementId}
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
              onClick={() => setShowServiceDialog(true)}
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
          {loadingServices && (
            <p className="text-sm text-gray-500 mt-1">
              Chargement des services...
            </p>
          )}
          {errors.serviceId && (
            <p className="text-red-500 text-xs italic">{errors.serviceId}</p>
          )}
        </div>

        {/* DateEmbauche */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateEmbauche"
          >
            Date d'embauche
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateEmbauche ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateEmbauche"
            type="date"
            name="dateEmbauche"
            value={
              formData.dateEmbauche
                ? new Date(formData.dateEmbauche).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateEmbauche && (
            <p className="text-red-500 text-xs italic">{errors.dateEmbauche}</p>
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
            value={formData.statut || "Actif"}
            onChange={handleChange}
          >
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="En congé">En congé</option>
            <option value="En formation">En formation</option>
          </select>
          {errors.statut && (
            <p className="text-red-500 text-xs italic">{errors.statut}</p>
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
            onClick={() => navigate("/personnels")}
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Intégration des composants Dialog avec callbacks */}
      <ServiceDialog onServiceCreated={handleServiceCreated} />
      <EtablissementDialog
        onEtablissementCreated={handleEtablissementCreated}
      />
    </div>
  );
};

export default CreatePersonnelPage;
