import React from "react";
import GenericListPage from "../components/GenericListPage";
import { truncateText } from "../utils/formatUtils";

const EtablissementsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="etablissement"
      pluralName="etablissements"
      apiEndpoint="/etablissements"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        {
          key: "adresse",
          header: "Adresse",
          render: (etab) => truncateText(etab.adresse || "Non renseignée", 40),
        },
        {
          key: "ville",
          header: "Ville",
          render: (etab) => etab.ville || "Non renseignée",
        },
        {
          key: "codePostal",
          header: "Code postal",
          render: (etab) => etab.codePostal || "Non renseigné",
        },
        {
          key: "telephone",
          header: "Téléphone",
          render: (etab) => etab.telephone || "Non renseigné",
        },
        {
          key: "email",
          header: "Email",
          render: (etab) => etab.email || "Non renseigné",
        },
        {
          key: "siteWeb",
          header: "Site web",
          render: (etab) => etab.siteWeb || "Non renseigné",
        },
        {
          key: "type",
          header: "Type",
          render: (etab) => {
            const type = etab.type || "Non spécifié";
            let badge = "bg-gray-100 text-gray-800";

            if (type === "CHU") badge = "bg-blue-100 text-blue-800";
            if (type === "Clinique") badge = "bg-green-100 text-green-800";
            if (type === "EHPAD") badge = "bg-purple-100 text-purple-800";
            if (type === "Centre de soins") badge = "bg-teal-100 text-teal-800";

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
          key: "nombreLits",
          header: "Nombre de lits",
          render: (etab) => etab.nombreLits || "0",
        },
        {
          key: "directeur",
          header: "Directeur",
          render: (etab) => etab.directeur || "Non renseigné",
        },
        {
          key: "description",
          header: "Description",
          render: (etab) =>
            truncateText(etab.description || "Aucune description", 50),
        },
      ]}
    />
  );
};

export default EtablissementsPage;
