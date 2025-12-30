import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Calendar, Filter, Printer, Download, Eye, DollarSign,
    User, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight,
    CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';

const SalesHistory = () => {
    // États principaux
    const [search, setSearch] = useState('');
    const [ventes, setVentes] = useState([]);
    const [filterDate, setFilterDate] = useState('tous');
    const [filterStatut, setFilterStatut] = useState('tous');
    const [filterPaiement, setFilterPaiement] = useState('tous');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [selectedVente, setSelectedVente] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalVentes: 0,
        totalCA: 0,
        moyennePanier: 0,
        meilleurJour: { date: '', montant: 0 }
    });

    // Données mockées pour les ventes
    const ventesMock = [
        {
            id: 'VENT-2024-00123',
            date: '2024-01-15 14:30',
            client: { nom: "Dupont", prenom: "Jean", telephone: "+229 12 34 56 78" },
            articles: [
                { nom: "Ordinateur Portable", quantite: 1, prix: 899900 },
                { nom: "Souris", quantite: 1, prix: 15000 }
            ],
            total: 914900,
            paiement: 'especes',
            statut: 'complete',
            vendeur: 'Admin',
            transport: 0,
            remise: 0
        },
        {
            id: 'VENT-2024-00122',
            date: '2024-01-15 11:15',
            client: { nom: "Martin", prenom: "Marie", telephone: "+229 23 45 67 89" },
            articles: [
                { nom: "Smartphone Android", quantite: 1, prix: 349900 },
                { nom: "Écouteurs Bluetooth", quantite: 1, prix: 79900 },
                { nom: "Coque", quantite: 1, prix: 10000 }
            ],
            total: 439800,
            paiement: 'mobile_money',
            statut: 'complete',
            vendeur: 'Admin',
            transport: 5000,
            remise: 10000
        },
        {
            id: 'VENT-2024-00121',
            date: '2024-01-14 16:45',
            client: { nom: "Bernard", prenom: "Pierre", telephone: "+229 34 56 78 90" },
            articles: [
                { nom: "Tablette Android", quantite: 1, prix: 449900 },
                { nom: "Clavier", quantite: 1, prix: 25000 }
            ],
            total: 474900,
            paiement: 'carte',
            statut: 'annule',
            vendeur: 'Admin',
            transport: 0,
            remise: 0
        },
        {
            id: 'VENT-2024-00120',
            date: '2024-01-14 10:20',
            client: null,
            articles: [
                { nom: "Enceinte Portable", quantite: 2, prix: 129900 },
                { nom: "Câble USB", quantite: 3, prix: 5000 }
            ],
            total: 274800,
            paiement: 'especes',
            statut: 'complete',
            vendeur: 'Vendeur1',
            transport: 10000,
            remise: 5000
        },
        {
            id: 'VENT-2024-00119',
            date: '2024-01-13 15:30',
            client: { nom: "Dupont", prenom: "Jean", telephone: "+229 12 34 56 78" },
            articles: [
                { nom: "Montre Connectée", quantite: 1, prix: 199900 }
            ],
            total: 199900,
            paiement: 'especes',
            statut: 'complete',
            vendeur: 'Vendeur2',
            transport: 0,
            remise: 10000
        },
        {
            id: 'VENT-2024-00118',
            date: '2024-01-12 09:45',
            client: { nom: "Leclerc", prenom: "Sophie", telephone: "+229 45 67 89 01" },
            articles: [
                { nom: "Ordinateur Portable", quantite: 1, prix: 899900 },
                { nom: "Sacoche", quantite: 1, prix: 25000 },
                { nom: "Souris sans fil", quantite: 1, prix: 35000 }
            ],
            total: 959900,
            paiement: 'mobile_money',
            statut: 'complete',
            vendeur: 'Admin',
            transport: 15000,
            remise: 20000
        },
        {
            id: 'VENT-2024-00117',
            date: '2024-01-11 13:20',
            client: null,
            articles: [
                { nom: "Écouteurs Bluetooth", quantite: 3, prix: 79900 },
                { nom: "Adaptateur", quantite: 2, prix: 15000 }
            ],
            total: 269700,
            paiement: 'especes',
            statut: 'complete',
            vendeur: 'Vendeur1',
            transport: 0,
            remise: 0
        },
        {
            id: 'VENT-2024-00116',
            date: '2024-01-10 17:10',
            client: { nom: "Moreau", prenom: "Thomas", telephone: "+229 56 78 90 12" },
            articles: [
                { nom: "Smartphone Android", quantite: 2, prix: 349900 }
            ],
            total: 699800,
            paiement: 'carte',
            statut: 'complete',
            vendeur: 'Admin',
            transport: 0,
            remise: 0
        }
    ];

    // Initialisation des données
    useEffect(() => {
        setVentes(ventesMock);
        calculerStats(ventesMock);
    }, []);

    // Calculer les statistiques
    const calculerStats = (ventesList) => {
        const totalVentes = ventesList.filter(v => v.statut === 'complete').length;
        const totalCA = ventesList
            .filter(v => v.statut === 'complete')
            .reduce((sum, v) => sum + v.total, 0);
        
        const moyennePanier = totalVentes > 0 ? totalCA / totalVentes : 0;
        
        // Trouver le meilleur jour (simplifié)
        const ventesParDate = {};
        ventesList.forEach(v => {
            if (v.statut === 'complete') {
                const date = v.date.split(' ')[0];
                ventesParDate[date] = (ventesParDate[date] || 0) + v.total;
            }
        });
        
        let meilleurJour = { date: '', montant: 0 };
        Object.entries(ventesParDate).forEach(([date, montant]) => {
            if (montant > meilleurJour.montant) {
                meilleurJour = { date, montant };
            }
        });

        setStats({
            totalVentes,
            totalCA,
            moyennePanier,
            meilleurJour
        });
    };

    // Filtrer les ventes
    const ventesFiltrees = ventes.filter(vente => {
        const matchesSearch = 
            vente.id.toLowerCase().includes(search.toLowerCase()) ||
            (vente.client && `${vente.client.prenom} ${vente.client.nom}`.toLowerCase().includes(search.toLowerCase())) ||
            vente.vendeur.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatut = filterStatut === 'tous' || vente.statut === filterStatut;
        const matchesPaiement = filterPaiement === 'tous' || vente.paiement === filterPaiement;
        
        let matchesDate = true;
        if (dateDebut && dateFin) {
            const venteDate = vente.date.split(' ')[0];
            matchesDate = venteDate >= dateDebut && venteDate <= dateFin;
        } else if (filterDate !== 'tous') {
            const aujourdHui = new Date().toISOString().split('T')[0];
            const hier = new Date();
            hier.setDate(hier.getDate() - 1);
            const hierStr = hier.toISOString().split('T')[0];
            
            const venteDate = vente.date.split(' ')[0];
            
            switch(filterDate) {
                case 'aujourdhui':
                    matchesDate = venteDate === aujourdHui;
                    break;
                case 'hier':
                    matchesDate = venteDate === hierStr;
                    break;
                case 'semaine':
                    const semaineAgo = new Date();
                    semaineAgo.setDate(semaineAgo.getDate() - 7);
                    const semaineStr = semaineAgo.toISOString().split('T')[0];
                    matchesDate = venteDate >= semaineStr;
                    break;
                case 'mois':
                    const moisAgo = new Date();
                    moisAgo.setMonth(moisAgo.getMonth() - 1);
                    const moisStr = moisAgo.toISOString().split('T')[0];
                    matchesDate = venteDate >= moisStr;
                    break;
            }
        }
        
        return matchesSearch && matchesStatut && matchesPaiement && matchesDate;
    });

    // Formater la date
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtenir la couleur du statut
    const getStatutColor = (statut) => {
        switch(statut) {
            case 'complete': return 'bg-green-100 text-green-800';
            case 'annule': return 'bg-red-100 text-red-800';
            case 'en_attente': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtenir l'icône du statut
    const getStatutIcon = (statut) => {
        switch(statut) {
            case 'complete': return <CheckCircle className="w-4 h-4" />;
            case 'annule': return <XCircle className="w-4 h-4" />;
            case 'en_attente': return <Clock className="w-4 h-4" />;
            default: return null;
        }
    };

    // Obtenir le libellé du mode de paiement
    const getPaiementLabel = (paiement) => {
        switch(paiement) {
            case 'especes': return 'Espèces';
            case 'mobile_money': return 'Mobile Money';
            case 'carte': return 'Carte bancaire';
            default: return paiement;
        }
    };

    // Exporter les données
    const exporterDonnees = () => {
        const dataStr = JSON.stringify(ventesFiltrees, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ventes_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    // Recharger les données
    const rechargerDonnees = () => {
        setLoading(true);
        setTimeout(() => {
            setVentes([...ventesMock]);
            calculerStats(ventesMock);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Historique des Ventes</h1>
                                <p className="text-sm text-gray-600">Consultation et analyse des ventes</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={rechargerDonnees}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Ventes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalVentes}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Chiffre d'Affaires</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCA.toLocaleString()} F</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Moyenne Panier</p>
                                <p className="text-2xl font-bold text-gray-900">{Math.round(stats.moyennePanier).toLocaleString()} F</p>
                            </div>
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Meilleur Jour</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {stats.meilleurJour.date || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    {stats.meilleurJour.montant.toLocaleString()} F
                                </p>
                            </div>
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ArrowUpRight className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par N° vente, client ou vendeur..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {/* Filtre date */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    <option value="tous">Toutes dates</option>
                                    <option value="aujourdhui">Aujourd'hui</option>
                                    <option value="hier">Hier</option>
                                    <option value="semaine">7 derniers jours</option>
                                    <option value="mois">30 derniers jours</option>
                                    <option value="personnalise">Période personnalisée</option>
                                </select>
                            </div>
                            
                            {/* Date personnalisée */}
                            {filterDate === 'personnalise' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                    <span>au</span>
                                    <input
                                        type="date"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                            
                            {/* Filtre statut */}
                            <select
                                value={filterStatut}
                                onChange={(e) => setFilterStatut(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            >
                                <option value="tous">Tous statuts</option>
                                <option value="complete">Complètes</option>
                                <option value="annule">Annulées</option>
                                <option value="en_attente">En attente</option>
                            </select>
                            
                            {/* Filtre paiement */}
                            <select
                                value={filterPaiement}
                                onChange={(e) => setFilterPaiement(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            >
                                <option value="tous">Tous paiements</option>
                                <option value="especes">Espèces</option>
                                <option value="mobile_money">Mobile Money</option>
                                <option value="carte">Carte bancaire</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tableau des ventes */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">
                            Ventes ({ventesFiltrees.length})
                        </h2>
                        <button
                            onClick={exporterDonnees}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Exporter
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        N° Vente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Vendeur
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paiement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {ventesFiltrees.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            Aucune vente trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    ventesFiltrees.map((vente) => (
                                        <tr key={vente.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-blue-600">{vente.id}</div>
                                                <div className="text-xs text-gray-500">
                                                    {vente.articles.length} article{vente.articles.length > 1 ? 's' : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(vente.date)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {vente.client ? (
                                                    <div>
                                                        <div className="font-medium">
                                                            {vente.client.prenom} {vente.client.nom}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {vente.client.telephone}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">Client comptoir</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{vente.vendeur}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">
                                                    {vente.total.toLocaleString()} F
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                    {getPaiementLabel(vente.paiement)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatutColor(vente.statut)}`}>
                                                        {getStatutIcon(vente.statut)}
                                                        {vente.statut === 'complete' ? 'Complète' : vente.statut === 'annule' ? 'Annulée' : 'En attente'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedVente(vente);
                                                            setShowDetails(true);
                                                        }}
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Voir détails"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => window.print()}
                                                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                                        title="Imprimer"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {ventesFiltrees.length > 0 && (
                        <div className="px-6 py-4 border-t flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Affichage de {ventesFiltrees.length} ventes
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">1</span>
                                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Détails Vente */}
            {showDetails && selectedVente && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-600">{selectedVente.id}</h2>
                                    <p className="text-gray-600">Détails de la vente</p>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Informations client */}
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                                    {selectedVente.client ? (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="font-medium">
                                                {selectedVente.client.prenom} {selectedVente.client.nom}
                                            </p>
                                            <p className="text-gray-600 mt-1">
                                                <Phone className="w-4 h-4 inline mr-1" />
                                                {selectedVente.client.telephone}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-gray-600">Client comptoir</p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Informations vente */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span>{formatDate(selectedVente.date)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Vendeur:</span>
                                            <span>{selectedVente.vendeur}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Paiement:</span>
                                            <span>{getPaiementLabel(selectedVente.paiement)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Statut:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatutColor(selectedVente.statut)}`}>
                                                {selectedVente.statut === 'complete' ? 'Complète' : 'Annulée'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Articles */}
                            <h3 className="font-semibold text-gray-900 mb-4">Articles</h3>
                            <div className="border rounded-lg overflow-hidden mb-6">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Article</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Qté</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Prix unitaire</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedVente.articles.map((article, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                                            <Package className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <span>{article.nom}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">{article.quantite}</td>
                                                <td className="px-4 py-3 text-right">{article.prix.toLocaleString()} F</td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {(article.prix * article.quantite).toLocaleString()} F
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Totaux */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sous-total:</span>
                                        <span>
                                            {selectedVente.articles.reduce((sum, article) => 
                                                sum + (article.prix * article.quantite), 0
                                            ).toLocaleString()} F
                                        </span>
                                    </div>
                                    
                                    {selectedVente.remise > 0 && (
                                        <div className="flex justify-between text-red-600">
                                            <span>Remise:</span>
                                            <span>- {selectedVente.remise.toLocaleString()} F</span>
                                        </div>
                                    )}
                                    
                                    {selectedVente.transport > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Transport:</span>
                                            <span>+ {selectedVente.transport.toLocaleString()} F</span>
                                        </div>
                                    )}
                                    
                                    <div className="pt-3 border-t">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>TOTAL:</span>
                                            <span className="text-blue-600">{selectedVente.total.toLocaleString()} F</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Imprimer
                            </button>
                            <button
                                onClick={() => setShowDetails(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Historique des Ventes - {stats.totalVentes} ventes enregistrées</p>
                        <p className="mt-1">Total CA: {stats.totalCA.toLocaleString()} F</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SalesHistory;