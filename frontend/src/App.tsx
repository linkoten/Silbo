import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import AppRouter from "@/components/AppRouter";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background">
        <NavBar />
        <div className="flex-1">
          <Toaster />
          <main className="p-6 lg:p-8">
            <AppRouter />
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
