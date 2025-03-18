import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { patientFormSchema } from "@/components/userFormSchema";
import { usePatientStore } from "@/stores/patient-store";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Utilisation du type fourni par Zod pour le formulaire
type PatientFormData = z.infer<typeof patientFormSchema>;

const EditPatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<PatientFormData>({
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
    dateSortie: new Date(),
    statut: "Hospitalisé",
  });

  const {
    patientSelectionne,
    isLoading,
    error,
    fetchPatientDetails,
    updatePatient,
  } = usePatientStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Charger les détails du patient lors du montage du composant
  useEffect(() => {
    if (id) {
      fetchPatientDetails(id);
    }
  }, [id, fetchPatientDetails]);

  // Mettre à jour le formulaire lorsque les détails du patient sont chargés
  useEffect(() => {
    if (patientSelectionne) {
      setFormData({
        nom: patientSelectionne.nom,
        prenom: patientSelectionne.prenom,
        dateNaissance: patientSelectionne.dateSortie
          ? new Date(patientSelectionne.dateSortie)
          : new Date(),
        adresse: patientSelectionne.adresse || null,
        telephone: patientSelectionne.telephone || null,
        email: patientSelectionne.email || null,
        numeroSecu: patientSelectionne.numeroSecu || null,
        groupeSanguin: patientSelectionne.groupeSanguin || null,
        allergie: patientSelectionne.allergie || null,
        antecedents: patientSelectionne.antecedents || null,
        dateAdmission: patientSelectionne.dateAdmission
          ? new Date(patientSelectionne.dateAdmission)
          : new Date(),
        dateSortie: patientSelectionne.dateSortie
          ? new Date(patientSelectionne.dateSortie)
          : null,
        statut: patientSelectionne.statut || "Hospitalisé",
      });
    }
  }, [patientSelectionne]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value, type } = e.target as HTMLInputElement;

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
      patientFormSchema.parse(formData);
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

    // Créer une copie des données pour l'envoi
    const dataToSend = {
      ...formData,
      // S'assurer que la date est au format ISO 8601 (YYYY-MM-DD)
      dateNaissance: formData.dateNaissance.toISOString(),
      dateAdmission: formData.dateAdmission
        ? formData.dateAdmission.toISOString()
        : null,
      dateSortie: formData.dateSortie
        ? formData.dateSortie.toISOString()
        : null,
    };

    setSubmitError(null);

    try {
      // Utiliser le store pour mettre à jour le patient
      await updatePatient(id, dataToSend);

      toast({
        title: "Succès",
        description:
          "Les informations du patient ont été mises à jour avec succès",
        variant: "success",
      });

      // Redirection vers la page de détail du patient après modification réussie
      navigate(`/patients/${id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erreur inconnue");
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations du patient",
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
            Chargement des informations du patient...
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
          onClick={() => navigate("/patients")}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Retour à la liste des patients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        Modifier les informations du patient
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
            Nom*
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

        {/* Prénom */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prenom"
          >
            Prénom*
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

        {/* Date de naissance */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateNaissance"
          >
            Date de naissance*
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.dateNaissance ? "border-red-500" : ""
            } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="dateNaissance"
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance.toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
          {errors.dateNaissance && (
            <p className="text-red-500 text-xs italic">
              {errors.dateNaissance}
            </p>
          )}
        </div>

        {/* Adresse */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="adresse"
          >
            Adresse
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="adresse"
            type="text"
            name="adresse"
            value={formData.adresse || ""}
            onChange={handleChange}
          />
        </div>

        {/* Téléphone */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="telephone"
          >
            Téléphone
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="telephone"
            type="text"
            name="telephone"
            value={formData.telephone || ""}
            onChange={handleChange}
          />
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

        {/* Numéro de sécurité sociale */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="numeroSecu"
          >
            Numéro de sécurité sociale
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="numeroSecu"
            type="text"
            name="numeroSecu"
            value={formData.numeroSecu || ""}
            onChange={handleChange}
          />
        </div>

        {/* Groupe sanguin */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="groupeSanguin"
          >
            Groupe sanguin
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="groupeSanguin"
            name="groupeSanguin"
            value={formData.groupeSanguin || ""}
            onChange={handleChange}
          >
            <option value="">Non spécifié</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Allergies */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="allergie"
          >
            Allergies
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="allergie"
            name="allergie"
            value={formData.allergie || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Antécédents */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="antecedents"
          >
            Antécédents médicaux
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="antecedents"
            name="antecedents"
            value={formData.antecedents || ""}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Date d'admission */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateAdmission"
          >
            Date d'admission
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dateAdmission"
            type="date"
            name="dateAdmission"
            value={formData.dateAdmission?.toISOString().split("T")[0] || ""}
            onChange={handleChange}
          />
        </div>

        {/* Date de sortie */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="dateSortie"
          >
            Date de sortie
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="dateSortie"
            type="date"
            name="dateSortie"
            value={formData.dateSortie?.toISOString().split("T")[0] || ""}
            onChange={handleChange}
          />
        </div>

        {/* Statut */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="statut"
          >
            Statut
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="statut"
            name="statut"
            value={formData.statut || "Hospitalisé"}
            onChange={handleChange}
          >
            <option value="Hospitalisé">Hospitalisé</option>
            <option value="Sorti">Sorti</option>
            <option value="En attente">En attente</option>
            <option value="Transféré">Transféré</option>
          </select>
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
              id ? navigate(`/patients/${id}`) : navigate("/patients")
            }
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientPage;
