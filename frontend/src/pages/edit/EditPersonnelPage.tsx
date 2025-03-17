import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  personnelFormSchema,
  EtablissementFormValues,
  ServiceFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDialogStore } from "@/stores/dialog-store";
import { usePersonnelStore } from "@/stores/personnel-store";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import EtablissementDialog from "@/components/dialogs/EtablissementDialog";

// Utilisation du type fourni par Zod pour le formulaire
type PersonnelFormData = z.infer<typeof personnelFormSchema>;

const EditPersonnelPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // État initial du formulaire
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // États pour les listes d'établissements et de services
  const [etablissements, setEtablissements] = useState<
    EtablissementFormValues[]
  >([]);
  const [services, setServices] = useState<ServiceFormValues[]>([]);
  const [loadingEtablissements, setLoadingEtablissements] =
    useState<boolean>(false);
  const [loadingServices, setLoadingServices] = useState<boolean>(false);

  // Utilisation des stores pour la gestion d'état
  const { setShowServiceDialog, setShowEtablissementDialog } = useDialogStore();
  const {
    personnelSelectionne,
    isLoading,
    error,
    fetchPersonnelDetails,
    updatePersonnel,
  } = usePersonnelStore();

  // Charger les détails du personnel lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPersonnelDetails(id);
    }
  }, [id, fetchPersonnelDetails]);

  // Charger les établissements et services
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les établissements",
          variant: "destructive",
        });
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchEtablissements();
    fetchServices();
  }, [toast]);

  // Mettre à jour le formulaire lorsque les détails du personnel sont chargés
  useEffect(() => {
    if (personnelSelectionne) {
      setFormData({
        nom: personnelSelectionne.nom,
        prenom: personnelSelectionne.prenom,
        dateNaissance: personnelSelectionne.dateNaissance || null,
        email: personnelSelectionne.email || null,
        telephone: personnelSelectionne.telephone || null,
        profession: personnelSelectionne.profession,
        specialite: personnelSelectionne.specialite || null,
        matricule: personnelSelectionne.matricule || null,
        serviceId: personnelSelectionne.serviceId || null,
        dateEmbauche: personnelSelectionne.dateEmbauche || null,
        statut: personnelSelectionne.statut || "Actif",
        etablissementId: personnelSelectionne.etablissementId || null,
      });
    }
  }, [personnelSelectionne]);

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
        [name]: value === "" ? null : value,
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
    if (!validateForm() || !id) {
      return;
    }

    setSubmitError(null);

    try {
      // Utiliser le store pour mettre à jour le personnel
      await updatePersonnel(id, formData);

      toast({
        title: "Succès",
        description:
          "Les informations du personnel ont été mises à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail du personnel après modification réussie
      navigate(`/personnels/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description:
          "Impossible de mettre à jour les informations du personnel",
        variant: "destructive",
      });
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

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du personnel...
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
          onClick={() => navigate("/personnels")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des personnels
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Modifier les informations du personnel
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
              id ? navigate(`/personnels/${id}`) : navigate("/personnels")
            }
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

export default EditPersonnelPage;
