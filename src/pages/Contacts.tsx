import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Phone, Mail, Calendar, MessageSquare, 
  Search, Filter, Users, Clock, TrendingUp, Eye,
  MoreVertical, Download, RefreshCw, ChevronRight,
  Sparkles, Target, AlertCircle, BarChart, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { contactService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { Contact, ContactType } from '../types';

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [clientFilter, setClientFilter] = useState<string>('Tous');
  const [typeFilter, setTypeFilter] = useState<string>('Tous');
  const [dateFilter, setDateFilter] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; contact: Contact | null }>({
    isOpen: false,
    contact: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const navigate = useNavigate();

  const clients = clientService.getAll();

  useEffect(() => {
    loadContacts();
    // Simuler un chargement
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    filterContacts();
  }, [clientFilter, typeFilter, dateFilter, searchQuery, contacts]);

  const loadContacts = () => {
    const allContacts = contactService.getAll();
    setContacts(allContacts);
    setFilteredContacts(allContacts);
  };

  const filterContacts = () => {
    let filtered = contacts;

    // Filtre par client
    if (clientFilter !== 'Tous') {
      filtered = filtered.filter(c => c.clientId === clientFilter);
    }

    // Filtre par type
    if (typeFilter !== 'Tous') {
      filtered = filtered.filter(c => c.type === typeFilter);
    }

    // Filtre par date
    if (dateFilter !== 'Tous') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateFilter) {
        case 'Aujourd\'hui':
          filtered = filtered.filter(c => {
            const contactDate = new Date(c.date);
            return contactDate >= today;
          });
          break;
        case 'Cette semaine':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          filtered = filtered.filter(c => new Date(c.date) >= weekAgo);
          break;
        case 'Ce mois':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          filtered = filtered.filter(c => new Date(c.date) >= monthAgo);
          break;
      }
    }

    // Recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(contact => {
        const client = clientService.getById(contact.clientId);
        return (
          contact.description.toLowerCase().includes(query) ||
          contact.type.toLowerCase().includes(query) ||
          (contact.sujet?.toLowerCase().includes(query) || false) ||
          (client?.nom.toLowerCase().includes(query) || false) ||
          (client?.entreprise?.toLowerCase().includes(query) || false)
        );
      });
    }

    // Trier par date décroissante
    filtered = filtered.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredContacts(filtered);
  };

  const handleDelete = () => {
    if (deleteModal.contact) {
      const success = contactService.delete(deleteModal.contact.id);
      if (success) {
        setAlert({ 
          type: 'success', 
          message: `Contact du ${formatDateShort(deleteModal.contact.date)} supprimé avec succès !` 
        });
        loadContacts();
        
        // Auto-dismiss alert
        setTimeout(() => setAlert(null), 3000);
      } else {
        setAlert({ 
          type: 'error', 
          message: 'Erreur lors de la suppression du contact' 
        });
      }
      setDeleteModal({ isOpen: false, contact: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'À l\'instant';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 168) {
      return `Il y a ${Math.floor(diffInHours / 24)}j`;
    } else {
      return formatDateShort(dateString);
    }
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case 'Appel':
        return Phone;
      case 'Email':
        return Mail;
      case 'Réunion':
        return Users;
      case 'Visite':
        return Target;
      case 'Présentation':
        return TrendingUp;
      default:
        return MessageSquare;
    }
  };

  const getContactColor = (type: ContactType) => {
    switch (type) {
      case 'Appel':
        return { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-100', text: 'text-blue-800' };
      case 'Email':
        return { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-100', text: 'text-purple-800' };
      case 'Réunion':
        return { bg: 'from-green-500 to-emerald-600', light: 'bg-green-100', text: 'text-green-800' };
      case 'Visite':
        return { bg: 'from-orange-500 to-amber-600', light: 'bg-orange-100', text: 'text-orange-800' };
      case 'Présentation':
        return { bg: 'from-indigo-500 to-blue-600', light: 'bg-indigo-100', text: 'text-indigo-800' };
      default:
        return { bg: 'from-gray-500 to-gray-600', light: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  const getTypeOptions = () => [
    'Tous', 'Appel', 'Email', 'Réunion', 'Visite', 'Présentation'
  ];

  const getDateOptions = () => [
    'Tous', 'Aujourd\'hui', 'Cette semaine', 'Ce mois'
  ];

  const getStats = () => {
    const total = contacts.length;
    const calls = contacts.filter(c => c.type === 'Appel').length;
    const emails = contacts.filter(c => c.type === 'Email').length;
    const meetings = contacts.filter(c => c.type === 'Réunion').length;
    
    return { total, calls, emails, meetings };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/20 p-4 md:p-6"
    >
      {/* Header avec animations */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
              >
                <MessageSquare className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-indigo-700 bg-clip-text text-transparent">
                  Historique de contact
                </h1>
                <p className="text-gray-600 mt-1">
                  Consultez l'historique des échanges avec vos clients
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-3 mt-4"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-gray-200">
                <Activity className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                  {stats.total} contacts
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-100 rounded-lg border border-blue-200">
                <Phone className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {stats.calls} appels
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-100 rounded-lg border border-purple-200">
                <Mail className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {stats.emails} emails
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border border-green-200">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {stats.meetings} réunions
                </span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link to="/contacts/nouveau">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau contact
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Alertes animées */}
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="mb-6"
          >
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
              animated={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panneau de contrôle amélioré */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un contact par description, type, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none min-w-[200px]"
            >
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value="Tous">Tous les clients</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.entreprise ? `(${client.entreprise})` : ''}
                  </option>
                ))}
              </select>
              <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none"
            >
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {getTypeOptions().map(type => (
                  <option key={type} value={type}>
                    {type === 'Tous' ? 'Tous les types' : type}
                  </option>
                ))}
              </select>
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative flex-1 lg:flex-none"
            >
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {getDateOptions().map(date => (
                  <option key={date} value={date}>
                    {date === 'Tous' ? 'Toutes les dates' : date}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </motion.div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={loadContacts}
                className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                title="Actualiser"
              >
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </motion.button>
              
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 border-r border-gray-300' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  Grille
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vue Liste */}
      {viewMode === 'list' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {loading ? (
            // Squelette de chargement
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length === 0 ? (
            // État vide
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-12 text-center"
            >
              <div className="mb-4 inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl">
                <MessageSquare className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery || clientFilter !== 'Tous' || typeFilter !== 'Tous' ? 'Aucun contact trouvé' : 'Aucun contact'}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery || clientFilter !== 'Tous' || typeFilter !== 'Tous'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Commencez par enregistrer votre premier contact'}
              </p>
              <Link to="/contacts/nouveau">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un contact
                </Button>
              </Link>
            </motion.div>
          ) : (
            // Liste des contacts
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {filteredContacts.map((contact, index) => {
                  const client = clientService.getById(contact.clientId);
                  const Icon = getContactIcon(contact.type);
                  const colors = getContactColor(contact.type);
                  
                  return (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(99, 102, 241, 0.03)',
                        transition: { duration: 0.2 }
                      }}
                      className={`p-6 cursor-pointer transition-all duration-200 ${
                        selectedContact === contact.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => setSelectedContact(selectedContact === contact.id ? null : contact.id)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icône du type */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md flex-shrink-0`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </motion.div>
                        
                        {/* Contenu principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-700">
                                  {contact.type}
                                </h3>
                                {contact.priorite && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    contact.priorite === 'Haute' ? 'bg-red-100 text-red-800' :
                                    contact.priorite === 'Moyenne' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {contact.priorite}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">{client?.nom || 'Client inconnu'}</span>
                                {client?.entreprise && (
                                  <>
                                    <span className="text-gray-300">•</span>
                                    <span>{client.entreprise}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right flex-shrink-0">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{formatRelativeTime(contact.date)}</span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {formatDateShort(contact.date)}
                              </div>
                            </div>
                          </div>
                          
                          {contact.sujet && (
                            <p className="text-gray-800 font-medium mb-2">
                              {contact.sujet}
                            </p>
                          )}
                          
                          <p className="text-gray-600 line-clamp-2 mb-3">
                            {contact.description}
                          </p>
                          
                          {/* Métadonnées */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {contact.duree && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{contact.duree} min</span>
                              </div>
                            )}
                            {contact.resultat && (
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                contact.resultat === 'Positif' ? 'bg-green-100 text-green-800' :
                                contact.resultat === 'Négatif' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {contact.resultat === 'Positif' ? '✓ Positif' :
                                 contact.resultat === 'Négatif' ? '✗ Négatif' : '○ Neutre'}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteModal({ isOpen: true, contact });
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ x: 5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/contacts/${contact.id}/edit`);
                            }}
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                            title="Voir détails"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
          
          {/* Pied de liste */}
          {filteredContacts.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Affichage de <span className="font-semibold">{filteredContacts.length}</span> contacts
                </p>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    Dernière mise à jour : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        // Vue Grille
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            // Squelette de grille
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))
          ) : filteredContacts.map((contact, index) => {
            const client = clientService.getById(contact.clientId);
            const Icon = getContactIcon(contact.type);
            const colors = getContactColor(contact.type);
            
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
              >
                <div className="p-6">
                  {/* En-tête */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} shadow-md`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-bold text-gray-900">{contact.type}</h3>
                        <p className="text-sm text-gray-500">
                          avec {client?.nom || 'Client inconnu'}
                        </p>
                      </div>
                    </div>
                    {contact.priorite && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.priorite === 'Haute' ? 'bg-red-100 text-red-800' :
                        contact.priorite === 'Moyenne' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.priorite}
                      </span>
                    )}
                  </div>
                  
                  {/* Contenu */}
                  <div className="space-y-3 mb-4">
                    {contact.sujet && (
                      <p className="font-medium text-gray-800 line-clamp-1">
                        {contact.sujet}
                      </p>
                    )}
                    
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {contact.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatRelativeTime(contact.date)}</span>
                      </div>
                      {contact.duree && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{contact.duree} min</span>
                        </div>
                      )}
                    </div>
                    
                    {contact.resultat && (
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        contact.resultat === 'Positif' ? 'bg-green-100 text-green-800' :
                        contact.resultat === 'Négatif' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.resultat === 'Positif' ? '✓ Positif' :
                         contact.resultat === 'Négatif' ? '✗ Négatif' : '○ Neutre'}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteModal({ isOpen: true, contact })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => navigate(`/contacts/${contact.id}/edit`)}
                      className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                      Voir détails
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modale de suppression améliorée */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, contact: null })}
        title="Confirmer la suppression"
        onConfirm={handleDelete}
        confirmLabel="Supprimer définitivement"
        confirmVariant="danger"
        animated={true}
      >
        <div className="text-center py-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Supprimer ce contact ?
          </h3>
          <p className="text-gray-600 mb-4">
            Cette action est irréversible. Le contact sera définitivement supprimé de l'historique.
          </p>
          {deleteModal.contact && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Date :</span> {formatDate(deleteModal.contact.date)}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Type :</span> {deleteModal.contact.type}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Bouton flottant pour mobile */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 md:hidden"
      >
        <Link to="/contacts/nouveau">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-xl"
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Contacts;