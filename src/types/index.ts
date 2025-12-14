export type ClientStatus = 'Actif' | 'Inactif';
export type OpportuniteStatus = 'Nouveau' | 'En cours' | 'Gagné' | 'Perdu';
export type ContactType = 'Appel' | 'Email' | 'Réunion';

export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
  statut: ClientStatus;
  dateCreation: string;
}

export interface Opportunite {
  id: string;
  titre: string;
  clientId: string;
  montant: number;
  statut: OpportuniteStatus;
  dateCreation: string;
  dateClotureEstimee: string;
}

export interface Contact {
  id: string;
  clientId: string;
  type: ContactType;
  date: string;
  description: string;
}

export interface Statistiques {
  totalClients: number;
  clientsActifs: number;
  totalOpportunites: number;
  opportunitesGagnees: number;
  montantTotal: number;
  contactsRecents: number;
}
