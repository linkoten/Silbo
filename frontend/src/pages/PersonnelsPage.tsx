import React from "react";
import GenericListPage from "../components/GenericListPage";

const PersonnelsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="personnel"
      pluralName="personnels"
      apiEndpoint="/personnels"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "prenom", header: "Prénom" },
        { key: "profession", header: "Profession" },
        { key: "serviceId", header: "Service ID" },
      ]}
    />
  );
};

export default PersonnelsPage;
