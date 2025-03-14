import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Type générique pour les colonnes du tableau
interface TableColumn {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
}

// Props du composant générique
interface GenericListPageProps {
  entityName: string; // Nom de l'entité au singulier (ex: "patient")
  pluralName: string; // Nom de l'entité au pluriel pour l'affichage et l'URL (ex: "patients")
  apiEndpoint: string; // Point de terminaison API (ex: "/patients")
  columns: TableColumn[];
  addButtonLabel?: string; // Texte du bouton d'ajout (optionnel)
  emptyMessage?: string; // Message quand la liste est vide (optionnel)
}

const GenericListPage: React.FC<GenericListPageProps> = ({
  entityName,
  pluralName,
  apiEndpoint,
  columns,
  addButtonLabel,
  emptyMessage,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    // Par défaut, n'afficher que les 6 premières colonnes si plus de 6
    columns.length > 6
      ? columns.slice(0, 6).map((col) => col.key)
      : columns.map((col) => col.key)
  );
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async (): Promise<void> => {
      try {
        const response = await fetch(`http://localhost:3000${apiEndpoint}`);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchItems();
  }, [apiEndpoint]);

  const handleRowClick = (id: string) => {
    navigate(`/${pluralName}/${id}`);
  };

  const toggleColumnVisibility = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const filteredItems = items.filter((item) => {
    if (searchTerm === "") return true;
    return Object.keys(item).some((key) =>
      String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Tri des colonnes visibles pour qu'elles apparaissent dans le même ordre que dans la définition originale
  const sortedVisibleColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">
            Chargement des {pluralName}...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Erreur!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Liste des {pluralName.charAt(0).toUpperCase() + pluralName.slice(1)}
        </h1>
        <Link
          to={`/${pluralName}/create`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {addButtonLabel || `Ajouter un ${entityName}`}
        </Link>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Rechercher..."
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

      {filteredItems.length === 0 ? (
        <div className="bg-white shadow-md rounded p-8 text-center">
          <p>
            {searchTerm
              ? `Aucun ${entityName} ne correspond à votre recherche.`
              : emptyMessage || `Aucun ${entityName} trouvé.`}
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
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  {sortedVisibleColumns.map((column) => (
                    <td
                      key={`${item.id}-${column.key}`}
                      className="py-3 px-6 text-left"
                      onClick={() => handleRowClick(item.id)}
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key] !== undefined
                        ? String(item[column.key])
                        : ""}
                    </td>
                  ))}
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        to={`/${pluralName}/${item.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Voir
                      </Link>
                      <Link
                        to={`/${pluralName}/edit/${item.id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Modifier
                      </Link>
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
};

export default GenericListPage;
