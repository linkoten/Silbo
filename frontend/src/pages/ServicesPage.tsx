import React from "react";
import GenericListPage from "../components/GenericListPage";

const ServicesPage: React.FC = () => {
  return (
    <GenericListPage
      entityName="service"
      pluralName="services"
      apiEndpoint="/services"
      columns={[
        { key: "id", header: "ID" },
        { key: "nom", header: "Nom" },
        { key: "etablissementId", header: "Établissement ID" },
        { key: "capacite", header: "Capacité" },
      ]}
    />
  );
};

export default ServicesPage;
