import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const EtablissementDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="etablissement"
      pluralName="etablissements"
      apiEndpoint="/etablissements"
      title={(etablissement) => `Établissement: ${etablissement.nom}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "nom", label: "Nom" },
        { key: "adresse", label: "Adresse" },
      ]}
    />
  );
};

export default EtablissementDetailPage;
