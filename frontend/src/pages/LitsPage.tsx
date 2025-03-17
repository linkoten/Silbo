import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLitStore } from "@/stores/lit-store";
import { useToast } from "@/components/ui/use-toast";
import { Lit } from "@/types/types";

// Service local pour formater l'affichage du statut du lit
const getStatusBadgeClass = (status: string | undefined) => {
  switch (status?.toLowerCase()) {
    case "occupé":
      return "bg-red-100 text-red-800";
    case "disponible":
      return "bg-green-100 text-green-800";
    case "maintenance":
      return "bg-yellow-100 text-yellow-800";
    case "réservé":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const LitsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lits, isLoading, error, fetchLits } = useLitStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "numeroLit",
    "statut",
    "chambre",
    "type",
    "serviceId",
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);

  useEffect(() => {
    fetchLits().catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des lits",
        variant: "destructive",
      });
    });
  }, [fetchLits, toast]);

  const columns = [
    { key: "id", header: "ID" },
    { key: "numeroLit", header: "Numéro de lit" },
    {
      key: "chambre",
      header: "Chambre",
      render: (lit: Lit) => lit.chambre || "Non assignée",
    },
    {
      key: "etage",
      header: "Étage",
      render: (lit: Lit) => lit.etage || "-",
    },
    {
      key: "statut",
      header: "Statut",
      render: (lit: Lit) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
            lit.statut || ""
          )}`}
        >
          {lit.statut || "Inconnu"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (lit: Lit) => lit.type || "Standard",
    },
    {
      key: "serviceId",
      header: "Service",
      render: (lit: Lit) => lit.serviceId || "Non assigné",
    },
  ];

  const handleRowClick = (id: string) => {
    navigate(`/lits/${id}`);
  };

  const toggleColumnVisibility = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((col) => col !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const filteredLits = lits.filter((lit) => {
    if (searchTerm === "") return true;
    return Object.keys(lit).some((key) =>
      String(lit[key as keyof typeof lit])
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  // Tri des colonnes visibles pour qu'elles apparaissent dans le même ordre que dans la définition originale
  const sortedVisibleColumns = columns.filter((col) =>
    visibleColumns.includes(col.key)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Chargement des lits...</p>
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
          <button
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-800 py-1 px-3 rounded"
            onClick={() => fetchLits()}
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
        <h1 className="text-2xl font-bold">Liste des Lits</h1>
        <Link
          to={`/lits/create`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter un lit
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

      {filteredLits.length === 0 ? (
        <div className="bg-white shadow-md rounded p-8 text-center">
          <p>
            {searchTerm
              ? `Aucun lit ne correspond à votre recherche.`
              : `Aucun lit trouvé.`}
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
              {filteredLits.map((lit) => (
                <tr
                  key={lit.id}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(lit.id)}
                >
                  {sortedVisibleColumns.map((column) => (
                    <td
                      key={`${lit.id}-${column.key}`}
                      className="py-3 px-6 text-left"
                    >
                      {column.render
                        ? column.render(lit)
                        : lit[column.key as keyof typeof lit] !== undefined
                        ? String(lit[column.key as keyof typeof lit])
                        : ""}
                    </td>
                  ))}
                  <td
                    className="py-3 px-6 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        to={`/lits/${lit.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
                      >
                        Voir
                      </Link>
                      <Link
                        to={`/lits/edit/${lit.id}`}
                        className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded text-xs"
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

export default LitsPage;
