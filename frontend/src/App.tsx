import UserManagement from "./components/UserManagement";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      <UserManagement />
    </div>
  );
}

export default App;
