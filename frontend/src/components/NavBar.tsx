import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Hospital,
  UserRound,
  Bed,
  Stethoscope,
  Calendar,
  HeartPulse,
  Briefcase,
  ArrowRightLeft,
  Users,
  Menu,
  X,
  Home,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface RouteConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const routes: RouteConfig[] = [
  {
    path: "/",
    label: "Accueil",
    icon: <Home size={20} />,
  },
  {
    path: "/patients",
    label: "Patients",
    icon: <UserRound size={20} />,
  },
  {
    path: "/lits",
    label: "Lits",
    icon: <Bed size={20} />,
  },
  {
    path: "/services",
    label: "Services",
    icon: <Stethoscope size={20} />,
  },
  {
    path: "/etablissements",
    label: "Établissements",
    icon: <Hospital size={20} />,
  },
  {
    path: "/reservationsLit",
    label: "Réservations",
    icon: <Calendar size={20} />,
  },
  {
    path: "/prisesEnCharge",
    label: "Prises en charge",
    icon: <HeartPulse size={20} />,
  },
  {
    path: "/materiels",
    label: "Matériels",
    icon: <Briefcase size={20} />,
  },
  {
    path: "/transferts",
    label: "Transferts",
    icon: <ArrowRightLeft size={20} />,
  },
  {
    path: "/personnels",
    label: "Personnel",
    icon: <Users size={20} />,
  },
];

export function NavBar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex h-screen fixed left-0 border-r border-border bg-card w-64">
        <div className="flex flex-col w-full">
          <div className="px-4 py-6 border-b border-border">
            <h2 className="text-2xl font-bold text-primary">Silbo</h2>
            <p className="text-sm text-muted-foreground">Système de gestion</p>
          </div>
          <ScrollArea className="flex-1 py-3">
            <nav className="grid gap-1 px-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                    location.pathname === route.path &&
                      "bg-accent text-accent-foreground font-medium"
                  )}
                >
                  {route.icon}
                  <span>{route.label}</span>
                </Link>
              ))}
            </nav>
          </ScrollArea>
          <div className="mt-auto p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">© 2025 Silbo</p>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Silbo</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-muted-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-background z-10 pt-16">
          <nav className="grid gap-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === route.path &&
                    "bg-accent text-accent-foreground font-medium"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {route.icon}
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content Padding */}
      <div className="lg:pl-64 pt-[60px] lg:pt-0">
        {/* Your page content goes here */}
      </div>
    </>
  );
}
