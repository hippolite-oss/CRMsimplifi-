import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Menu,
  X,
  Home,
  Briefcase,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  Moon,
  Sun,
  BarChart,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Nouveau contact ajouté', time: '2 min', read: false },
    { id: 2, text: 'Opportunité à suivre', time: '1h', read: false },
    { id: 3, text: 'Rapport mensuel disponible', time: '3h', read: true },
  ]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: LayoutDashboard,
      color: 'from-blue-500 to-cyan-500',
      description: 'Vue d\'ensemble'
    },
    { 
      name: 'Clients', 
      href: '/clients', 
      icon: Users,
      color: 'from-emerald-500 to-green-500',
      description: 'Gestion clients'
    },
    { 
      name: 'Opportunités', 
      href: '/opportunites', 
      icon: TrendingUp,
      color: 'from-violet-500 to-purple-500',
      description: 'Pipeline commercial'
    },
    { 
      name: 'Contacts', 
      href: '/contacts', 
      icon: MessageSquare,
      color: 'from-amber-500 to-orange-500',
      description: 'Historique'
    },
    { 
      name: 'Projets', 
      href: '/projets', 
      icon: Briefcase,
      color: 'from-rose-500 to-pink-500',
      description: 'Gestion projets'
    },
    { 
      name: 'Rapports', 
      href: '/rapports', 
      icon: BarChart,
      color: 'from-indigo-500 to-blue-500',
      description: 'Analytique'
    },
  ];

  const secondaryNavigation = [
    { name: 'Paramètres', href: '/parametres', icon: Settings },
    { name: 'Aide & Support', href: '/aide', icon: HelpCircle },
    { name: 'Documentation', href: '/docs', icon: FileText },
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    // Logique de déconnexion
    navigate('/login');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'dark bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50/30 text-gray-900'
    }`}>
      {/* Sidebar mobile avec animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              <div 
                className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" 
                onClick={() => setSidebarOpen(false)} 
              />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 flex w-80 flex-col shadow-2xl"
              >
                <div className={`flex flex-col flex-grow ${
                  darkMode 
                    ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
                    : 'bg-gradient-to-b from-white to-gray-50'
                } border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  {/* Header sidebar mobile */}
                  <div className="flex items-center justify-between px-6 py-5 border-b">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg"
                      >
                        <Zap className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                          CRM Pro
                        </h1>
                        <p className="text-xs text-gray-500">Version 2.0</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className={`p-2 rounded-lg ${
                        darkMode 
                          ? 'hover:bg-gray-800 text-gray-400' 
                          : 'hover:bg-gray-100 text-gray-500'
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Navigation principale */}
                  <nav className="flex-1 px-3 py-6 space-y-1">
                    <div className="px-3 mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Navigation principale
                      </span>
                    </div>
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                              active
                                ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                                : darkMode
                                ? 'hover:bg-gray-800/50 text-gray-300'
                                : 'hover:bg-white hover:shadow-md text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2.5 rounded-lg ${
                                active 
                                  ? 'bg-white/20' 
                                  : darkMode 
                                    ? 'bg-gray-800' 
                                    : 'bg-gray-100'
                              }`}>
                                <Icon className={`h-5 w-5 ${
                                  active ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="text-left">
                                <span className="font-medium">{item.name}</span>
                                <p className={`text-xs ${
                                  active ? 'text-white/80' : 'text-gray-500'
                                }`}>
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {active && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-2 w-2 rounded-full bg-white"
                              />
                            )}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  {/* Navigation secondaire */}
                  <div className="px-3 py-4 border-t">
                    <div className="space-y-1">
                      {secondaryNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                              darkMode
                                ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Mode sombre toggle */}
                    <div className="px-4 py-3 mt-4">
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors ${
                          darkMode
                            ? 'bg-gray-800 hover:bg-gray-700'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {darkMode ? (
                            <Sun className="h-5 w-5 text-amber-500" />
                          ) : (
                            <Moon className="h-5 w-5 text-indigo-600" />
                          )}
                          <span className="font-medium">
                            {darkMode ? 'Mode clair' : 'Mode sombre'}
                          </span>
                        </div>
                        <div className={`h-6 w-11 rounded-full relative transition-colors ${
                          darkMode ? 'bg-amber-500/30' : 'bg-indigo-500/30'
                        }`}>
                          <motion.div
                            className={`absolute top-1 h-4 w-4 rounded-full ${
                              darkMode ? 'bg-amber-500 right-1' : 'bg-indigo-600 left-1'
                            }`}
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar desktop améliorée */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col flex-grow ${
            darkMode 
              ? 'bg-gradient-to-b from-gray-900 to-gray-800' 
              : 'bg-gradient-to-b from-white via-white to-gray-50/90 backdrop-blur-sm'
          } border-r ${darkMode ? 'border-gray-700' : 'border-gray-200/80'} shadow-xl`}
        >
          {/* Logo et header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl shadow-lg"
              >
                <Zap className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                  CRM Pro
                </h1>
                <p className="text-xs text-gray-500">Version 2.0</p>
              </div>
            </div>
            <Sparkles className={`h-5 w-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>

          {/* Navigation principale */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            <div className="px-3 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Navigation
              </span>
            </div>
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                      active
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : darkMode
                        ? 'hover:bg-gray-800/50 text-gray-300'
                        : 'hover:bg-white hover:shadow-md text-gray-700 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg transition-colors ${
                        active 
                          ? 'bg-white/20' 
                          : darkMode 
                            ? 'bg-gray-800 group-hover:bg-gray-700' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon className={`h-5 w-5 transition-colors ${
                          active ? 'text-white' : darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <span className="font-medium">{item.name}</span>
                        <p className={`text-xs transition-colors ${
                          active ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {active ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-white"
                      />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Stats rapides */}
          <div className={`px-6 py-4 border-t ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Performance du jour
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">87%</span>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Navigation secondaire et utilisateur */}
          <div className="px-3 py-4 border-t">
            <div className="space-y-1">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      darkMode
                        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Profil utilisateur */}
            <div className="mt-6 px-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    Administrateur
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar améliorée */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`sticky top-0 z-40 flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 backdrop-blur-md ${
            darkMode
              ? 'bg-gray-900/90 border-b border-gray-800'
              : 'bg-white/90 border-b border-gray-200/80'
          }`}
        >
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-lg lg:hidden ${
                darkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Breadcrumb */}
            <div className="ml-4 flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-gray-400" />
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {navigation.find(nav => isActive(nav.href))?.name || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle mode sombre */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${
                darkMode 
                  ? 'hover:bg-gray-800 text-amber-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(false)}
                className={`p-2 rounded-lg relative ${
                  darkMode 
                    ? 'hover:bg-gray-800 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    {unreadNotifications}
                  </motion.span>
                )}
              </button>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-3 p-2 rounded-xl ${
                  darkMode 
                    ? 'hover:bg-gray-800' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                  userMenuOpen ? 'rotate-90' : ''
                }`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 ${
                      darkMode
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium">John Doe</p>
                      <p className="text-xs text-gray-500">john@exemple.com</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/profile');
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <User className="h-4 w-4" />
                        Mon profil
                      </button>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          navigate('/parametres');
                        }}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Settings className="h-4 w-4" />
                        Paramètres
                      </button>
                      <div className="border-t my-1" />
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-2 text-sm ${
                          darkMode
                            ? 'text-red-400 hover:bg-gray-700'
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        <LogOut className="h-4 w-4" />
                        Déconnexion
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <main className="py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;