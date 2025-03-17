import React from "react";

interface ServiceAlertBannerProps {
  capaciteOccupee: number;
  capaciteActuelleLitsDisponibles: number;
  pourcentageLitsOccupes: number;
  seuilCapacite?: number;
  seuilOccupation?: number;
  className?: string;
}

export const ServiceAlertBanner: React.FC<ServiceAlertBannerProps> = ({
  capaciteOccupee,
  capaciteActuelleLitsDisponibles,
  pourcentageLitsOccupes,
  seuilCapacite = 90,
  seuilOccupation = 85,
  className = "",
}) => {
  // Déterminer quelle alerte afficher (priorité à la plus critique)
  const alerts = [];

  // Alerte critique: dépassement de capacité
  if (capaciteOccupee >= seuilCapacite) {
    alerts.push({
      type: "critical",
      message: `Capacité critique : ${Math.round(
        capaciteOccupee
      )}% de la capacité totale du service est utilisée`,
      icon: "alert-circle",
    });
  }

  // Alerte importante: occupation élevée
  else if (pourcentageLitsOccupes >= seuilOccupation) {
    alerts.push({
      type: "warning",
      message: `Forte occupation : ${Math.round(
        pourcentageLitsOccupes
      )}% des lits disponibles sont occupés`,
      icon: "alert-triangle",
    });
  }

  // S'il n'y a pas d'alerte, ne rien afficher
  if (alerts.length === 0) {
    return null;
  }

  // Afficher l'alerte la plus critique
  const mostCriticalAlert =
    alerts.find((alert) => alert.type === "critical") || alerts[0];
  const bgClass =
    mostCriticalAlert.type === "critical"
      ? "bg-red-50 border-red-300 text-red-800"
      : "bg-yellow-50 border-yellow-300 text-yellow-800";
  const iconClass =
    mostCriticalAlert.type === "critical" ? "text-red-500" : "text-yellow-500";

  return (
    <div className={`border rounded-lg p-4 mb-6 ${bgClass} ${className}`}>
      <div className="flex items-center">
        {mostCriticalAlert.icon === "alert-circle" && (
          <svg
            className={`w-6 h-6 mr-3 ${iconClass}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {mostCriticalAlert.icon === "alert-triangle" && (
          <svg
            className={`w-6 h-6 mr-3 ${iconClass}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        )}
        <div>
          <p className="font-medium">{mostCriticalAlert.message}</p>
          {alerts.length > 1 && (
            <p className="mt-1 text-sm">
              {alerts.length - 1} autre{alerts.length > 2 ? "s" : ""} alerte
              {alerts.length > 2 ? "s" : ""} à surveiller
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
