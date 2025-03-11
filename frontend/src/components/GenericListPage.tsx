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

  if (loading) return <div>Chargement des {pluralName}...</div>;
  if (error) return <div>Erreur: {error}</div>;

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

      {items.length === 0 ? (
        <p>{emptyMessage || `Aucun ${entityName} trouvé.`}</p>
      ) : (
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                {columns.map((column) => (
                  <th key={column.key} className="py-3 px-6 text-left">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(item.id)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${item.id}-${column.key}`}
                      className="py-3 px-6 text-left"
                    >
                      {column.render
                        ? column.render(item)
                        : item[column.key] !== undefined
                        ? String(item[column.key])
                        : ""}
                    </td>
                  ))}
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
