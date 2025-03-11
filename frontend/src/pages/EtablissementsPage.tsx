import React from "react";
import GenericListPage from "../components/GenericListPage";

const EtablissementsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="etablissement"
      pluralName="etablissements"
      apiEndpoint="/etablissements"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "adresse", header: "Adresse" },
      ]}
    />
  );
};

export default EtablissementsPage;
