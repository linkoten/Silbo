import React from "react";
import GenericListPage from "../components/GenericListPage";

const PrisesEnChargePage: React.FC = () => {
  return (
    <GenericListPage
      entityName="priseEnCharge"
      pluralName="prisesEnCharge"
      apiEndpoint="/prisesEnCharge"
      columns={[
        { key: "id", header: "ID" },
        { key: "patientId", header: "Patient ID" },
        { key: "personnelId", header: "Personnel ID" },
      ]}
    />
  );
};

export default PrisesEnChargePage;
