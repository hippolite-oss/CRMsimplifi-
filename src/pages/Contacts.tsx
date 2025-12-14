import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Phone, Mail, Calendar } from 'lucide-react';
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
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; contact: Contact | null }>({
    isOpen: false,
    contact: null,
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  const clients = clientService.getAll();

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [clientFilter, contacts]);

  const loadContacts = () => {
    const allContacts = contactService.getAll();
    setContacts(allContacts);
  };

  const filterContacts = () => {
    let filtered = contacts;

    if (clientFilter !== 'Tous') {
      filtered = filtered.filter(c => c.clientId === clientFilter);
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
        setAlert({ type: 'success', message: 'Contact supprimé avec succès' });
        loadContacts();
      } else {
        setAlert({ type: 'error', message: 'Erreur lors de la suppression' });
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

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case 'Appel':
        return Phone;
      case 'Email':
        return Mail;
      case 'Réunion':
        return Calendar;
      default:
        return Mail;
    }
  };

  const getContactColor = (type: ContactType) => {
    switch (type) {
      case 'Appel':
        return 'bg-blue-100 text-blue-800';
      case 'Email':
        return 'bg-green-100 text-green-800';
      case 'Réunion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historique de contact</h1>
          <p className="mt-2 text-gray-600">Consultez l'historique des échanges avec vos clients</p>
        </div>
        <Link to="/contacts/nouveau">
          <Button>
            <Plus className="h-5 w-5 mr-2 inline" />
            Nouveau contact
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

      {/* Filtre par client */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par client :
        </label>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="Tous">Tous les clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nom}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des contacts */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Aucun contact trouvé</p>
            <Link to="/contacts/nouveau" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Créer votre premier contact
            </Link>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const client = clientService.getById(contact.clientId);
            const Icon = getContactIcon(contact.type);
            
            return (
              <div key={contact.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg ${getContactColor(contact.type)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{contact.type}</h3>
                        <p className="text-sm text-gray-500">
                          avec <span className="font-medium">{client?.nom || 'Client supprimé'}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-3">{contact.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{formatDate(contact.date)}</p>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, contact })}
                    className="text-red-600 hover:text-red-900 ml-4"
                    title="Supprimer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, contact: null })}
        title="Supprimer le contact"
        onConfirm={handleDelete}
        confirmLabel="Supprimer"
        confirmVariant="danger"
      >
        <p className="text-gray-700">
          Êtes-vous sûr de vouloir supprimer ce contact ?
          Cette action est irréversible.
        </p>
      </Modal>
    </div>
  );
};

export default Contacts;
