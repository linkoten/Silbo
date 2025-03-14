import React from "react";
import GenericListPage from "../components/GenericListPage";
import { formatDate, truncateText } from "../utils/formatUtils";

const PrisesEnChargePage: React.FC = () => {
  return (
    <GenericListPage
      entityName="priseEnCharge"
      pluralName="prisesEnCharge"
      apiEndpoint="/prisesEnCharge"
      columns={[
        { key: "id", header: "ID" },
        {
          key: "patientId",
          header: "Patient",
          render: (pec) => {
            if (pec.patient) {
              return `${pec.patient.prenom} ${pec.patient.nom}`;
            }
            return pec.patientId || "Non assigné";
          },
        },
        {
          key: "personnelId",
          header: "Personnel soignant",
          render: (pec) => {
            if (pec.personnel) {
              return (
                <div>
                  <div>{`${pec.personnel.prenom} ${pec.personnel.nom}`}</div>
                  <div className="text-xs text-gray-500">
                    {pec.personnel.profession}
                  </div>
                </div>
              );
            }
            return pec.personnelId || "Non assigné";
          },
        },
        {
          key: "dateDebut",
          header: "Date de début",
          render: (pec) => formatDate(pec.dateDebut),
        },
        {
          key: "dateFin",
          header: "Date de fin",
          render: (pec) => (pec.dateFin ? formatDate(pec.dateFin) : "En cours"),
        },
        {
          key: "status",
          header: "Statut",
          render: (pec) => {
            const isActive = !pec.dateFin || new Date(pec.dateFin) > new Date();
            const status = isActive ? "En cours" : "Terminée";
            const statusClass = isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800";

            return (
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}
              >
                {status}
              </span>
            );
          },
        },
        {
          key: "diagnostic",
          header: "Diagnostic",
          render: (pec) => truncateText(pec.diagnostic || "Non renseigné", 50),
        },
        {
          key: "traitement",
          header: "Traitement",
          render: (pec) => truncateText(pec.traitement || "Non renseigné", 50),
        },
        {
          key: "description",
          header: "Description",
          render: (pec) =>
            truncateText(pec.description || "Non renseignée", 50),
        },
      ]}
    />
  );
};

export default PrisesEnChargePage;
