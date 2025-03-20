import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import PatientsPage from "@/pages/PatientsPage";
import CreatePatientPage from "@/pages/create/CreatePatientPage";
import LitsPage from "@/pages/LitsPage";
import CreateLitPage from "@/pages/create/CreateLitPage";
import ServicesPage from "@/pages/ServicesPage";
import CreateServicePage from "@/pages/create/CreateServicePage";
import PersonnelsPage from "@/pages/PersonnelsPage";
import CreatePersonnelPage from "@/pages/create/CreatePersonnelPage";
import TransfertsPage from "@/pages/TransfertsPage";
import CreateTransfertPage from "@/pages/create/CreateTransfertPage";
import MaterielsPage from "@/pages/MaterielsPage";
import CreateMaterielPage from "@/pages/create/CreateMaterielPage";
import PrisesEnChargePage from "@/pages/PrisesEnChargePage";
import CreatePriseEnChargePage from "@/pages/create/CreatePriseEnCharge";
import ReservationsLitPage from "@/pages/ReservationsLitPage";
import CreateReservationLitPage from "@/pages/create/CreateReservationPage";
import EtablissementsPage from "@/pages/EtablissementsPage";
import CreateEtablissementPage from "@/pages/create/CreateEtablissementPage";
import PatientDetailPage from "@/pages/dynamic/PatientDetailPage";
import LitDetailPage from "@/pages/dynamic/LitDetailPage";
import ServiceDetailPage from "@/pages/dynamic/ServiceDetailPage";
import EtablissementDetailPage from "@/pages/dynamic/EtablissementDetailPage";
import MaterielDetailPage from "@/pages/dynamic/MaterielDetailPage";
import PersonnelDetailPage from "@/pages/dynamic/PersonnelDetailPage";
import PriseEnChargeDetailPage from "@/pages/dynamic/PriseEnChargeDetailPage";
import ReservationLitDetailPage from "@/pages/dynamic/ReservationLitDetailPage";
import TransfertDetailPage from "@/pages/dynamic/TransfertDetailPage";
import EditPriseEnChargePage from "@/pages/edit/EditPriseEnChargePage";
import EditPersonnelPage from "@/pages/edit/EditPersonnelPage";
import EditPatientPage from "@/pages/edit/EditPatientPage";
import EditEtablissementPage from "@/pages/edit/EditEtablissementPage";
import EditLitPage from "@/pages/edit/EditLitPage";
import EditMaterielPage from "@/pages/edit/EditMaterielPage";
import EditReservationLitPage from "@/pages/edit/EditReservationLitPage";
import EditServicePage from "@/pages/edit/EditServicePage";
import EditTransfertPage from "@/pages/edit/EditTransfertPage";

const AppRouter = () => {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Detail pages */}
      <Route path="/patients/:id" element={<PatientDetailPage />} />
      <Route path="/lits/:id" element={<LitDetailPage />} />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route path="/etablissements/:id" element={<EtablissementDetailPage />} />
      <Route path="/materiels/:id" element={<MaterielDetailPage />} />
      <Route path="/personnels/:id" element={<PersonnelDetailPage />} />
      <Route path="/prisesEnCharge/:id" element={<PriseEnChargeDetailPage />} />
      <Route
        path="/reservationsLit/:id"
        element={<ReservationLitDetailPage />}
      />
      <Route path="/transferts/:id" element={<TransfertDetailPage />} />

      {/* List pages */}
      <Route path="/lits" element={<LitsPage />} />
      <Route path="/patients" element={<PatientsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/personnels" element={<PersonnelsPage />} />
      <Route path="/reservationsLit" element={<ReservationsLitPage />} />
      <Route path="/materiels" element={<MaterielsPage />} />
      <Route path="/etablissements" element={<EtablissementsPage />} />
      <Route path="/prisesEnCharge" element={<PrisesEnChargePage />} />
      <Route path="/transferts" element={<TransfertsPage />} />

      {/* Create pages */}
      <Route path="/services/create" element={<CreateServicePage />} />
      <Route path="/personnels/create" element={<CreatePersonnelPage />} />
      <Route
        path="/reservationsLit/create"
        element={<CreateReservationLitPage />}
      />
      <Route path="/materiels/create" element={<CreateMaterielPage />} />
      <Route
        path="/etablissements/create"
        element={<CreateEtablissementPage />}
      />
      <Route
        path="/prisesEnCharge/create"
        element={<CreatePriseEnChargePage />}
      />
      <Route path="/transferts/create" element={<CreateTransfertPage />} />
      <Route path="/lits/create" element={<CreateLitPage />} />
      <Route path="/patients/create" element={<CreatePatientPage />} />

      {/* Edit pages */}
      <Route
        path="/etablissements/edit/:id"
        element={<EditEtablissementPage />}
      />
      <Route path="/lits/edit/:id" element={<EditLitPage />} />
      <Route path="/materiels/edit/:id" element={<EditMaterielPage />} />
      <Route path="/patients/edit/:id" element={<EditPatientPage />} />
      <Route
        path="/prisesEnCharge/edit/:id"
        element={<EditPriseEnChargePage />}
      />
      <Route path="/personnels/edit/:id" element={<EditPersonnelPage />} />
      <Route
        path="/reservationsLit/edit/:id"
        element={<EditReservationLitPage />}
      />
      <Route path="/services/edit/:id" element={<EditServicePage />} />
      <Route path="/transferts/edit/:id" element={<EditTransfertPage />} />
    </Routes>
  );
};

export default AppRouter;
