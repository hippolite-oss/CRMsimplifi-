import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, 
  Activity, Save, Loader2, Sparkles, Check,
  Building, Globe, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { clientService } from '../services/storageService';
import { Client, ClientStatus } from '../types';

const ClientForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    entreprise: '',
    siteWeb: '',
    statut: 'Actif' as ClientStatus,
    dateCreation: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const client = clientService.getById(id);
      if (client) {
        setFormData({
          nom: client.nom,
          email: client.email,
          telephone: client.telephone,
          adresse: client.adresse,
          entreprise: client.entreprise || '',
          siteWeb: client.siteWeb || '',
          statut: client.statut,
          dateCreation: client.dateCreation || new Date().toISOString().split('T')[0],
        });
      } else {
        navigate('/clients');
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    }

    if (formData.siteWeb && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.siteWeb)) {
      newErrors.siteWeb = 'URL invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      // Simulation d'un délai pour l'animation
      await new Promise(resolve => setTimeout(resolve, 800));

      if (isEdit && id) {
        const updated = clientService.update(id, formData);
        if (updated) {
          setSuccess(true);
          setAlert({ 
            type: 'success', 
            message: 'Client modifié avec succès !' 
          });
          
          // Animation de succès avant redirection
          setTimeout(() => {
            navigate('/clients');
          }, 1500);
        } else {
          setAlert({ 
            type: 'error', 
            message: 'Erreur lors de la modification du client' 
          });
        }
      } else {
        clientService.create(formData);
        setSuccess(true);
        setAlert({ 
          type: 'success', 
          message: 'Client créé avec succès !' 
        });
        
        // Animation de succès avant redirection
        setTimeout(() => {
          navigate('/clients');
        }, 1500);
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'Une erreur inattendue est survenue' 
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Supprime l'erreur quand l'utilisateur commence à taper
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6"
    >
      {/* Header amélioré */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/clients')}
          className="group flex items-center text-gray-600 hover:text-primary-700 mb-6 transition-colors"
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 mr-3 group-hover:border-primary-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
          <span className="font-medium group-hover:text-primary-700 transition-colors">
            Retour aux clients
          </span>
        </motion.button>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 shadow-lg"
              >
                <User className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-primary-700 bg-clip-text text-transparent">
                  {isEdit ? 'Modifier le client' : 'Nouveau client'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isEdit 
                    ? 'Mettez à jour les informations de votre client' 
                    : 'Ajoutez un nouveau client à votre CRM'}
                </p>
              </div>
            </div>
          </div>
          
          {isEdit && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-primary-50 rounded-lg border border-primary-200"
            >
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                Édition en cours
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Informations du client
                </h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-sm text-gray-500">Tous les champs marqués * sont obligatoires</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Grille responsive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      Nom / Raison sociale <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.nom 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Ex: Jean Dupont"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.nom && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.nom}
                    </motion.p>
                  )}
                </motion.div>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.email 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="exemple@entreprise.fr"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.email}
                    </motion.p>
                  )}
                </motion.div>

                {/* Téléphone */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Téléphone <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="telephone"
                      value={formData.telephone}
                      onChange={(e) => handleInputChange('telephone', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.telephone 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="+33 1 23 45 67 89"
                    />
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.telephone && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.telephone}
                    </motion.p>
                  )}
                </motion.div>

                {/* Entreprise */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label htmlFor="entreprise" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      Entreprise
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="entreprise"
                      value={formData.entreprise}
                      onChange={(e) => handleInputChange('entreprise', e.target.value)}
                      className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nom de l'entreprise"
                    />
                    <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              </div>

              {/* Adresse (pleine largeur) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="relative"
              >
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    Adresse complète
                  </div>
                </label>
                <div className="relative">
                  <textarea
                    id="adresse"
                    value={formData.adresse}
                    onChange={(e) => handleInputChange('adresse', e.target.value)}
                    rows={3}
                    className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Adresse postale complète..."
                  />
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                </div>
              </motion.div>

              {/* Deuxième ligne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Web */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="relative"
                >
                  <label htmlFor="siteWeb" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      Site Web
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      id="siteWeb"
                      value={formData.siteWeb}
                      onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                      className={`w-full px-4 pl-11 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 ${
                        errors.siteWeb 
                          ? 'border-red-500 bg-red-50/50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="https://www.exemple.com"
                    />
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.siteWeb && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600 flex items-center gap-1"
                    >
                      ⚠️ {errors.siteWeb}
                    </motion.p>
                  )}
                </motion.div>

                {/* Statut */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      Statut <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      id="statut"
                      value={formData.statut}
                      onChange={(e) => handleInputChange('statut', e.target.value)}
                      className="w-full px-4 pl-11 py-3 border border-gray-300 rounded-xl hover:border-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Inactif">Inactif</option>
                    </select>
                    <Activity className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Boutons d'action */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/clients')}
                    className="w-full sm:w-auto"
                    disabled={loading}
                  >
                    Annuler
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="relative overflow-hidden w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Enregistrement...
                      </div>
                    ) : success ? (
                      <div className="flex items-center justify-center">
                        <Check className="h-5 w-5 mr-2" />
                        Succès !
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Save className="h-5 w-5 mr-2" />
                        {isEdit ? 'Mettre à jour' : 'Créer le client'}
                      </div>
                    )}
                    
                    {/* Effet de progression */}
                    {isSubmitting && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-400 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* Panneau latéral */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Statut du client */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Statut du client
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Statut actuel</span>
                <motion.span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.statut === 'Actif'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {formData.statut}
                </motion.span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Date de création</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(formData.dateCreation).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Conseils */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-gradient-to-br from-primary-50 to-blue-100 rounded-2xl shadow-lg border border-primary-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-primary-900">Conseils</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Remplissez tous les champs obligatoires (*)',
                'Vérifiez la validité de l\'email',
                'Un téléphone correct permet un suivi optimal',
                'Le statut "Actif" permet de suivre les opportunités'
              ].map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                  <span className="text-primary-800">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Prévisualisation */}
          {formData.nom && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Prévisualisation</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {formData.nom.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{formData.nom}</p>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                  </div>
                </div>
                {formData.entreprise && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Entreprise :</span> {formData.entreprise}
                  </div>
                )}
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Téléphone :</span> {formData.telephone}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ClientForm;