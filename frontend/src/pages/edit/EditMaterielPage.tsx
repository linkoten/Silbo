import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  materielFormSchema,
  ServiceFormValues,
} from "@/components/userFormSchema";
import { z } from "zod";

// Import des composants UI de ShadcnUI
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Import des stores Zustand et du composant ServiceDialog
import { useDialogStore } from "@/stores/dialog-store";
import { useMaterielStore } from "@/stores/materiel-store";
import { useServiceStore } from "@/stores/service-store";
import ServiceDialog from "@/components/dialogs/ServiceDialog";

// Types pour le formulaire
type MaterielFormData = z.infer<typeof materielFormSchema>;

const EditMaterielPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<MaterielFormData>({
    nom: "",
    description: null,
    quantite: 1,
    type: null,
    marque: null,
    modele: null,
    numeroSerie: null,
    dateAchat: null,
    dateMaintenance: null,
    statut: "En Service",
    serviceId: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Utilisation des stores Zustand
  const { setShowServiceDialog } = useDialogStore();
  const {
    materielSelectionne,
    isLoading,
    error,
    fetchMaterielDetails,
    updateMateriel,
  } = useMaterielStore();
  const { services, fetchServices } = useServiceStore();

  // Charger les détails du matériel et la liste des services au chargement de la page
  useEffect(() => {
    if (id) {
      fetchMaterielDetails(id);
    }
    fetchServices();
  }, [id, fetchMaterielDetails, fetchServices]);

  // Mettre à jour le formulaire lorsque les détails du matériel sont chargés
  useEffect(() => {
    if (materielSelectionne) {
      setFormData({
        nom: materielSelectionne.nom,
        description: materielSelectionne.description || null,
        quantite: materielSelectionne.quantite || 1,
        type: materielSelectionne.type || null,
        marque: materielSelectionne.marque || null,
        modele: materielSelectionne.modele || null,
        numeroSerie: materielSelectionne.numeroSerie || null,
        dateAchat: materielSelectionne.dateAchat
          ? new Date(materielSelectionne.dateAchat)
          : null,
        dateMaintenance: materielSelectionne.dateMaintenance
          ? new Date(materielSelectionne.dateMaintenance)
          : null,
        statut: materielSelectionne.statut || "En Service",
        serviceId: materielSelectionne.serviceId || null,
      });
    }
  }, [materielSelectionne]);

  // Callback pour ajouter un nouveau service à la liste
  const handleServiceCreated = (newService: ServiceFormValues) => {
    // Rafraîchir les services après création
    fetchServices();

    // Mettre à jour le formulaire avec le nouveau service
    setFormData((prevData) => ({
      ...prevData,
      serviceId: newService.id as string,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;

    if (name === "quantite") {
      // Pour le champ quantité, convertir la valeur en nombre
      setFormData({
        ...formData,
        [name]: parseInt(value) || 1,
      });
    } else if (type === "date") {
      // Pour les champs de date
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
      materielFormSchema.parse(formData);
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
      // Préparer les données à envoyer
      const dataToSend = {
        ...formData,
        // On n'a pas besoin de convertir les dates en chaînes ISO
        // car le backend attend des objets Date, pas des strings
      };

      // Utilisation du store Zustand pour mettre à jour le matériel
      await updateMateriel(id, dataToSend);

      toast({
        title: "Succès",
        description: "Le matériel a été mis à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail du matériel
      navigate(`/materiels/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le matériel",
        variant: "destructive",
      });
    }
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du matériel...
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
          onClick={() => navigate("/materiels")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des matériels
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Modifier les informations du matériel
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
            Nom du matériel
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

        {/* Type */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.type ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="type"
            type="text"
            name="type"
            value={formData.type || ""}
            onChange={handleChange}
          />
          {errors.type && (
            <p className="text-red-500 text-xs italic">{errors.type}</p>
          )}
        </div>

        {/* Marque */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="marque"
          >
            Marque
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.marque ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="marque"
            type="text"
            name="marque"
            value={formData.marque || ""}
            onChange={handleChange}
          />
          {errors.marque && (
            <p className="text-red-500 text-xs italic">{errors.marque}</p>
          )}
        </div>

        {/* Modele */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="modele"
          >
            Modèle
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.modele ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="modele"
            type="text"
            name="modele"
            value={formData.modele || ""}
            onChange={handleChange}
          />
          {errors.modele && (
            <p className="text-red-500 text-xs italic">{errors.modele}</p>
          )}
        </div>

        {/* NumeroSerie */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numeroSerie"
          >
            Numéro de série
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.numeroSerie ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="numeroSerie"
            type="text"
            name="numeroSerie"
            value={formData.numeroSerie || ""}
            onChange={handleChange}
          />
          {errors.numeroSerie && (
            <p className="text-red-500 text-xs italic">{errors.numeroSerie}</p>
          )}
        </div>

        {/* Quantite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quantite"
          >
            Quantité
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.quantite ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="quantite"
            type="number"
            name="quantite"
            min="1"
            value={formData.quantite}
            onChange={handleChange}
            required
          />
          {errors.quantite && (
            <p className="text-red-500 text-xs italic">{errors.quantite}</p>
          )}
        </div>

        {/* DateAchat */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateAchat"
          >
            Date d'achat
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateAchat ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateAchat"
            type="date"
            name="dateAchat"
            value={
              formData.dateAchat
                ? new Date(formData.dateAchat).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateAchat && (
            <p className="text-red-500 text-xs italic">{errors.dateAchat}</p>
          )}
        </div>

        {/* DateMaintenance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateMaintenance"
          >
            Date de maintenance
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateMaintenance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateMaintenance"
            type="date"
            name="dateMaintenance"
            value={
              formData.dateMaintenance
                ? new Date(formData.dateMaintenance).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
          />
          {errors.dateMaintenance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateMaintenance}
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
          {errors.serviceId && (
            <p className="text-red-500 text-xs italic">{errors.serviceId}</p>
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
            value={formData.statut || "En Service"}
            onChange={handleChange}
          >
            <option value="En Service">En Service</option>
            <option value="Hors Service">Hors Service</option>
            <option value="En Maintenance">En Maintenance</option>
            <option value="En Réparation">En Réparation</option>
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
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Mettre à jour"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() =>
              id ? navigate(`/materiels/${id}`) : navigate("/materiels")
            }
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Utilisation du composant Dialog pour créer un service */}
      <ServiceDialog onServiceCreated={handleServiceCreated} />
    </div>
  );
};

export default EditMaterielPage;
