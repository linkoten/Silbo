import React from "react";
import GenericListPage from "../components/GenericListPage";

const LitsPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="lit"
      pluralName="lits"
      apiEndpoint="/lits"
      columns={[
        { key: "id", header: "ID" },
        { key: "numeroLit", header: "Numéro de lit" },
        { key: "serviceId", header: "Service ID" },
      ]}
    />
  );
};

export default LitsPage;
