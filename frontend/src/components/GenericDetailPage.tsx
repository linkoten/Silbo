import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Type pour les propriétés de champ à afficher
interface DetailField {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface GenericDetailPageProps {
  entityName: string; // Nom de l'entité au singulier (ex: "patient")
  pluralName: string; // Nom de l'entité au pluriel pour l'URL (ex: "patients")
  apiEndpoint: string; // Point de terminaison API (ex: "/patients")
  fields: DetailField[];
  title?: (item: any) => string; // Fonction pour générer le titre de la page
}

const GenericDetailPage: React.FC<GenericDetailPageProps> = ({
  entityName,
  pluralName,
  apiEndpoint,
  fields,
  title,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000${apiEndpoint}/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`${entityName} non trouvé`);
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, apiEndpoint, entityName]);

  const handleDelete = async () => {
    if (
      !window.confirm(`Êtes-vous sûr de vouloir supprimer ce ${entityName} ?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000${apiEndpoint}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.status}`);
      }

      navigate(`/${pluralName}`);
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!item) return <div>Élément non trouvé</div>;

  const pageTitle = title ? title(item) : `Détails du ${entityName}`;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <div className="space-x-2">
          <Link
            to={`/${pluralName}/edit/${id}`}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="border-b py-3">
              <dt className="text-gray-600 font-medium mb-1">{field.label}</dt>
              <dd className="text-gray-900">
                {field.render
                  ? field.render(item[field.key], item)
                  : item[field.key] !== undefined
                  ? String(item[field.key])
                  : "-"}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8">
          <Link
            to={`/${pluralName}`}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GenericDetailPage;
