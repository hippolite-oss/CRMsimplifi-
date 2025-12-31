import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Settings, Loader2 } from "lucide-react";
import Axios from "../utils/Axios";

// Types pour l'utilisateur (à ajuster selon votre structure)
interface UserType {
  name?: string;
  email?: string;
  role?: string;
}

// Types pour le centre (à ajuster selon votre structure)
interface CentreType {
  nom: string;
}

const Topbar = () => {
  const navigate = useNavigate();

  // REMPLACEZ CES VALEURS PAR VOTRE LOGIQUE D'AUTHENTIFICATION
  const [user] = useState<UserType>({
    name: "Admin Utilisateur",
    email: "admin@example.com",
    role: "admin",
  });

  const [currentCentre, setCurrentCentre] = useState<CentreType>({
    nom: "Centre Principal",
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState({
    commandes: 0,
    ardoises: 0,
  });
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [parametres, setParametres] = useState<any>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Récupérer nom société + notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Paramètres société
        const paramRes = await Axios.get("/api/parametres");
        if (paramRes.data.success) {
          setParametres(paramRes.data.data);
        }

        // Notifications (commandes + ardoises)
        const [cmdRes, ardRes] = await Promise.all([
          Axios.get("/api/commande-online", {
            params: { statut: "nouveau", limit: 1 },
          }),
          Axios.get("/api/clients", {
            params: { solde_actuel_gt: 0, limit: 1 },
          }),
        ]);

        setNotifications({
          commandes: cmdRes.data.pagination?.total || 0,
          ardoises: ardRes.data.pagination?.total || 0,
        });
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoadingNotif(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000); // Rafraîchit toutes les 2 min
    return () => clearInterval(interval);
  }, []);

  // Gestion clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside, { capture: true });
    return () =>
      document.removeEventListener("click", handleClickOutside, {
        capture: true,
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Remplacez par votre logique de déconnexion
    navigate("/login");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const totalNotifications = notifications.commandes + notifications.ardoises;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-end px-4 sm:px-6 lg:px-8 shadow-sm">
      {/* Centre - Notifications */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/commande")}
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors group"
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          {!loadingNotif && totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-zinc-900">
              {totalNotifications > 99 ? "99+" : totalNotifications}
            </span>
          )}
          {loadingNotif && (
            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-zinc-900">
              <Loader2 className="w-3 h-3 animate-spin" />
            </span>
          )}
        </button>
      </div>

      {/* Droite - Profil */}
      <div className="relative" ref={profileMenuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowProfileMenu((prev) => !prev);
          }}
          className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <div className="hidden sm:block text-right">
            <span className="block text-sm font-medium text-gray-900 dark:text-white">
              {user.name || "Utilisateur"}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user.role || ""}
            </span>
          </div>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              {getInitials(user.name)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-zinc-900"></div>
          </div>
        </button>

        {/* Menu Profil */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-800 overflow-hidden z-50">
            {/* Infos utilisateur */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Liens */}
            <div className="py-1">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/admin/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <User className="w-4 h-4" />
                Mon profil
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/admin/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Paramètres
              </button>
            </div>

            {/* Déconnexion */}
            <div className="border-t border-gray-200 dark:border-zinc-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
