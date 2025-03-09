import UserManagement from "./components/UserManagement";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PatientsPage from "./pages/PatientsPage.js";
import CreatePatientPage from "./components/CreatePatientPage.js";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <UserManagement />

      <Router>
        <Routes>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/create" element={<CreatePatientPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
