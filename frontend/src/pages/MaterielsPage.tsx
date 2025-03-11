import React from "react";
import GenericListPage from "../components/GenericListPage";

const MaterielsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="materiel"
      pluralName="materiels"
      apiEndpoint="/materiels"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "quantite", header: "Quantité" },
        { key: "description", header: "Description" },
        { key: "serviceId", header: "Service ID" },
      ]}
    />
  );
};

export default MaterielsPage;
