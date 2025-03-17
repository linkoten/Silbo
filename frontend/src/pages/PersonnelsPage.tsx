import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatUtils";
import { usePersonnelStore } from "@/stores/personnel-store";
import { Personnel } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";

const PersonnelsPage: React.FC = () => {
  // Utiliser le store personnel
  const { personnels, isLoading, error, fetchPersonnels, deletePersonnel } =
    usePersonnelStore();
  const { toast } = useToast();

  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPersonnels, setFilteredPersonnels] = useState<Personnel[]>([]);

  // Charger les personnels au montage du composant
  useEffect(() => {
    fetchPersonnels();
  }, [fetchPersonnels]);

  // Mettre à jour les personnels filtrés lorsque la recherche ou les données changent
  useEffect(() => {
    if (!personnels) return;

    if (searchTerm === "") {
      setFilteredPersonnels(personnels);
    } else {
      const filtered = personnels.filter((personnel) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          personnel.nom?.toLowerCase().includes(searchLower) ||
          personnel.prenom?.toLowerCase().includes(searchLower) ||
          personnel.profession?.toLowerCase().includes(searchLower) ||
          personnel.email?.toLowerCase().includes(searchLower) ||
          personnel.specialite?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPersonnels(filtered);
    }
  }, [searchTerm, personnels]);

  // Gestion de la suppression
  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnel ?")) {
      try {
        const success = await deletePersonnel(id);
        if (success) {
          toast({
            title: "Succès",
            description: "Le personnel a été supprimé avec succès",
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le personnel",
          variant: "destructive",
        });
      }
    }
  };

  // Fonction de rendu pour les badges de profession
  const renderProfessionBadge = (profession: string | null) => {
    const prof = profession || "Non spécifiée";
    let badge = "bg-gray-100 text-gray-800";

    if (prof === "Médecin") badge = "bg-blue-100 text-blue-800";
    if (prof === "Infirmier" || prof === "Infirmière")
      badge = "bg-green-100 text-green-800";
    if (prof === "Chirurgien") badge = "bg-purple-100 text-purple-800";
    if (prof === "Aide-soignant" || prof === "Aide-soignante")
      badge = "bg-yellow-100 text-yellow-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
        {prof}
      </span>
    );
  };

  // Fonction de rendu pour les badges de statut
  const renderStatusBadge = (statut: string | null) => {
    const status = statut || "Actif";
    let badge = "bg-green-100 text-green-800";

    if (status === "En congé") badge = "bg-yellow-100 text-yellow-800";
    if (status === "Inactif") badge = "bg-red-100 text-red-800";
    if (status === "En formation") badge = "bg-blue-100 text-blue-800";

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge}`}>
        {status}
      </span>
    );
  };

  // Rendu pour l'état de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des personnels...
          </span>
        </div>
      </div>
    );
  }

  // Rendu pour l'état d'erreur
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchPersonnels()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Personnels</h1>
        <Link
          to="/personnels/create"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Ajouter un personnel
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher par nom, profession, spécialité..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPersonnels.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">Aucun personnel disponible</p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Modifiez votre recherche ou " : ""}
            Ajoutez un personnel pour commencer
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prénom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profession
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'embauche
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPersonnels.map((personnel) => (
                <tr key={personnel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {personnel.nom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{personnel.prenom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderProfessionBadge(personnel.profession)}
                    {personnel.specialite && (
                      <div className="text-xs text-gray-500 mt-1">
                        {personnel.specialite}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">
                      {personnel.dateEmbauche
                        ? formatDate(personnel.dateEmbauche.toString())
                        : "Non spécifiée"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {personnel.email && (
                      <div className="mb-1">
                        <a
                          href={`mailto:${personnel.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {personnel.email}
                        </a>
                      </div>
                    )}
                    {personnel.telephone && <div>{personnel.telephone}</div>}
                    {!personnel.email &&
                      !personnel.telephone &&
                      "Non renseigné"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(personnel.statut!)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {personnel.serviceId ? (
                      <Link
                        to={`/services/${personnel.serviceId}`}
                        className="text-blue-600 hover:underline"
                      >
                        Voir service
                      </Link>
                    ) : (
                      <span className="text-gray-400">Non assigné</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/personnels/${personnel.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Détails
                    </Link>
                    <Link
                      to={`/personnels/edit/${personnel.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(personnel.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PersonnelsPage;
