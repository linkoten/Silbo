"use client";

import type React from "react";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useMaterielStore } from "@/stores/materiel-store";
import {
  GenericDetailPage,
  Card,
  type TabConfig,
  type ActionButton,
} from "@/components/GenericDetailPage";

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

  // Utiliser le store Zustand
  const {
    materielSelectionne,
    isLoading,
    error,
    fetchMaterielDetails,
    deleteMateriel,
  } = useMaterielStore();

  useEffect(() => {
    if (id) {
      fetchMaterielDetails(id);
    }
  }, [id, fetchMaterielDetails]);

  if (!materielSelectionne && !isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          <p className="text-xl">Matériel non trouvé</p>
        </div>
      </div>
    );
  }

  if (!materielSelectionne) return null;

  // Configuration des onglets
  const tabs: TabConfig[] = [
    {
      id: "info",
      label: "Informations",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card title="Informations du matériel" className="h-full">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="mt-1 text-lg text-gray-900 font-medium">
                  {materielSelectionne.nom}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-gray-900">
                  {materielSelectionne.description || (
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
                  {materielSelectionne.service ? (
                    <Link
                      to={`/services/${materielSelectionne.serviceId}`}
                      className="text-blue-600 hover:underline"
                    >
                      {materielSelectionne.service.nom}
                    </Link>
                  ) : materielSelectionne.serviceId ? (
                    <span className="text-gray-500">
                      ID: {materielSelectionne.serviceId}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">Non attribué</span>
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Identifiant
                </dt>
                <dd className="mt-1 text-gray-400 text-sm font-mono">
                  {materielSelectionne.id}
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="État du stock" className="h-full">
            <div className="flex flex-col h-full">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Quantité disponible</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {materielSelectionne.quantite}
                  </span>
                </div>

                <QuantityIndicator quantity={materielSelectionne.quantite} />

                <div className="mt-8 flex items-center">
                  {materielSelectionne.quantite <= 0 ? (
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
                  ) : materielSelectionne.quantite < 5 ? (
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
      ),
    },
  ];

  // Configuration des actions du pied de page
  const footerActions: ActionButton[] = [];
  if (materielSelectionne.serviceId) {
    footerActions.push({
      label: "Voir le service associé",
      to: `/services/${materielSelectionne.serviceId}`,
      color: "blue",
    });
  }

  // Icône pour l'en-tête
  const headerIcon = (
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
  );

  // Badges pour l'en-tête
  const badges = [
    {
      label: `${materielSelectionne.quantite} unité${
        materielSelectionne.quantite > 1 ? "s" : ""
      } en stock`,
      color:
        materielSelectionne.quantite <= 0
          ? "bg-red-200 text-red-800"
          : materielSelectionne.quantite < 5
          ? "bg-yellow-200 text-yellow-800"
          : "bg-green-200 text-green-800",
    },
  ];

  if (materielSelectionne.service) {
    badges.push({
      label: `Service: ${materielSelectionne.service.nom}`,
      color: "bg-blue-200 text-blue-800",
    });
  }

  return (
    <GenericDetailPage
      id={id || ""}
      title={materielSelectionne.nom}
      icon={headerIcon}
      badges={badges}
      isLoading={isLoading}
      error={error}
      tabs={tabs}
      initialTab="info"
      editPath={`/materiels/edit/${id}`}
      backPath="/materiels"
      backLabel="Retour à la liste des matériels"
      onDelete={id ? () => deleteMateriel(id) : undefined}
      deleteConfirmMessage="Êtes-vous sûr de vouloir supprimer ce matériel ?"
      footerActions={footerActions}
    />
  );
};

export default MaterielDetailPage;
