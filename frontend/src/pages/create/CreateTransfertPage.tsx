import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  transfertFormSchema,
  patientFormSchema,
  serviceFormSchema,
  PatientFormValues,
  ServiceFormValues,
} from "../../components/userFormSchema";
import { z } from "zod";

// Import des composants Dialog de ShadcnUI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types pour le formulaire
type TransfertFormData = z.infer<typeof transfertFormSchema>;
type PatientFormData = z.infer<typeof patientFormSchema>;
type ServiceFormData = z.infer<typeof serviceFormSchema>;

const CreateTransfertPage: React.FC = () => {
  const [formData, setFormData] = useState<TransfertFormData>({
    serviceDepartId: "",
    serviceArriveeId: "",
    patientId: "",
    motif: null,
    date: new Date(),
    statut: "Planifié",
    autorisePar: null,
    realiseePar: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  // États pour les listes de données
  const [patients, setPatients] = useState<PatientFormValues[]>([]);
  const [services, setServices] = useState<ServiceFormValues[]>([]);

  // États pour les dialogs
  const [showPatientDialog, setShowPatientDialog] = useState<boolean>(false);
  const [showServiceDialog, setShowServiceDialog] = useState<boolean>(false);

  // Ref pour maintenir le focus
  const activeFieldRef = React.useRef<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  >(null);

  // États pour les formulaires de dialogs
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

  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    nom: "",
    description: null,
    etablissementId: "",
    etage: null,
    aile: null,
    capacite: 0,
    statut: "Actif",
    specialite: null,
    responsableId: null,
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

    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/services");
        if (!response.ok)
          throw new Error("Erreur lors du chargement des services");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchPatients();
    fetchServices();
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://localhost:3000/transferts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de la création du transfert"
        );
      }

      // Redirection vers la liste des transferts après création réussie
      navigate("/transferts");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaires pour les formulaires de dialogs
  const handlePatientChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Sauvegarder la référence au champ actif
    activeFieldRef.current = e.target;

    if (type === "date") {
      setPatientForm((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : null,
      }));
    } else {
      setPatientForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (activeFieldRef.current) {
        activeFieldRef.current.focus();
      }
    }, 0);
  };

  const handleServiceChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Sauvegarder la référence au champ actif
    activeFieldRef.current = e.target;

    // Convertir les valeurs numériques (capacité) en nombre
    if (name === "capacite") {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setServiceForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setServiceForm((prev) => ({ ...prev, [name]: value }));
    }

    // Remettre le focus après le rendu
    setTimeout(() => {
      if (activeFieldRef.current) {
        activeFieldRef.current.focus();
      }
    }, 0);
  };

  // Gestionnaires pour les select de ShadcnUI
  const handleSelectChange = (
    value: string,
    field: string,
    formType: "patient" | "service"
  ) => {
    if (formType === "patient") {
      setPatientForm((prev) => ({ ...prev, [field]: value }));
    } else if (formType === "service") {
      setServiceForm((prev) => ({ ...prev, [field]: value }));
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
      setShowPatientDialog(false);

      // Sélectionner automatiquement le nouveau patient
      setFormData({ ...formData, patientId: newPatient.id });
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleServiceSubmit = async () => {
    try {
      // Assurons-nous que capacite est bien un nombre avant l'envoi
      const formDataToSend = {
        ...serviceForm,
        capacite:
          typeof serviceForm.capacite === "string"
            ? parseInt(serviceForm.capacite, 10)
            : serviceForm.capacite,
      };

      const response = await fetch("http://localhost:3000/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok)
        throw new Error("Erreur lors de la création du service");

      const newService = await response.json();
      setServices([...services, newService]);
      setShowServiceDialog(false);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Créer un nouveau transfert</h1>

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
            <option value="">Sélectionnez un service de départ</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
          {errors.serviceDepartId && (
            <p className="text-red-500 text-xs italic">
              {errors.serviceDepartId}
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
            <option value="">Sélectionnez un service d'arrivée</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.nom}
              </option>
            ))}
          </select>
          {errors.serviceArriveeId && (
            <p className="text-red-500 text-xs italic">
              {errors.serviceArriveeId}
            </p>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date de transfert
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
            Motif
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
            <option value="Terminé">Terminé</option>
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

        {/* RealiseePar */}
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
            className="bg-blue-500 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={() => navigate("/transferts")}
          >
            Annuler
          </Button>
        </div>
      </form>

      {/* Dialog pour créer un patient */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter un patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-nom" className="text-right">
                Nom
              </Label>
              <Input
                id="patient-nom"
                name="nom"
                value={patientForm.nom}
                onChange={handlePatientChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-prenom" className="text-right">
                Prénom
              </Label>
              <Input
                id="patient-prenom"
                name="prenom"
                value={patientForm.prenom}
                onChange={handlePatientChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-dateNaissance" className="text-right">
                Date de naissance
              </Label>
              <Input
                id="patient-dateNaissance"
                type="date"
                name="dateNaissance"
                value={patientForm.dateNaissance.toISOString().split("T")[0]}
                onChange={handlePatientChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-adresse" className="text-right">
                Adresse
              </Label>
              <Input
                id="patient-adresse"
                name="adresse"
                value={patientForm.adresse ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patient-telephone" className="text-right">
                Téléphone
              </Label>
              <Input
                id="patient-telephone"
                name="telephone"
                value={patientForm.telephone ?? ""}
                onChange={handlePatientChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPatientDialog(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handlePatientSubmit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour créer un service */}
      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter un service</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-nom" className="text-right">
                Nom du service
              </Label>
              <Input
                id="service-nom"
                name="nom"
                value={serviceForm.nom}
                onChange={handleServiceChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="service-description"
                name="description"
                value={serviceForm.description ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-etablissementId" className="text-right">
                ID de l'établissement
              </Label>
              <Input
                id="service-etablissementId"
                name="etablissementId"
                value={serviceForm.etablissementId}
                onChange={handleServiceChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-capacite" className="text-right">
                Capacité
              </Label>
              <Input
                id="service-capacite"
                type="number"
                name="capacite"
                value={serviceForm.capacite}
                onChange={handleServiceChange}
                className="col-span-3"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-etage" className="text-right">
                Étage
              </Label>
              <Input
                id="service-etage"
                name="etage"
                value={serviceForm.etage ?? ""}
                onChange={handleServiceChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service-statut" className="text-right">
                Statut
              </Label>
              <Select
                value={serviceForm.statut ?? "Actif"}
                onValueChange={(value) =>
                  handleSelectChange(value, "statut", "service")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En maintenance">En maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowServiceDialog(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleServiceSubmit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTransfertPage;
