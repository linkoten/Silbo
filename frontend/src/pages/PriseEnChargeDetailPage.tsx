import React from "react";
import GenericDetailPage from "../components/GenericDetailPage";

const PriseEnChargeDetailPage: React.FC = () => {
  return (
    <GenericDetailPage
      entityName="priseEnCharge"
      pluralName="prisesEnCharge"
      apiEndpoint="/prisesEnCharge"
      title={(priseEnCharge) => `Prise en charge: ${priseEnCharge.id}`}
      fields={[
        { key: "id", label: "Identifiant" },
        { key: "patientId", label: "Identifiant du patient" },
        { key: "personnelId", label: "Identifiant du personnel" },
      ]}
    />
  );
};

export default PriseEnChargeDetailPage;
