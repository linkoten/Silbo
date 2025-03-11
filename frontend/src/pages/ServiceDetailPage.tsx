import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const ServiceDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="service"
      pluralName="services"
      apiEndpoint="/services"
      title={(service) => `Service: ${service.nom}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "nom", label: "Nom du service" },
        { key: "capacite", label: "Capacité" },
        { key: "etablissementId", label: "Identifiant de l'établissement" },
      ]}
    />
  );
};

export default ServiceDetailPage;
