import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const PersonnelDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="personnel"
      pluralName="personnels"
      apiEndpoint="/personnels"
      title={(personnel) => `Personnel: ${personnel.nom} ${personnel.prenom}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "nom", label: "Nom" },
        { key: "prenom", label: "Prénom" },
        { key: "profession", label: "Profession" },
        { key: "serviceId", label: "Identifiant du service" },
      ]}
    />
  );
};

export default PersonnelDetailPage;
