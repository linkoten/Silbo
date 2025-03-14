import React from "react";
import GenericListPage from "../components/GenericListPage";
import { truncateText } from "../utils/formatUtils";

const ServicesPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="service"
      pluralName="services"
      apiEndpoint="/services"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        {
          key: "capacite",
          header: "Capacité",
          render: (service) => {
            const capacite = service.capacite || 0;
            const occupation = service.occupation || 0;
            const pourcentage =
              capacite > 0 ? Math.round((occupation / capacite) * 100) : 0;

            let colorClass = "text-green-600";
            if (pourcentage >= 90) colorClass = "text-red-600";
            else if (pourcentage >= 75) colorClass = "text-yellow-600";

            return (
              <div>
                <span className="font-medium">{capacite} lits</span>
                {occupation !== undefined && (
                  <span className={`ml-2 text-xs ${colorClass}`}>
                    ({occupation} occupés, {pourcentage}%)
                  </span>
                )}
              </div>
            );
          },
        },
        {
          key: "type",
          header: "Type",
          render: (service) => {
            const type = service.type || "Standard";
            let badge = "bg-gray-100 text-gray-800";

            if (type === "Chirurgie") badge = "bg-blue-100 text-blue-800";
            if (type === "Maternité") badge = "bg-pink-100 text-pink-800";
            if (type === "Pédiatrie") badge = "bg-green-100 text-green-800";
            if (type === "Urgences") badge = "bg-red-100 text-red-800";
            if (type === "Réanimation") badge = "bg-purple-100 text-purple-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${badge}`}
              >
                {type}
              </span>
            );
          },
        },
        {
          key: "etage",
          header: "Étage",
          render: (service) => service.etage || "Non spécifié",
        },
        {
          key: "telephone",
          header: "Téléphone",
          render: (service) => service.telephone || "Non renseigné",
        },
        {
          key: "email",
          header: "Email",
          render: (service) => service.email || "Non renseigné",
        },
        {
          key: "responsableId",
          header: "Responsable",
          render: (service) => {
            if (service.responsable) {
              return `${service.responsable.prenom} ${service.responsable.nom}`;
            }
            return service.responsableId || "Non assigné";
          },
        },
        {
          key: "etablissementId",
          header: "Établissement",
          render: (service) => {
            if (service.etablissement) {
              return service.etablissement.nom;
            }
            return service.etablissementId || "Non assigné";
          },
        },
        {
          key: "description",
          header: "Description",
          render: (service) =>
            truncateText(service.description || "Aucune description", 50),
        },
      ]}
    />
  );
};

export default ServicesPage;
