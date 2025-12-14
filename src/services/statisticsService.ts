import { Statistiques } from '../types';
import { clientService } from './storageService';
import { opportuniteService } from './storageService';
import { contactService } from './storageService';

export const statisticsService = {
  getStatistics: (): Statistiques => {
    const clients = clientService.getAll();
    const opportunites = opportuniteService.getAll();
    const contacts = contactService.getAll();

    const clientsActifs = clients.filter(c => c.statut === 'Actif').length;
    const opportunitesGagnees = opportunites.filter(o => o.statut === 'Gagné').length;
    const montantTotal = opportunites
      .filter(o => o.statut === 'Gagné')
      .reduce((sum, o) => sum + o.montant, 0);

    // Contacts des 7 derniers jours
    const septJoursAgo = new Date();
    septJoursAgo.setDate(septJoursAgo.getDate() - 7);
    const contactsRecents = contacts.filter(c => 
      new Date(c.date) >= septJoursAgo
    ).length;

    return {
      totalClients: clients.length,
      clientsActifs,
      totalOpportunites: opportunites.length,
      opportunitesGagnees,
      montantTotal,
      contactsRecents,
    };
  },
};
