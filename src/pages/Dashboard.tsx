import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, TrendingUp, DollarSign, MessageSquare, Plus, 
  ChevronRight, Activity, Target, Award, Sparkles,
  Calendar, Mail, Phone, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { statisticsService } from '../services/statisticsService';
import { Statistiques } from '../types';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState<Statistiques>({
    totalClients: 0,
    clientsActifs: 0,
    totalOpportunites: 0,
    opportunitesGagnees: 0,
    montantTotal: 0,
    contactsRecents: 0,
  });

  const [animatedStats, setAnimatedStats] = useState(stats);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      // Simulation d'un délai pour l'animation de chargement
      await new Promise(resolve => setTimeout(resolve, 500));
      const statistics = statisticsService.getStatistics();
      setStats(statistics);
      setLoading(false);
      
      // Animation progressive des valeurs
      Object.keys(statistics).forEach((key, index) => {
        setTimeout(() => {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: statistics[key as keyof Statistiques]
          }));
        }, index * 150);
      });
    };

    loadStats();
    const interval = setInterval(loadStats, 10000); // Réduit la fréquence pour moins de flash
    return () => clearInterval(interval);
  }, []);

  const opportunitesRecentes = opportuniteService.getAll()
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  const clientsRecents = clientService.getAll()
    .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getProgressPercentage = () => {
    return stats.totalOpportunites > 0 
      ? Math.round((stats.opportunitesGagnees / stats.totalOpportunites) * 100)
      : 0;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 md:p-6"
    >
      {/* Header avec animation */}
      <motion.div
        ref={headerRef}
        initial={{ y: -20, opacity: 0 }}
        animate={isHeaderInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl"
            >
              <Activity className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <p className="text-gray-600">Vue d'ensemble en temps réel de votre activité</p>
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block"
          >
            <div className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600">Mise à jour en temps réel</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Statistiques avec animations */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          {
            title: "Total Clients",
            value: animatedStats.totalClients,
            icon: Users,
            color: "primary",
            change: "+12%",
            trend: "up"
          },
          {
            title: "Clients Actifs",
            value: animatedStats.clientsActifs,
            icon: Users,
            color: "green",
            change: "+5%",
            trend: "up"
          },
          {
            title: "Opportunités",
            value: animatedStats.totalOpportunites,
            icon: TrendingUp,
            color: "blue",
            change: "+23%",
            trend: "up"
          },
          {
            title: "Montant Total",
            value: formatCurrency(animatedStats.montantTotal),
            icon: DollarSign,
            color: "purple",
            change: "+18%",
            trend: "up"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.2 }
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color as any}
                loading={loading}
                trend={stat.trend as "up" | "down"}
                change={stat.change}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barre de progression pour les opportunités */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 bg-gradient-to-r from-blue-500 to-primary-600 rounded-xl p-6 text-white shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6" />
            <h3 className="text-xl font-semibold">Performance des opportunités</h3>
          </div>
          <Target className="h-5 w-5" />
        </div>
        <div className="mb-2 flex justify-between text-sm">
          <span>Taux de conversion</span>
          <span className="font-bold">{getProgressPercentage()}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-white rounded-full"
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{stats.opportunitesGagnees}</p>
            <p className="text-sm opacity-90">Gagnées</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalOpportunites - stats.opportunitesGagnees}</p>
            <p className="text-sm opacity-90">En cours</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{stats.totalOpportunites}</p>
            <p className="text-sm opacity-90">Total</p>
          </div>
        </div>
      </motion.div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Opportunités récentes */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-white to-blue-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Opportunités récentes</h2>
                <p className="text-sm text-gray-500">{opportunitesRecentes.length} opportunités</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/opportunites/nouvelle"
                className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Nouvelle
              </Link>
            </motion.div>
          </div>
          <div className="p-6">
            {opportunitesRecentes.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">Aucune opportunité</div>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunitesRecentes.map((opp, index) => {
                  const client = clientService.getById(opp.clientId);
                  return (
                    <motion.div
                      key={opp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-50 transition-colors">
                              <Target className="h-4 w-4 text-gray-600 group-hover:text-primary-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
                                {opp.titre}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Users className="h-3 w-3 text-gray-400" />
                                <p className="text-sm text-gray-500">{client?.nom || 'Client inconnu'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <motion.p 
                            className="font-bold text-lg text-gray-900"
                            whileHover={{ scale: 1.1 }}
                          >
                            {formatCurrency(opp.montant)}
                          </motion.p>
                          <motion.span 
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mt-2 ${
                              opp.statut === 'Gagné' 
                                ? 'bg-green-100 text-green-800 shadow-sm' 
                                : opp.statut === 'Perdu' 
                                ? 'bg-red-100 text-red-800 shadow-sm'
                                : opp.statut === 'En cours' 
                                ? 'bg-blue-100 text-blue-800 shadow-sm'
                                : 'bg-gray-100 text-gray-800 shadow-sm'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {opp.statut}
                          </motion.span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDate(opp.dateCreation)}
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Clients récents */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-white to-green-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Clients récents</h2>
                <p className="text-sm text-gray-500">{clientsRecents.length} clients</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/clients/nouveau"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Nouveau
              </Link>
            </motion.div>
          </div>
          <div className="p-6">
            {clientsRecents.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">Aucun client</div>
              </div>
            ) : (
              <div className="space-y-4">
                {clientsRecents.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: -5 }}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {client.nom.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              {client.nom}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                            {client.telephone && (
                              <div className="flex items-center gap-2 mt-1">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <p className="text-sm text-gray-600">{client.telephone}</p>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <motion.span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                client.statut === 'Actif'
                                  ? 'bg-green-100 text-green-800 shadow-sm'
                                  : 'bg-gray-100 text-gray-800 shadow-sm'
                              }`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {client.statut === 'Actif' ? (
                                <>
                                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                  Actif
                                </>
                              ) : (
                                'Inactif'
                              )}
                            </motion.span>
                            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(client.dateCreation)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Pied de page avec indicateur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
          <Activity className="h-4 w-4 animate-pulse text-primary-600" />
          Données mises à jour en temps réel
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;