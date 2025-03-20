import { Link } from "react-router-dom";
import {
  BedIcon,
  Users,
  Building2,
  Layers,
  ArrowRightLeft,
  Calendar,
  Briefcase,
  HeartPulse,
  MoveRight,
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      title: "Gestion des Lits",
      description:
        "Suivez l'état et la disponibilité de tous les lits en temps réel",
      icon: <BedIcon className="h-10 w-10 text-blue-500" />,
      path: "/lits",
    },
    {
      title: "Dossiers Patients",
      description:
        "Accédez aux informations des patients pour une meilleure prise en charge",
      icon: <Users className="h-10 w-10 text-indigo-500" />,
      path: "/patients",
    },
    {
      title: "Personnel Hospitalier",
      description: "Gérez les équipes médicales et leurs responsabilités",
      icon: <HeartPulse className="h-10 w-10 text-green-500" />,
      path: "/personnels",
    },
    {
      title: "Réservations",
      description: "Organisez les admissions et les séjours des patients",
      icon: <Calendar className="h-10 w-10 text-amber-500" />,
      path: "/reservationsLit",
    },
    {
      title: "Établissements",
      description: "Pilotez l'ensemble de vos établissements de santé",
      icon: <Building2 className="h-10 w-10 text-red-500" />,
      path: "/etablissements",
    },
    {
      title: "Services",
      description:
        "Gérez les différents services médicaux et leurs spécificités",
      icon: <Layers className="h-10 w-10 text-purple-500" />,
      path: "/services",
    },
    {
      title: "Transferts",
      description:
        "Optimisez les transferts de patients entre services et établissements",
      icon: <ArrowRightLeft className="h-10 w-10 text-cyan-500" />,
      path: "/transferts",
    },
    {
      title: "Matériel Médical",
      description: "Suivez l'inventaire et la maintenance du matériel médical",
      icon: <Briefcase className="h-10 w-10 text-gray-600" />,
      path: "/materiels",
    },
    {
      title: "Prises en Charge",
      description:
        "Gérez les soins et les traitements administrés aux patients",
      icon: <HeartPulse className="h-10 w-10 text-pink-500" />,
      path: "/prisesEnCharge",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenue sur Silbo
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10">
          Système Intégré de Logistique pour les Besoins Opérationnels
          Hospitaliers
        </p>
        <div className="max-w-2xl mx-auto bg-blue-50 p-6 rounded-lg border border-blue-100 shadow-sm">
          <p className="text-gray-700">
            Silbo est conçu pour optimiser la gestion des lits et des ressources
            hospitalières, permettant ainsi au personnel médical de se
            concentrer sur ce qui compte vraiment : la qualité des soins aux
            patients.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-16 shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Notre Mission</h2>
        <p className="text-lg md:text-xl mb-6">
          Aider le personnel hospitalier dans son quotidien en optimisant la
          distribution et la gestion des lits entre les différents
          établissements et services, garantissant ainsi un effectif adéquat à
          tout moment.
        </p>
        <div className="flex justify-center">
          <Link
            to="/lits"
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-full inline-flex items-center transition-all"
          >
            Explorer le système
            <MoveRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Fonctionnalités Principales
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.path}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 hover:border-blue-200"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="flex items-center text-blue-600 font-medium">
              Accéder
              <MoveRight className="ml-2 h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Getting Started Section */}
      <div className="bg-gray-50 rounded-xl p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Pour Commencer
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link
            to="/lits"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-center"
          >
            Gérer les Lits
          </Link>
          <Link
            to="/patients"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-center"
          >
            Voir les Patients
          </Link>
          <Link
            to="/transferts"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg text-center"
          >
            Organiser un Transfert
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-20">
        <p>
          © {new Date().getFullYear()} Silbo - Système de Gestion Hospitalière
        </p>
      </div>
    </div>
  );
};

export default HomePage;
