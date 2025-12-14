import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Filter, Edit, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { opportuniteService } from '../services/storageService';
import { clientService } from '../services/storageService';
import { Opportunite, OpportuniteStatus } from '../types';

const Opportunites = () => {
  const [opportunites, setOpportunites] = useState<Opportunite[]>([]);
  const [filteredOpportunites, setFilteredOpportunites] = useState<Opportunite[]>([]);
  const [statusFilter, setStatusFilter] = useState<OpportuniteStatus | 'Tous'>('Tous');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; opportunite: Opportunite | null }>({
    isOpen: false,
    opportunite: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOpportunites();
  }, []);

  useEffect(() => {
    filterOpportunites();
  }, [statusFilter, opportunites]);

  const loadOpportunites = () => {
    const allOpportunites = opportuniteService.getAll();
    setOpportunites(allOpportunites);
  };

  const filterOpportunites = () => {
    let filtered = opportunites;

    if (statusFilter !== 'Tous') {
      filtered = filtered.filter(o => o.statut === statusFilter);
    }

    setFilteredOpportunites(filtered);
  };

  const handleDelete = () => {
    if (deleteModal.opportunite) {
      const success = opportuniteService.delete(deleteModal.opportunite.id);
      if (success) {
        setAlert({ type: 'success', message: 'Opportunité supprimée avec succès' });
        loadOpportunites();
      } else {
        setAlert({ type: 'error', message: 'Erreur lors de la suppression' });
      }
      setDeleteModal({ isOpen: false, opportunite: null });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: OpportuniteStatus) => {
    switch (status) {
      case 'Gagné':
        return 'bg-green-100 text-green-800';
      case 'Perdu':
        return 'bg-red-100 text-red-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Opportunités</h1>
          <p className="mt-2 text-gray-600">Gérez vos opportunités commerciales</p>
        </div>
        <Link to="/opportunites/nouvelle">
          <Button>
            <Plus className="h-5 w-5 mr-2 inline" />
            Nouvelle opportunité
          </Button>
        </Link>
      </div>

      {alert && (
        <div className="mb-4">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Filtre par statut */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <label className="text-sm font-medium text-gray-700">Filtrer par statut :</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OpportuniteStatus | 'Tous')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Tous">Tous</option>
            <option value="Nouveau">Nouveau</option>
            <option value="En cours">En cours</option>
            <option value="Gagné">Gagné</option>
            <option value="Perdu">Perdu</option>
          </select>
        </div>
      </div>

      {/* Liste des opportunités */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOpportunites.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">Aucune opportunité trouvée</p>
            <Link to="/opportunites/nouvelle" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Créer votre première opportunité
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de clôture estimée
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOpportunites.map((opportunite) => {
                  const client = clientService.getById(opportunite.clientId);
                  return (
                    <tr key={opportunite.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{opportunite.titre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{client?.nom || 'Client supprimé'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(opportunite.montant)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(opportunite.statut)}`}>
                          {opportunite.statut}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(opportunite.dateCreation)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(opportunite.dateClotureEstimee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/opportunites/${opportunite.id}/edit`)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, opportunite })}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, opportunite: null })}
        title="Supprimer l'opportunité"
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
      >
        <p className="text-gray-700">
          Êtes-vous sûr de vouloir supprimer l'opportunité <strong>{deleteModal.opportunite?.titre}</strong> ?
          Cette action est irréversible.
        </p>
      </Modal>
    </div>
  );
};

export default Opportunites;
