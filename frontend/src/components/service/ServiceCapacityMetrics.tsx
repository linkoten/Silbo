import React from "react";
import { useToast } from "@/components/ui/use-toast";

interface ServiceMetricsProps {
  // Données du service
  capaciteTotal: number; // Capacité totale du service en nombre de lits
  litsDisponibles: number; // Nombre de lits disponibles
  litsOccupes: number; // Nombre de lits occupés
  litsEnMaintenance?: number; // Nombre de lits en maintenance

  // Seuils d'alerte (optionnels avec valeurs par défaut)
  seuilCapacite?: number; // % de la capacité totale
  seuilOccupation?: number; // % des lits occupés

  // Style supplémentaire (optionnel)
  className?: string;
}

export const ServiceCapacityMetrics: React.FC<ServiceMetricsProps> = ({
  capaciteTotal,
  litsDisponibles,
  litsOccupes,
  litsEnMaintenance = 0,
  seuilCapacite = 90, // Par défaut, alerte si capacité utilisée > 90%
  seuilOccupation = 85, // Par défaut, alerte si occupation > 85%
  className = "",
}) => {
  const { toast } = useToast();
  const [alertsTriggered, setAlertsTriggered] = React.useState<
    Record<string, boolean>
  >({});

  // Calculs des métriques
  const capaciteOccupee = (litsOccupes / capaciteTotal) * 100;
  const capaciteTotaleLitsDisponibles = (litsDisponibles / capaciteTotal) * 100;
  const capaciteActuelleLitsDisponibles = litsDisponibles - litsOccupes;
  const pourcentageLitsOccupes =
    (litsOccupes / (litsDisponibles > 0 ? litsDisponibles : 1)) * 100;

  const pourcentageMaintenance =
    capaciteTotal > 0
      ? Math.round((litsEnMaintenance / capaciteTotal) * 100)
      : 0;

  // Détermination des classes de couleur en fonction des seuils
  const getColorClass = (percentage: number, threshold: number) => {
    if (percentage >= threshold) return "text-red-500";
    if (percentage >= threshold * 0.8) return "text-yellow-500";
    return "text-green-500";
  };

  // Déclenchement des alertes
  React.useEffect(() => {
    // Alerte pour capacité totale
    if (capaciteOccupee >= seuilCapacite && !alertsTriggered["capacite"]) {
      toast({
        title: "Alerte - Capacité critique",
        description: `Le service atteint ${Math.round(
          capaciteOccupee
        )}% de sa capacité totale.`,
        variant: "destructive",
        sound: true,
      });
      setAlertsTriggered((prev) => ({ ...prev, capacite: true }));
    } else if (
      capaciteOccupee < seuilCapacite * 0.7 &&
      alertsTriggered["capacite"]
    ) {
      setAlertsTriggered((prev) => ({ ...prev, capacite: false }));
    }

    // Alerte pour occupation des lits
    if (
      pourcentageLitsOccupes >= seuilOccupation &&
      !alertsTriggered["occupation"]
    ) {
      toast({
        title: "Alerte - Occupation des lits",
        description: `${Math.round(
          pourcentageLitsOccupes
        )}% des lits disponibles sont occupés.`,
        variant: "warning",
        sound: true,
      });
      setAlertsTriggered((prev) => ({ ...prev, occupation: true }));
    } else if (
      pourcentageLitsOccupes < seuilOccupation * 0.7 &&
      alertsTriggered["occupation"]
    ) {
      setAlertsTriggered((prev) => ({ ...prev, occupation: false }));
    }
  }, [
    capaciteOccupee,
    pourcentageLitsOccupes,
    seuilCapacite,
    seuilOccupation,
    toast,
    capaciteActuelleLitsDisponibles,
    alertsTriggered,
  ]);

  return (
    <div className={`bg-white p-5 rounded-xl shadow-md ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Métriques de capacité</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Capacité occupée */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Capacité occupée
            </span>
            <span
              className={`font-bold ${getColorClass(
                capaciteOccupee,
                seuilCapacite
              )}`}
            >
              {Math.round(capaciteOccupee)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${getColorClass(
                capaciteOccupee,
                seuilCapacite
              ).replace("text-", "bg-")}`}
              style={{ width: `${Math.min(capaciteOccupee, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {litsOccupes} / {capaciteTotal} lits
          </div>
        </div>

        {/* Capacité des lits disponibles */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Lits disponibles
            </span>
            <span
              className={`font-bold ${getColorClass(
                100 - capaciteTotaleLitsDisponibles,
                100 - seuilCapacite
              )}`}
            >
              {Math.round(capaciteTotaleLitsDisponibles)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${getColorClass(
                100 - capaciteTotaleLitsDisponibles,
                100 - seuilCapacite
              ).replace("text-", "bg-")}`}
              style={{
                width: `${Math.min(capaciteTotaleLitsDisponibles, 100)}%`,
              }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {litsDisponibles} / {capaciteTotal} lits
          </div>
        </div>

        {/* Capacité actuelle des lits disponibles */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Lits actuellement disponibles
          </div>
          <div className="flex items-baseline">
            <span
              className={`text-2xl font-bold ${getColorClass(
                100 - (capaciteActuelleLitsDisponibles / capaciteTotal) * 100,
                100 - seuilCapacite
              )}`}
            >
              {capaciteActuelleLitsDisponibles}
            </span>
            <span className="ml-2 text-xs text-gray-500">lits</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {litsDisponibles - litsOccupes} sur {capaciteTotal} lits au total
          </div>
        </div>

        {/* Pourcentage de lits occupés */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              Taux d'occupation
            </span>
            <span
              className={`font-bold ${getColorClass(
                pourcentageLitsOccupes,
                seuilOccupation
              )}`}
            >
              {Math.round(pourcentageLitsOccupes)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${getColorClass(
                pourcentageLitsOccupes,
                seuilOccupation
              ).replace("text-", "bg-")}`}
              style={{ width: `${Math.min(pourcentageLitsOccupes, 100)}%` }}
            ></div>
          </div>
          <div className="mt-1 text-xs text-gray-500">
            {litsOccupes} occupés / {litsDisponibles} disponibles
          </div>
        </div>

        {/* Lits en maintenance */}
        {litsEnMaintenance > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-600">
                En maintenance
              </span>
              <span className="text-sm font-medium text-yellow-600">
                {litsEnMaintenance} / {capaciteTotal}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-yellow-500 h-2.5 rounded-full"
                style={{ width: `${pourcentageMaintenance}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {pourcentageMaintenance}% en maintenance
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
