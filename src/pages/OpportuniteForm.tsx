import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { Opportunite, OpportuniteStatus } from '../types';

const OpportuniteForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    titre: '',
    clientId: '',
    montant: '',
    statut: 'Nouveau' as OpportuniteStatus,
    dateClotureEstimee: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState(clientService.getAll());

  useEffect(() => {
    if (isEdit && id) {
      const opportunite = opportuniteService.getById(id);
      if (opportunite) {
        setFormData({
          titre: opportunite.titre,
          clientId: opportunite.clientId,
          montant: opportunite.montant.toString(),
          statut: opportunite.statut,
          dateClotureEstimee: opportunite.dateClotureEstimee.split('T')[0],
        });
      } else {
        navigate('/opportunites');
      }
    }
  }, [id, isEdit, navigate]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Le client est requis';
    }

    if (!formData.montant.trim()) {
      newErrors.montant = 'Le montant est requis';
    } else if (isNaN(Number(formData.montant)) || Number(formData.montant) <= 0) {
      newErrors.montant = 'Le montant doit être un nombre positif';
    }

    if (!formData.dateClotureEstimee) {
      newErrors.dateClotureEstimee = 'La date de clôture estimée est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      if (isEdit && id) {
        const updated = opportuniteService.update(id, {
          ...formData,
          montant: Number(formData.montant),
        });
        if (updated) {
          setAlert({ type: 'success', message: 'Opportunité modifiée avec succès' });
          setTimeout(() => navigate('/opportunites'), 1500);
        } else {
          setAlert({ type: 'error', message: 'Erreur lors de la modification' });
        }
      } else {
        opportuniteService.create({
          ...formData,
          montant: Number(formData.montant),
          dateClotureEstimee: new Date(formData.dateClotureEstimee).toISOString(),
        });
        setAlert({ type: 'success', message: 'Opportunité créée avec succès' });
        setTimeout(() => navigate('/opportunites'), 1500);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/opportunites')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Modifier l\'opportunité' : 'Nouvelle opportunité'}
        </h1>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titre"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.titre ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.titre && <p className="mt-1 text-sm text-red-600">{errors.titre}</p>}
          </div>

          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              id="clientId"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.clientId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un client</option>
              {clients.filter(c => c.statut === 'Actif').map((client) => (
                <option key={client.id} value={client.id}>
                  {client.nom}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
          </div>

          <div>
            <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-2">
              Montant estimé (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="montant"
              step="0.01"
              min="0"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.montant ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.montant && <p className="mt-1 text-sm text-red-600">{errors.montant}</p>}
          </div>

          <div>
            <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-2">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              id="statut"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value as OpportuniteStatus })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="Nouveau">Nouveau</option>
              <option value="En cours">En cours</option>
              <option value="Gagné">Gagné</option>
              <option value="Perdu">Perdu</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateClotureEstimee" className="block text-sm font-medium text-gray-700 mb-2">
              Date de clôture estimée <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateClotureEstimee"
              value={formData.dateClotureEstimee}
              onChange={(e) => setFormData({ ...formData, dateClotureEstimee: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.dateClotureEstimee ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dateClotureEstimee && <p className="mt-1 text-sm text-red-600">{errors.dateClotureEstimee}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/opportunites')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportuniteForm;
