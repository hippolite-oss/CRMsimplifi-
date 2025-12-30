// components/TopBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Menu, Bell, LogOut, User, Settings, Loader2, Building2,
  ShoppingCart, HandCoins, AlertCircle
} from "lucide-react";
import { logout } from "../store/userSlice";
import Axios from "../utils/Axios";
import SelectCentre from "./SelectCentre";
import { setCurrentCentre } from "../store/centresSlice";

const TopBar = ({ onMenuClick }) => {
  const user = useSelector((state) => state.user);
  const currentCentre = useSelector((state) => state.centres.currentCentre);
  const centres = useSelector((state) => state.centres.centres || []); // Nécessaire pour SelectCentre
  const isAdmin = user?.role === "admin";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState({ commandes: 0, ardoises: 0 });
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [parametres, setParametres] = useState(null);

  const profileMenuRef = useRef(null);

  // Récupérer nom société + notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Paramètres société
        const paramRes = await Axios.get('/api/parametres');
        if (paramRes.data.success) {
          setParametres(paramRes.data.data);
        }

        // Notifications (commandes + ardoises)
        const [cmdRes, ardRes] = await Promise.all([
          Axios.get('/api/commande-online', { params: { statut: 'nouveau', limit: 1 } }),
          Axios.get('/api/clients', { params: { solde_actuel_gt: 0, limit: 1 } })
        ]);

        setNotifications({
          commandes: cmdRes.data.pagination?.total || 0,
          ardoises: ardRes.data.pagination?.total || 0
        });
      } catch (error) {
        console.error('Erreur chargement:', error);
      } finally {
        setLoadingNotif(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000); // Rafraîchit toutes les 2 min
    return () => clearInterval(interval);
  }, []);

  // Gestion clic extérieur (version corrigée et fiable)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    // Utiliser "click" au lieu de "mousedown" + capture: true pour éviter conflits
    document.addEventListener("click", handleClickOutside, { capture: true });
    return () => document.removeEventListener("click", handleClickOutside, { capture: true });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length >= 2
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const totalNotifications = notifications.commandes + notifications.ardoises;

  return (
    <header className="h-20 bg-gradient-to-r from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-zinc-950 dark:to-purple-950 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm backdrop-blur-sm relative z-50">
      {/* Gauche */}
      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition"
        >
          <Menu className="w-6 h-6 text-indigo-700 dark:text-indigo-300" />
        </button>

       
      </div>

      {/* Droite */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button
          onClick={() => navigate('/admin/commande')}
          className="relative p-2.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-xl transition group"
        >
          <Bell className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300" />
          {!loadingNotif && totalNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-white dark:border-zinc-950">
              {totalNotifications > 99 ? '99+' : totalNotifications}
            </span>
          )}
          {loadingNotif && (
            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-zinc-950">
              <Loader2 className="w-3 h-3 animate-spin" />
            </span>
          )}
          <div className="absolute top-full right-0 mt-2 hidden group-hover:block bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 p-3 text-sm whitespace-nowrap z-50">
            {notifications.commandes} nouvelles commandes • {notifications.ardoises} ardoises en attente
          </div>
        </button>

        {/* Profil */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation(); // ← Bloque la propagation vers document
              setShowProfileMenu(prev => !prev);
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition group"
          >
            <div className="hidden sm:block text-right">
              <span className="block text-sm font-semibold text-indigo-800 dark:text-indigo-200 group-hover:text-indigo-900 dark:group-hover:text-white">
                {user.name || "Utilisateur"}
              </span>
              <span className="block text-xs text-indigo-600 dark:text-indigo-400 capitalize">
                {user.role || ""}
              </span>
            </div>
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md ring-2 ring-indigo-400/40">
                {getInitials(user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-950"></div>
            </div>
          </button>

          {/* Menu Profil */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-indigo-200/50 dark:border-indigo-800/50 overflow-hidden animate-fadeIn z-[9999]">
              {/* Infos utilisateur */}
              <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-b border-indigo-100 dark:border-indigo-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-indigo-900 dark:text-indigo-100">
                      {user.name}
                    </p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-300">
                      {user.email}
                    </p>
                    {currentCentre && (
                      <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {currentCentre.nom}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Liens */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/admin/profile");
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  <User className="w-5 h-5" />
                  Mon profil
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 text-sm text-indigo-700 dark:text-indigo-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                >
                  <Settings className="w-5 h-5" />
                  Paramètres
                </button>
              </div>

              {/* Déconnexion */}
              <div className="border-t border-indigo-100 dark:border-indigo-800/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-6 py-3.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Animation fade-in
const style = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
`;

TopBar.GlobalStyle = () => <style>{style}</style>;

export default TopBar;