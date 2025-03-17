import React from "react";
import { Link } from "react-router-dom";

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  priorite?: "haute" | "moyenne" | "basse";
  tempsAttente?: number; // temps en minutes
  age?: number;
}

interface ServiceWaitingPatientsProps {
  patients: Patient[];
  className?: string;
}

export const ServiceWaitingPatients: React.FC<ServiceWaitingPatientsProps> = ({
  patients,
  className = "",
}) => {
  // Tri des patients par priorité et temps d'attente
  const sortedPatients = [...patients].sort((a, b) => {
    // D'abord par priorité
    const priorityOrder = { haute: 0, moyenne: 1, basse: 2 };
    const aPriority = priorityOrder[a.priorite || "basse"] || 2;
    const bPriority = priorityOrder[b.priorite || "basse"] || 2;

    if (aPriority !== bPriority) return aPriority - bPriority;

    // Ensuite par temps d'attente (plus long en premier)
    return (b.tempsAttente || 0) - (a.tempsAttente || 0);
  });

  // Formatage du temps d'attente
  const formatTempsAttente = (minutes?: number) => {
    if (minutes === undefined) return "Inconnu";
    if (minutes < 60) return `${minutes} min`;
    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${heures}h${mins > 0 ? ` ${mins}min` : ""}`;
  };

  // Classe pour la priorité
  const getPrioriteClass = (priorite?: string) => {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-800";
      case "moyenne":
        return "bg-orange-100 text-orange-800";
      case "basse":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Patients en attente</h3>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
          {patients.length} patient{patients.length !== 1 ? "s" : ""}
        </span>
      </div>

      {patients.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attente
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-medium">
                        {patient.prenom.charAt(0)}
                        {patient.nom.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.prenom} {patient.nom}
                        </div>
                        {patient.age && (
                          <div className="text-xs text-gray-500">
                            {patient.age} ans
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${getPrioriteClass(
                        patient.priorite
                      )}`}
                    >
                      {patient.priorite || "Normale"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatTempsAttente(patient.tempsAttente)}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Voir
                      </Link>
                      <Link
                        to={`/reservations-lits/create?patientId=${patient.id}`}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Assigner
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p>Aucun patient en attente</p>
        </div>
      )}
    </div>
  );
};
