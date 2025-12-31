import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Receipt,
  Package,
  Warehouse,
  Calendar,
  BarChart3,
  User,
  CreditCard,
  Settings,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  History,
  Briefcase,
  Box,
  ClipboardList,
  X,
  Menu, // 1. Ajout de l'icône Menu
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void; // 2. Ajout de la fonction pour ouvrir
}

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  path?: string;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  icon: any;
  path: string;
}

const Sidebar = ({ isOpen, onClose, onOpen }: SidebarProps) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setExpanded((p) => ({ ...p, [key]: !p[key] }));
  const isActive = (path?: string) => path && location.pathname === path;

  const closeOnMobile = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const menu: MenuItem[] = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      id: "clients",
      title: "Clients",
      icon: Users,
      submenu: [
        { title: "Liste", icon: List, path: "/clients/list" },
        { title: "Nouveau", icon: Plus, path: "/clients/new" },
      ],
    },
    {
      id: "ventes",
      title: "Ventes",
      icon: ShoppingCart,
      submenu: [
        { title: "Nouvelle vente", icon: Plus, path: "/ventes/new" },
        { title: "Historique", icon: History, path: "/ventes/list" },
      ],
    },
    { id: "devis", title: "Devis", icon: FileText, path: "/devis/list" },
    {
      id: "factures",
      title: "Factures",
      icon: Receipt,
      path: "/factures/list",
    },
    {
      id: "produits",
      title: "Produits",
      icon: Package,
      submenu: [
        { title: "Liste", icon: List, path: "/produits/list" },
        { title: "Nouveau", icon: Plus, path: "/produits/new" },
      ],
    },
    {
      id: "stock",
      title: "Stock",
      icon: Warehouse,
      submenu: [
        { title: "Mouvements", icon: ClipboardList, path: "/stock/mouvements" },
        { title: "Historique", icon: History, path: "/stock/historique" },
        { title: "Sortie Stock", icon: Box, path: "/stock/sortir" },
         { title: "Ajouter Stock", icon: Box, path: "/stock/ajouter" },
      ],
    },
    { id: "activites", title: "Activités", icon: Calendar, path: "/activites" },
    { id: "rapports", title: "Rapports", icon: BarChart3, path: "/rapports" },
    {
      id: "utilisateurs",
      title: "Utilisateurs",
      icon: User,
      path: "/utilisateurs",
    },
    { id: "caisse", title: "Caisse", icon: CreditCard, path: "/caisse" },
    {
      id: "paramètres",
      title: "Paramètres",
      icon: Settings,
      submenu: [
        { title: "Utilisateurs", icon: User, path: "/paramètres/utilisateurs" },
        { title: "Société", icon: Briefcase, path: "/paramètres/societe" },
        { title: "Centre", icon: Settings, path: "/paramètres/centre" },
      ],
    },
  ];

  return (
    <>
      {/* 3. BOUTON DÉCLENCHEUR (TIROIR) */}
      {/* Ce bouton apparaît uniquement quand la sidebar est fermée sur mobile */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg lg:hidden hover:bg-gray-800 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Overlay mobile (Fond grisé) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        role="navigation"
        aria-label="Menu principal"
        className={`
          fixed top-0 left-0 z-40 h-screen w-72
          bg-gray-900 text-gray-100 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:relative
          
          /* Gestion du scroll sans barre visible */
          overflow-y-auto 
          [scrollbar-width:none] 
          [-ms-overflow-style:none] 
          [&::-webkit-scrollbar]:hidden
        `}
      >
        {/* Header - Sticky pour rester visible lors du scroll */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 h-20 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Briefcase className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">UATM</h1>
              <p className="text-xs text-gray-400">Gasa-formation</p>
            </div>
          </div>
          {/* Bouton Fermer (Visible uniquement sur mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu - Pas de overflow ici pour utiliser celui du parent */}
        <nav className="px-3 py-4 space-y-1">
          {menu.map((item) =>
            item.submenu ? (
              <div key={item.id}>
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                  aria-expanded={expanded[item.id]}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {expanded[item.id] ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {expanded[item.id] && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-gray-800 pl-4">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={closeOnMobile}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(sub.path)
                            ? "bg-blue-600/20 text-blue-400 font-medium"
                            : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                        }`}
                      >
                        <sub.icon className="w-4 h-4" />
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.id}
                to={item.path!}
                onClick={closeOnMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-600/20 text-blue-400 font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            )
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
