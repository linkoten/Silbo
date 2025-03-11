import UserManagement from "./components/UserManagement";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientsPage from "./pages/PatientsPage.js";
import CreatePatientPage from "./components/CreatePatientPage.js";
import LitsPage from "./pages/LitsPage.js";
import CreateLitPage from "./components/CreateLitPage.js";
import ServicesPage from "./pages/ServicesPage.js";
import CreateServicePage from "./components/CreateServicePage.js";
import PersonnelsPage from "./pages/PersonnelsPage.js";
import CreatePersonnelPage from "./components/CreatePersonnelPage.js";
import TransfertsPage from "./pages/TransfertsPage.js";
import CreateTransfertPage from "./components/CreateTransfertPage.js";
import MaterielsPage from "./pages/MaterielsPage.js";
import CreateMaterielPage from "./components/CreateMaterielPage.js";
import PrisesEnChargePage from "./pages/PrisesEnChargePage.js";
import CreatePriseEnChargePage from "./components/CreatePriseEnCharge.js";
import ReservationsLitPage from "./pages/ReservationsLitPage.js";
import CreateReservationLitPage from "./components/CreateReservationPage.js";
import EtablissementsPage from "./pages/EtablissementsPage.js";
import CreateEtablissementPage from "./components/CreateEtablissementPage.js";
import { NavBar } from "./components/NavBar.js";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <NavBar />
        <div className="flex-1">
          <UserManagement />
          <Toaster />
          <main className="p-6 lg:p-8">
            <Routes>
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/lits" element={<LitsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/create" element={<CreateServicePage />} />
              <Route path="/personnels" element={<PersonnelsPage />} />
              <Route
                path="/personnels/create"
                element={<CreatePersonnelPage />}
              />
              <Route
                path="/reservationsLit"
                element={<ReservationsLitPage />}
              />
              <Route
                path="/reservationsLit/create"
                element={<CreateReservationLitPage />}
              />
              <Route path="/materiels" element={<MaterielsPage />} />
              <Route
                path="/materiels/create"
                element={<CreateMaterielPage />}
              />
              <Route path="/etablissements" element={<EtablissementsPage />} />
              <Route
                path="/etablissements/create"
                element={<CreateEtablissementPage />}
              />
              <Route path="/prisesEnCharge" element={<PrisesEnChargePage />} />
              <Route
                path="/prisesEnCharge/create"
                element={<CreatePriseEnChargePage />}
              />
              <Route path="/transferts" element={<TransfertsPage />} />
              <Route
                path="/transferts/create"
                element={<CreateTransfertPage />}
              />
              <Route path="/lits/create" element={<CreateLitPage />} />
              <Route path="/patients/create" element={<CreatePatientPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
