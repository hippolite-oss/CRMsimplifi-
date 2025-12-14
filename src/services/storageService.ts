import { Client, Opportunite, Contact } from '../types';

const STORAGE_KEYS = {
  CLIENTS: 'crm_clients',
  OPPORTUNITES: 'crm_opportunites',
  CONTACTS: 'crm_contacts',
};

// Service pour les clients
export const clientService = {
  getAll: (): Client[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Client | undefined => {
    const clients = clientService.getAll();
    return clients.find(c => c.id === id);
  },

  create: (client: Omit<Client, 'id' | 'dateCreation'>): Client => {
    const clients = clientService.getAll();
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
    };
    clients.push(newClient);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return newClient;
  },

  update: (id: string, updates: Partial<Client>): Client | null => {
    const clients = clientService.getAll();
    const index = clients.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    clients[index] = { ...clients[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return clients[index];
  },

  delete: (id: string): boolean => {
    const clients = clientService.getAll();
    const filtered = clients.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(filtered));
    return filtered.length < clients.length;
  },

  search: (query: string): Client[] => {
    const clients = clientService.getAll();
    const lowerQuery = query.toLowerCase();
    return clients.filter(
      c =>
        c.nom.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery) ||
        c.telephone.includes(query)
    );
  },
};

// Service pour les opportunités
export const opportuniteService = {
  getAll: (): Opportunite[] => {
    const data = localStorage.getItem(STORAGE_KEYS.OPPORTUNITES);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Opportunite | undefined => {
    const opportunites = opportuniteService.getAll();
    return opportunites.find(o => o.id === id);
  },

  getByClientId: (clientId: string): Opportunite[] => {
    const opportunites = opportuniteService.getAll();
    return opportunites.filter(o => o.clientId === clientId);
  },

  create: (opportunite: Omit<Opportunite, 'id' | 'dateCreation'>): Opportunite => {
    const opportunites = opportuniteService.getAll();
    const newOpportunite: Opportunite = {
      ...opportunite,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
    };
    opportunites.push(newOpportunite);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITES, JSON.stringify(opportunites));
    return newOpportunite;
  },

  update: (id: string, updates: Partial<Opportunite>): Opportunite | null => {
    const opportunites = opportuniteService.getAll();
    const index = opportunites.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    opportunites[index] = { ...opportunites[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITES, JSON.stringify(opportunites));
    return opportunites[index];
  },

  delete: (id: string): boolean => {
    const opportunites = opportuniteService.getAll();
    const filtered = opportunites.filter(o => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITES, JSON.stringify(filtered));
    return filtered.length < opportunites.length;
  },

  getByStatus: (status: Opportunite['statut']): Opportunite[] => {
    const opportunites = opportuniteService.getAll();
    return opportunites.filter(o => o.statut === status);
  },
};

// Service pour les contacts
export const contactService = {
  getAll: (): Contact[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  },

  getById: (id: string): Contact | undefined => {
    const contacts = contactService.getAll();
    return contacts.find(c => c.id === id);
  },

  getByClientId: (clientId: string): Contact[] => {
    const contacts = contactService.getAll();
    return contacts.filter(c => c.clientId === clientId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  create: (contact: Omit<Contact, 'id'>): Contact => {
    const contacts = contactService.getAll();
    const newContact: Contact = {
      ...contact,
      id: Date.now().toString(),
    };
    contacts.push(newContact);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    return newContact;
  },

  delete: (id: string): boolean => {
    const contacts = contactService.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(filtered));
    return filtered.length < contacts.length;
  },
};
