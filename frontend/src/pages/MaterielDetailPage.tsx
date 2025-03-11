import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const MaterielDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="materiel"
      pluralName="materiels"
      apiEndpoint="/materiels"
      title={(materiel) => `Matériel: ${materiel.nom}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "nom", label: "Nom" },
        { key: "quantite", label: "Quantité" },
        { key: "description", label: "Description" },
        { key: "serviceId", label: "Identifiant du service" },
      ]}
    />
  );
};

export default MaterielDetailPage;
