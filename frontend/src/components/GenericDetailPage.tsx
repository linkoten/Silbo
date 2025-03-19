"use client";

import type React from "react";

import { type ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Types pour les props du composant générique
export type TabConfig = {
  id: string;
  label: string;
  count?: number;
  content: ReactNode;
};

export type ActionButton = {
  label: string;
  to?: string;
  onClick?: () => void;
  icon?: ReactNode;
  color: "blue" | "green" | "red" | "amber" | "purple" | "gray";
};

export type HeaderBadge = {
  label: string;
  color: string;
};

export type GenericDetailPageProps = {
  // Données et état
  id: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  initials?: string;
  badges?: HeaderBadge[];

  // État de chargement et erreurs
  isLoading: boolean;
  error: string | null;

  // Onglets et contenu
  tabs: TabConfig[];
  initialTab?: string;

  // Actions
  editPath?: string;
  deletePath?: string;
  backPath: string;
  backLabel?: string;
  onDelete?: () => Promise<boolean>;
  deleteConfirmMessage?: string;

  // Actions supplémentaires
  headerActions?: ActionButton[];
  footerActions?: ActionButton[];
};

// Composants réutilisables
export const Card: React.FC<{
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

export const Badge: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
  >
    {children}
  </span>
);

// Composant Tab pour les onglets
const Tab: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-medium text-sm transition-all duration-200 
    ${
      active
        ? "border-b-2 border-blue-500 text-blue-600"
        : "text-gray-500 hover:text-blue-500"
    }`}
  >
    {children}
  </button>
);

export const GenericDetailPage: React.FC<GenericDetailPageProps> = ({
  id,
  title,
  subtitle,
  icon,
  initials,
  badges = [],
  isLoading,
  error,
  tabs,
  initialTab,
  editPath,
  deletePath,
  backPath,
  backLabel = "Retour",
  onDelete,
  deleteConfirmMessage = "Êtes-vous sûr de vouloir supprimer cet élément ?",
  headerActions = [],
  footerActions = [],
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(
    initialTab || (tabs.length > 0 ? tabs[0].id : "")
  );

  // Animation effet "pulse" pour simuler un chargement
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async () => {
    if (!onDelete) return;

    if (!window.confirm(deleteConfirmMessage)) {
      return;
    }

    try {
      const success = await onDelete();
      if (success) {
        navigate(backPath);
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  // Rendu de l'état de chargement
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
            Chargement des données...
          </p>
        </div>
      </div>
    );
  }

  // Rendu de l'état d'erreur
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
            to={backPath}
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-700 border-4 border-white shadow-lg mr-6">
                  {icon || (initials ? initials : title.charAt(0))}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  {subtitle && <p className="text-blue-100 mt-1">{subtitle}</p>}
                  {badges.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {badges.map((badge, index) => (
                        <Badge key={index} color={badge.color}>
                          {badge.label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-3">
                {editPath && (
                  <Link
                    to={editPath}
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
                )}
                {onDelete && (
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
                )}
                {headerActions.map((action, index) =>
                  action.to ? (
                    <Link
                      key={index}
                      to={action.to}
                      className={`bg-white hover:bg-gray-100 text-${action.color}-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center`}
                    >
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={`bg-white hover:bg-gray-100 text-${action.color}-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center`}
                    >
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Onglets de navigation */}
          {tabs.length > 0 && (
            <div className="border-b">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    active={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label} {tab.count !== undefined && `(${tab.count})`}
                  </Tab>
                ))}
              </div>
            </div>
          )}

          {/* Contenu des onglets */}
          <div className="p-6">
            {tabs.find((tab) => tab.id === activeTab)?.content}
          </div>
        </div>

        {/* Pied de page avec boutons d'action */}
        <div className="flex justify-between">
          <Link
            to={backPath}
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
            {backLabel}
          </Link>

          {footerActions.length > 0 && (
            <div className="flex space-x-3">
              {footerActions.map((action, index) =>
                action.to ? (
                  <Link
                    key={index}
                    to={action.to}
                    className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white font-medium py-2 px-6 rounded-lg transition-colors`}
                  >
                    {action.label}
                  </Link>
                ) : (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`bg-${action.color}-500 hover:bg-${action.color}-600 text-white font-medium py-2 px-6 rounded-lg transition-colors`}
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
