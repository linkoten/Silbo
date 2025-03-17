import React from "react";

interface ServiceOccupationChartProps {
  capaciteTotal: number;
  litsOccupes: number;
  litsLibres: number;
  litsEnMaintenance?: number;
  className?: string;
}

export const ServiceOccupationChart: React.FC<ServiceOccupationChartProps> = ({
  capaciteTotal,
  litsOccupes,
  litsLibres,
  litsEnMaintenance = 0,
  className = "",
}) => {
  // Calcul des pourcentages pour les segments du graphique
  const occupesPercent = (litsOccupes / capaciteTotal) * 100;
  const libresPercent = (litsLibres / capaciteTotal) * 100;
  const maintenancePercent = (litsEnMaintenance / capaciteTotal) * 100;

  // Détermination de la couleur de statut global
  let statusColor = "bg-green-500";
  const occupationRate = (litsOccupes / capaciteTotal) * 100;

  if (occupationRate >= 90) {
    statusColor = "bg-red-500";
  } else if (occupationRate >= 75) {
    statusColor = "bg-yellow-500";
  }

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Occupation des lits</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
          <span className="text-sm font-medium">
            {Math.round(occupationRate)}% occupé
          </span>
        </div>
      </div>

      {/* Graphique de progression à segments */}
      <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden flex">
        {litsOccupes > 0 && (
          <div
            className="bg-blue-500 h-full"
            style={{ width: `${occupesPercent}%` }}
            title={`Lits occupés: ${litsOccupes}`}
          ></div>
        )}
        {litsLibres > 0 && (
          <div
            className="bg-green-400 h-full"
            style={{ width: `${libresPercent}%` }}
            title={`Lits disponibles: ${litsLibres}`}
          ></div>
        )}
        {litsEnMaintenance > 0 && (
          <div
            className="bg-gray-400 h-full"
            style={{ width: `${maintenancePercent}%` }}
            title={`Lits en maintenance: ${litsEnMaintenance}`}
          ></div>
        )}
      </div>

      {/* Légende */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm">{litsOccupes} occupés</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
          <span className="text-sm">{litsLibres} disponibles</span>
        </div>
        {litsEnMaintenance > 0 && (
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded mr-2"></div>
            <span className="text-sm">{litsEnMaintenance} en maintenance</span>
          </div>
        )}
      </div>

      {/* Capacité totale */}
      <div className="mt-4 text-sm text-gray-500 text-right">
        Capacité totale:{" "}
        <span className="font-medium">{capaciteTotal} lits</span>
      </div>
    </div>
  );
};
