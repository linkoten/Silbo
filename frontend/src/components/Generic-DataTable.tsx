"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type ColumnConfig<T> = {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
};

export type ActionConfig<T> = {
  label: string;
  onClick: (item: T) => void;
  className?: string;
  showCondition?: (item: T) => boolean;
};

export type GenericDataTableProps<T> = {
  title: string;
  entityName: string;
  entityNamePlural: string;
  createPath: string;
  data: T[];
  isLoading: boolean;
  error: string | null;
  columns: ColumnConfig<T>[];
  actions: ActionConfig<T>[];
  fetchData: () => void;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  emptyStateMessage?: string;
  detailsPath?: (id: string) => string;
  editPath?: (id: string) => string;
  onDelete?: (id: string) => Promise<boolean>;
  customRowClick?: (item: T) => void;
  idField?: keyof T;
};

export function GenericDataTable<T extends { id: string }>({
  title,
  entityName,
  entityNamePlural,
  createPath,
  data,
  isLoading,
  error,
  columns,
  actions,
  fetchData,
  searchPlaceholder = `Rechercher...`,
  searchKeys,
  emptyStateMessage,
  detailsPath,
  editPath,
  onDelete,
  customRowClick,
  idField = "id" as keyof T,
}: GenericDataTableProps<T>) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  // Update filtered data when search term or data changes
  useEffect(() => {
    if (!data) return;

    if (searchTerm === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => {
        if (!searchKeys) {
          // Search all string properties if searchKeys not provided
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

  // Sort visible columns to match original order
  const sortedVisibleColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  const handleDelete = async (id: string) => {
    if (!onDelete) return;

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      try {
        const success = await onDelete(id);
        if (success) {
          toast({
            title: "Succès",
            description: `${entityName} a été supprimé avec succès`,
            variant: "success",
          });
        }
      } catch (err) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer ${entityName.toLowerCase()}`,
          variant: "destructive",
        });
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-lg font-medium text-gray-700">
            Chargement des {entityNamePlural.toLowerCase()}...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => fetchData()}
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
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link
          to={createPath}
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
          Ajouter {entityName.toLowerCase()}
        </Link>
      </div>

      {/* Search and column selector */}
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

      {/* Empty state */}
      {filteredData.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-xl text-gray-600">
            {searchTerm
              ? `Aucun ${entityName.toLowerCase()} ne correspond à votre recherche.`
              : emptyStateMessage ||
                `Aucun ${entityName.toLowerCase()} trouvé.`}
          </p>
          <p className="text-gray-500 mt-2">
            {searchTerm ? "Modifiez votre recherche ou " : ""}
            Ajoutez {entityName.toLowerCase()} pour commencer
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {sortedVisibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <tr
                  key={String(item[idField])}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => customRowClick && customRowClick(item)}
                >
                  {sortedVisibleColumns.map((column) => (
                    <td
                      key={`${String(item[idField])}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {column.render
                        ? column.render(item)
                        : String(
                            (item as any)[column.key] !== undefined
                              ? (item as any)[column.key]
                              : ""
                          )}
                    </td>
                  ))}
                  <td
                    className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {detailsPath && (
                      <Link
                        to={detailsPath(String(item[idField]))}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Détails
                      </Link>
                    )}
                    {editPath && (
                      <Link
                        to={editPath(String(item[idField]))}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Modifier
                      </Link>
                    )}
                    {actions.map((action, index) =>
                      action.showCondition ? (
                        action.showCondition(item) && (
                          <button
                            key={index}
                            onClick={() => action.onClick(item)}
                            className={
                              action.className ||
                              "text-green-600 hover:text-green-900 mr-3"
                            }
                          >
                            {action.label}
                          </button>
                        )
                      ) : (
                        <button
                          key={index}
                          onClick={() => action.onClick(item)}
                          className={
                            action.className ||
                            "text-green-600 hover:text-green-900 mr-3"
                          }
                        >
                          {action.label}
                        </button>
                      )
                    )}
                    {onDelete && (
                      <button
                        onClick={() => handleDelete(String(item[idField]))}
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    )}
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
