import { PriseEnChargeWithRelations } from "@/stores/prise-en-charge-store";
import React from "react";

interface PriseEnChargeDetailsTabProps {
  priseEnCharge: PriseEnChargeWithRelations;
}

const PriseEnChargeDetailsTab: React.FC<PriseEnChargeDetailsTabProps> = ({
  priseEnCharge,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR").format(date);
  };

  // Déterminer le statut actuel
  const isActive =
    !priseEnCharge.dateFin || new Date(priseEnCharge.dateFin) > new Date();
  const statusText = isActive ? "En cours" : "Terminée";
  const statusClass = isActive
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";

  return (
    <div className="space-y-8">
      {/* Informations générales */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Détails de la prise en charge
        </h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Date de début</dt>
            <dd className="mt-1 text-lg text-gray-900">
              {formatDate(priseEnCharge.dateDebut)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Date de fin</dt>
            <dd className="mt-1 text-gray-900">
              {priseEnCharge.dateFin
                ? formatDate(priseEnCharge.dateFin)
                : "En cours"}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Statut</dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${statusClass}`}
              >
                {statusText}
              </span>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Identifiant</dt>
            <dd className="mt-1 text-gray-500 text-sm font-mono">
              {priseEnCharge.id}
            </dd>
          </div>
        </dl>
      </div>

      {/* Informations médicales */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Informations médicales
        </h2>

        <div className="space-y-6">
          {priseEnCharge.diagnostic && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Diagnostic
              </h3>
              <div className="p-4 bg-blue-50 rounded-lg text-gray-800">
                {priseEnCharge.diagnostic}
              </div>
            </div>
          )}

          {priseEnCharge.traitement && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Traitement
              </h3>
              <div className="p-4 bg-green-50 rounded-lg text-gray-800">
                {priseEnCharge.traitement}
              </div>
            </div>
          )}

          {priseEnCharge.description && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Description
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg text-gray-800">
                {priseEnCharge.description}
              </div>
            </div>
          )}

          {priseEnCharge.notes && (
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-2">
                Notes additionnelles
              </h3>
              <div className="p-4 bg-yellow-50 rounded-lg text-gray-800">
                {priseEnCharge.notes}
              </div>
            </div>
          )}

          {!priseEnCharge.diagnostic &&
            !priseEnCharge.traitement &&
            !priseEnCharge.description &&
            !priseEnCharge.notes && (
              <div className="text-center py-6 text-gray-500">
                <p>
                  Aucune information médicale spécifiée pour cette prise en
                  charge.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PriseEnChargeDetailsTab;
