import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages de liste
import PatientsPage from "./pages/PatientsPage";
import LitsPage from "./pages/LitsPage";
import ServicesPage from "./pages/ServicesPage";
import EtablissementsPage from "./pages/EtablissementsPage";
import MaterielsPage from "./pages/MaterielsPage";
import PersonnelsPage from "./pages/PersonnelsPage";
import PrisesEnChargePage from "./pages/PrisesEnChargePage";
import ReservationsLitPage from "./pages/ReservationsLitPage";
import TransfertsPage from "./pages/TransfertsPage";

// Pages de détail
import PatientDetailPage from "./pages/PatientDetailPage";
import LitDetailPage from "./pages/LitDetailPage";
import ServiceDetailPage from "./pages/dynamic/ServiceDetailPage";
import EtablissementDetailPage from "./pages/dynamic/EtablissementDetailPage";
import MaterielDetailPage from "./pages/dynamic/MaterielDetailPage";
import PersonnelDetailPage from "./pages/dynamic/PersonnelDetailPage";
import PriseEnChargeDetailPage from "./pages/dynamic/PriseEnChargeDetailPage";
import ReservationLitDetailPage from "./pages/ReservationLitDetailPage";
import TransfertDetailPage from "./pages/TransfertDetailPage";

// Pages de création
import CreatePatientPage from "./components/CreatePatientPage";
import CreateLitPage from "./components/CreateLitPage";
import CreateServicePage from "./components/CreateServicePage";
// Importez les autres pages de création selon vos besoins

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Routes de liste */}
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/lits" element={<LitsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/etablissements" element={<EtablissementsPage />} />
        <Route path="/materiels" element={<MaterielsPage />} />
        <Route path="/personnels" element={<PersonnelsPage />} />
        <Route path="/prisesEnCharge" element={<PrisesEnChargePage />} />
        <Route path="/reservationsLit" element={<ReservationsLitPage />} />
        <Route path="/transferts" element={<TransfertsPage />} />

        {/* Routes de détail */}
        <Route path="/patients/:id" element={<PatientDetailPage />} />
        <Route path="/lits/:id" element={<LitDetailPage />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />
        <Route
          path="/etablissements/:id"
          element={<EtablissementDetailPage />}
        />
        <Route path="/materiels/:id" element={<MaterielDetailPage />} />
        <Route path="/personnels/:id" element={<PersonnelDetailPage />} />
        <Route
          path="/prisesEnCharge/:id"
          element={<PriseEnChargeDetailPage />}
        />
        <Route
          path="/reservationsLit/:id"
          element={<ReservationLitDetailPage />}
        />
        <Route path="/transferts/:id" element={<TransfertDetailPage />} />

        {/* Routes de création */}
        <Route path="/patients/create" element={<CreatePatientPage />} />
        <Route path="/lits/create" element={<CreateLitPage />} />
        <Route path="/services/create" element={<CreateServicePage />} />
        {/* Ajoutez d'autres routes de création ici */}

        {/* Route par défaut */}
        <Route path="/" element={<PatientsPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
