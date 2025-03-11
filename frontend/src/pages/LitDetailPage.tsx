import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const LitDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="lit"
      pluralName="lits"
      apiEndpoint="/lits"
      title={(lit) => `Lit: ${lit.numeroLit}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "numeroLit", label: "Numéro de lit" },
        { key: "serviceId", label: "Identifiant du service" },
      ]}
    />
  );
};

export default LitDetailPage;
