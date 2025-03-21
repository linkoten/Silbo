"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type ColumnConfig<T> = {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
};

export type ActionConfig<T> = {
  label: string;
  to?: string;
  onClick?: (item: T) => void;
  color?: "blue" | "yellow" | "red" | "green" | "indigo" | "gray";
  icon?: ReactNode;
  showCondition?: (item: T) => boolean;
};

export type GenericListPageProps<T> = {
  // Titre et configuration
  title: string;
  createPath: string;
  createButtonLabel: string;

  // Données et état
  data: T[];
  isLoading: boolean;
  error: string | null;

  // Colonnes et actions
  columns: ColumnConfig<T>[];
  actions: ActionConfig<T>[];

  // Fonctions
  fetchData: () => void;
  onRowClick?: (item: T) => void;

  // Recherche
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];

  // Messages
  emptyStateMessage?: string;
  loadingMessage?: string;

  // Identifiant
  idField?: keyof T;
};

export function GenericListPage<T extends { id: string }>({
  title,
  createPath,
  createButtonLabel,
  data,
  isLoading,
  error,
  columns,
  actions,
  fetchData,
  onRowClick,
  searchPlaceholder = "Rechercher...",
  searchKeys,
  emptyStateMessage = "Aucun élément disponible",
  loadingMessage = "Chargement des données...",
  idField = "id" as keyof T,
}: GenericListPageProps<T>) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  // Mettre à jour les données filtrées lorsque la recherche ou les données changent
  useEffect(() => {
    if (!data) return;

    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        if (!searchKeys) {
          // Recherche dans toutes les propriétés string si searchKeys n'est pas fourni
          return Object.keys(item).some((key) => {
            const value = item[key as keyof T];
            return (
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        }

        return searchKeys.some((key) => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, data, searchKeys]);

  const toggleColumnVisibility = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  // Tri des colonnes visibles pour qu'elles apparaissent dans le même ordre que dans la définition originale
  const sortedVisibleColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  // État de chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded"
            onClick={() => fetchData()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link
          to={createPath}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
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
          {createButtonLabel}
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full px-4 py-2 pl-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
          >
            <span>Colonnes</span>
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={showColumnSelector ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>

          {showColumnSelector && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-md shadow-lg z-10 border">
              <div className="p-3">
                <h3 className="font-bold mb-2">Colonnes visibles</h3>
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`col-${column.key}`}
                      checked={visibleColumns.includes(column.key)}
                      onChange={() => toggleColumnVisibility(column.key)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <label
                      htmlFor={`col-${column.key}`}
                      className="ml-2 text-gray-700"
                    >
                      {column.header}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-white shadow-md rounded p-8 text-center">
          <p>
            {searchTerm
              ? `Aucun élément ne correspond à votre recherche.`
              : emptyStateMessage}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                {sortedVisibleColumns.map((column) => (
                  <th key={column.key} className="py-3 px-6 text-left">
                    {column.header}
                  </th>
                ))}
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredData.map((item) => (
                <tr
                  key={String(item[idField])}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {sortedVisibleColumns.map((column) => (
                    <td
                      key={`${String(item[idField])}-${column.key}`}
                      className="py-3 px-6 text-left"
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key as keyof typeof item] !== undefined
                        ? String(item[column.key as keyof typeof item])
                        : ""}
                    </td>
                  ))}
                  <td
                    className="py-3 px-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {actions.map((action, index) => {
                        // Vérifier si l'action doit être affichée
                        if (
                          action.showCondition &&
                          !action.showCondition(item)
                        ) {
                          return null;
                        }

                        // Déterminer la classe de couleur
                        const colorClass =
                          action.color === "yellow"
                            ? "bg-yellow-500 hover:bg-yellow-700"
                            : action.color === "red"
                            ? "bg-red-500 hover:bg-red-700"
                            : action.color === "green"
                            ? "bg-green-500 hover:bg-green-700"
                            : action.color === "indigo"
                            ? "bg-indigo-500 hover:bg-indigo-700"
                            : action.color === "gray"
                            ? "bg-gray-500 hover:bg-gray-700"
                            : "bg-blue-500 hover:bg-blue-700";

                        // Rendu du bouton ou du lien
                        return action.to ? (
                          <Link
                            key={index}
                            to={action.to.replace(":id", String(item[idField]))}
                            className={`${colorClass} text-white py-1 px-2 rounded text-xs flex items-center`}
                          >
                            {action.icon && (
                              <span className="mr-1">{action.icon}</span>
                            )}
                            {action.label}
                          </Link>
                        ) : (
                          <button
                            key={index}
                            onClick={() =>
                              action.onClick && action.onClick(item)
                            }
                            className={`${colorClass} text-white py-1 px-2 rounded text-xs flex items-center`}
                          >
                            {action.icon && (
                              <span className="mr-1">{action.icon}</span>
                            )}
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
