import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMaterielStore } from "@/stores/materiel-store";

// Composant Card réutilisable
const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
      <h3 className="text-white text-lg font-bold">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Composant Badge
const Badge: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
  >
    {children}
  </span>
);

// Composant d'indicateur de quantité
const QuantityIndicator: React.FC<{ quantity: number }> = ({ quantity }) => {
  let colorClass = "bg-green-500";
  let statusText = "Disponible";

  if (quantity <= 0) {
    colorClass = "bg-red-500";
    statusText = "Rupture de stock";
  } else if (quantity < 5) {
    colorClass = "bg-yellow-500";
    statusText = "Stock faible";
  }

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{statusText}</span>
        <span>
          {quantity} unité{quantity > 1 ? "s" : ""}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${Math.min(100, quantity * 10)}%` }}
        ></div>
      </div>
    </div>
  );
};

const MaterielDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Utiliser le store Zustand au lieu des états locaux et des appels fetch
  const {
    materielSelectionne,
    isLoading,
    error,
    fetchMaterielDetails,
    deleteMateriel,
  } = useMaterielStore();

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = React.useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Charger les détails du matériel via le store
  useEffect(() => {
    if (id) {
      fetchMaterielDetails(id);
    }
  }, [id, fetchMaterielDetails]);

  const handleDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce matériel ?")) {
      return;
    }

    try {
      if (id) {
        const success = await deleteMateriel(id);
        if (success) {
          navigate("/materiels");
        }
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className={`text-center ${
            pulse ? "opacity-70" : "opacity-100"
          } transition-opacity duration-500`}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">
            Chargement des informations du matériel...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600">{error}</p>
          <Link
            to="/materiels"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Retour à la liste des matériels
          </Link>
        </div>
      </div>
    );
  }

  if (!materielSelectionne) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Matériel non trouvé</p>
        </div>
      </div>
    );
  }

  const materiel = materielSelectionne;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {materiel.nom}
                  </h1>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge
                      color={
                        materiel.quantite <= 0
                          ? "bg-red-200 text-red-800"
                          : materiel.quantite < 5
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }
                    >
                      {materiel.quantite} unité
                      {materiel.quantite > 1 ? "s" : ""} en stock
                    </Badge>
                    {materiel.service && (
                      <Badge color="bg-blue-200 text-blue-800">
                        Service: {materiel.service.nom}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/materiels/edit/${id}`}
                  className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-white hover:bg-gray-100 text-red-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Détails du matériel */}
              <Card title="Informations du matériel" className="h-full">
                <dl className="grid grid-cols-1 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nom</dt>
                    <dd className="mt-1 text-lg text-gray-900 font-medium">
                      {materiel.nom}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-gray-900">
                      {materiel.description || (
                        <span className="text-gray-400 italic">
                          Aucune description
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Service attribué
                    </dt>
                    <dd className="mt-1">
                      {materiel.service ? (
                        <Link
                          to={`/services/${materiel.serviceId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {materiel.service.nom}
                        </Link>
                      ) : materiel.serviceId ? (
                        <span className="text-gray-500">
                          ID: {materiel.serviceId}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Non attribué
                        </span>
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Identifiant
                    </dt>
                    <dd className="mt-1 text-gray-400 text-sm font-mono">
                      {materiel.id}
                    </dd>
                  </div>
                </dl>
              </Card>

              {/* État du stock */}
              <Card title="État du stock" className="h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">
                        Quantité disponible
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {materiel.quantite}
                      </span>
                    </div>

                    <QuantityIndicator quantity={materiel.quantite} />

                    <div className="mt-8 flex items-center">
                      {materiel.quantite <= 0 ? (
                        <div className="flex items-center text-red-600">
                          <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-medium">Rupture de stock</span>
                        </div>
                      ) : materiel.quantite < 5 ? (
                        <div className="flex items-center text-yellow-600">
                          <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <span className="font-medium">
                            Stock faible, réapprovisionnement recommandé
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <svg
                            className="w-6 h-6 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="font-medium">Stock disponible</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-200">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          // On pourrait ajouter ici une action pour ajuster le stock via le store
                          // Par exemple: updateStock(materiel.id, newQuantity)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors mr-3"
                      >
                        Ajuster le stock
                      </button>
                      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Historique
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to="/materiels"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à la liste des matériels
          </Link>

          {materiel.serviceId && (
            <Link
              to={`/services/${materiel.serviceId}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Voir le service associé
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterielDetailPage;
