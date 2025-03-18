import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useLitStore } from "@/stores/lit-store";

interface Service {
  id: string;
  nom: string;
  etablissementId: string;
  etablissement?: {
    nom: string;
  };
}

const EditLitPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { litSelectionne, isLoading, error, fetchLitDetails, updateLit } =
    useLitStore();

  const [formData, setFormData] = useState({
    numeroLit: "",
    chambre: "",
    etage: "",
    type: "",
    statut: "Disponible",
    serviceId: "",
    patientId: "",
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Charger les détails du lit lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchLitDetails(id);
    }
  }, [id, fetchLitDetails]);

  // Mettre à jour le formulaire lorsque les détails du lit sont chargés
  useEffect(() => {
    if (litSelectionne) {
      setFormData({
        numeroLit: litSelectionne.numeroLit || "",
        chambre: litSelectionne.chambre || "",
        etage: litSelectionne.etage || "",
        type: litSelectionne.type || "",
        statut: litSelectionne.statut || "Disponible",
        serviceId: litSelectionne.serviceId || "",
        patientId: litSelectionne.patientId || "",
      });
    }
  }, [litSelectionne]);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

        const servicesData = await response.json();

        // Enrichir les services avec les informations d'établissement
        const servicesEnriched = await Promise.all(
          servicesData.map(async (service: Service) => {
            try {
              const etablissementResponse = await fetch(
                `http://localhost:3000/etablissements/${service.etablissementId}`
              );
              if (etablissementResponse.ok) {
                const etablissement = await etablissementResponse.json();
                return { ...service, etablissement };
              }
              return service;
            } catch (err) {
              console.warn(
                `Erreur lors de la récupération de l'établissement pour le service ${service.id}:`,
                err
              );
              return service;
            }
          })
        );

        setServices(servicesEnriched);
      } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.numeroLit) {
      setFormError("Le numéro de lit est requis");
      return false;
    }

    if (!formData.serviceId) {
      setFormError("Veuillez sélectionner un service");
      return false;
    }

    setFormError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !id) return;

    setSubmitting(true);

    try {
      // Utiliser le store pour mettre à jour le lit
      await updateLit(id, formData);

      toast({
        title: "Succès",
        description: "Le lit a été mis à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail du lit
      navigate(`/lits/${id}`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du lit:", err);
      setFormError(
        err instanceof Error ? err.message : "Une erreur s'est produite"
      );
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le lit",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Afficher un écran de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du lit...
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
        <Link
          to="/lits"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retour à la liste des lits
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Modifier le lit</h1>

      {formError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{formError}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numéro de lit */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">
              Numéro de lit *
            </label>
            <input
              type="text"
              name="numeroLit"
              value={formData.numeroLit}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 101-A"
              required
            />
          </div>

          {/* Chambre */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">
              Chambre
            </label>
            <input
              type="text"
              name="chambre"
              value={formData.chambre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 101"
            />
          </div>

          {/* Étage */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">
              Étage
            </label>
            <input
              type="text"
              name="etage"
              value={formData.etage}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 1er"
            />
          </div>

          {/* Type de lit */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">
              Type de lit
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un type</option>
              <option value="Standard">Standard</option>
              <option value="Médical">Médical</option>
              <option value="Soins intensifs">Soins intensifs</option>
              <option value="Pédiatrique">Pédiatrique</option>
              <option value="Bariatrique">Bariatrique</option>
            </select>
          </div>

          {/* Statut */}
          <div className="col-span-1">
            <label className="block text-gray-700 font-medium mb-2">
              Statut
            </label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Disponible">Disponible</option>
              <option value="Occupé">Occupé</option>
              <option value="En maintenance">En maintenance</option>
              <option value="Réservé">Réservé</option>
            </select>
          </div>

          {/* Service */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Service *
            </label>
            {loadingServices ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-500">
                  Chargement des services...
                </span>
              </div>
            ) : (
              <select
                name="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nom}{" "}
                    {service.etablissement && `(${service.etablissement.nom})`}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Link
            to={id ? `/lits/${id}` : "/lits"}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center disabled:bg-blue-300"
            disabled={submitting || loadingServices}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLitPage;
