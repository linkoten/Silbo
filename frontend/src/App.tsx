import UserManagement from "./components/UserManagement";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientsPage from "./pages/PatientsPage.js";
import CreatePatientPage from "./pages/create/CreatePatientPage.js";
import LitsPage from "./pages/LitsPage.js";
import CreateLitPage from "./pages/create/CreateLitPage.js";
import ServicesPage from "./pages/ServicesPage.js";
import CreateServicePage from "./pages/create/CreateServicePage.js";
import PersonnelsPage from "./pages/PersonnelsPage.js";
import CreatePersonnelPage from "./pages/create/CreatePersonnelPage.js";
import TransfertsPage from "./pages/TransfertsPage.js";
import CreateTransfertPage from "./pages/create/CreateTransfertPage.js";
import MaterielsPage from "./pages/MaterielsPage.js";
import CreateMaterielPage from "./pages/create/CreateMaterielPage.js";
import PrisesEnChargePage from "./pages/PrisesEnChargePage.js";
import CreatePriseEnChargePage from "./pages/create/CreatePriseEnCharge.js";
import ReservationsLitPage from "./pages/ReservationsLitPage.js";
import CreateReservationLitPage from "./pages/create/CreateReservationPage.js";
import EtablissementsPage from "./pages/EtablissementsPage.js";
import CreateEtablissementPage from "./pages/create/CreateEtablissementPage.js";
import { NavBar } from "./components/NavBar.js";
import PatientDetailPage from "./pages/dynamic/PatientDetailPage.js";
import LitDetailPage from "./pages/dynamic/LitDetailPage.js";
import ServiceDetailPage from "./pages/dynamic/ServiceDetailPage.js";
import EtablissementDetailPage from "./pages/dynamic/EtablissementDetailPage.js";
import MaterielDetailPage from "./pages/dynamic/MaterielDetailPage.js";
import PersonnelDetailPage from "./pages/dynamic/PersonnelDetailPage.js";
import PriseEnChargeDetailPage from "./pages/dynamic/PriseEnChargeDetailPage.js";
import ReservationLitDetailPage from "./pages/dynamic/ReservationLitDetailPage.js";
import TransfertDetailPage from "./pages/dynamic/TransfertDetailPage.js";

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
