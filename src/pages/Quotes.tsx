import React, { useState, useEffect, useRef } from 'react';
import {
    Search, User, FileText, Trash2, Plus, Printer, Calendar,
    CheckCircle, Download, Edit, Eye, Clock, DollarSign, X,
    ChevronLeft, ChevronRight, Filter, PlusCircle, UserPlus
} from 'lucide-react';

const Quotes = () => {
    // États principaux
    const [activeTab, setActiveTab] = useState('nouveau');
    const [search, setSearch] = useState('');
    const [searchClient, setSearchClient] = useState('');
    const [searchProduit, setSearchProduit] = useState('');
    const [devisListe, setDevisListe] = useState([]);
    const [panier, setPanier] = useState([]);
    const [clientSelectionne, setClientSelectionne] = useState(null);
    const [montantRemise, setMontantRemise] = useState('');
    const [fraisTransport, setFraisTransport] = useState('');
    const [validite, setValidite] = useState(30);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showModalClient, setShowModalClient] = useState(false);
    const [showModalDevis, setShowModalDevis] = useState(false);
    const [selectedDevis, setSelectedDevis] = useState(null);
    const [filterStatut, setFilterStatut] = useState('tous');

    // Références
    const produitInputRef = useRef(null);
    const clientInputRef = useRef(null);

    // Données mockées pour les produits
    const produits = [
        { id: 1, nom: "Ordinateur Portable", prix: 899900, categorie: "informatique" },
        { id: 2, nom: "Smartphone Android", prix: 349900, categorie: "téléphonie" },
        { id: 3, nom: "Écouteurs Bluetooth", prix: 79900, categorie: "audio" },
        { id: 4, nom: "Montre Connectée", prix: 199900, categorie: "wearable" },
        { id: 5, nom: "Tablette Android", prix: 449900, categorie: "informatique" },
        { id: 6, nom: "Enceinte Portable", prix: 129900, categorie: "audio" }
    ];

    // Données mockées pour les clients
    const clients = [
        { id: 1, nom: "Dupont", prenom: "Jean", entreprise: "Dupont SA", telephone: "+229 12 34 56 78" },
        { id: 2, nom: "Martin", prenom: "Marie", entreprise: "Martin & Cie", telephone: "+229 23 45 67 89" },
        { id: 3, nom: "Bernard", prenom: "Pierre", entreprise: "Bernard Tech", telephone: "+229 34 56 78 90" }
    ];

    // Données mockées pour les devis
    const devisMock = [
        { 
            id: 'DEV-2024-001', 
            client: { nom: "Dupont", prenom: "Jean", entreprise: "Dupont SA" },
            date: '2024-01-15', 
            total: 1299900, 
            statut: 'accepté',
            validite: 30,
            items: 3
        },
        { 
            id: 'DEV-2024-002', 
            client: { nom: "Martin", prenom: "Marie", entreprise: "Martin & Cie" },
            date: '2024-01-14', 
            total: 549900, 
            statut: 'en_attente',
            validite: 30,
            items: 2
        },
        { 
            id: 'DEV-2024-003', 
            client: { nom: "Bernard", prenom: "Pierre", entreprise: "Bernard Tech" },
            date: '2024-01-13', 
            total: 79900, 
            statut: 'refusé',
            validite: 15,
            items: 1
        },
        { 
            id: 'DEV-2024-004', 
            client: { nom: "Dupont", prenom: "Jean", entreprise: "Dupont SA" },
            date: '2024-01-12', 
            total: 199900, 
            statut: 'expiré',
            validite: 7,
            items: 1
        }
    ];

    // Initialisation des données
    useEffect(() => {
        setDevisListe(devisMock);
    }, []);

    // Filtrage des devis
    const devisFiltres = devisListe.filter(devis => {
        const matchesSearch = 
            devis.id.toLowerCase().includes(search.toLowerCase()) ||
            `${devis.client.prenom} ${devis.client.nom}`.toLowerCase().includes(search.toLowerCase());
        
        const matchesStatut = 
            filterStatut === 'tous' || 
            devis.statut === filterStatut;
        
        return matchesSearch && matchesStatut;
    });

    const clientsFiltres = clients.filter(client =>
        `${client.prenom} ${client.nom}`.toLowerCase().includes(searchClient.toLowerCase()) ||
        client.entreprise.toLowerCase().includes(searchClient.toLowerCase()) ||
        client.telephone.includes(searchClient)
    );

    const produitsFiltres = produits.filter(produit =>
        produit.nom.toLowerCase().includes(searchProduit.toLowerCase())
    );

    // Fonctions panier
    const ajouterAuPanier = (produit) => {
        const existant = panier.find(item => item.id === produit.id);
        
        if (existant) {
            setPanier(panier.map(item =>
                item.id === produit.id
                    ? { ...item, quantite: item.quantite + 1 }
                    : item
            ));
        } else {
            setPanier([...panier, { ...produit, quantite: 1, remise: 0 }]);
        }
        
        showNotification(`${produit.nom} ajouté au devis`);
    };

    const modifierQuantite = (id, delta) => {
        setPanier(panier.map(item => {
            if (item.id === id) {
                const newQuantite = item.quantite + delta;
                return newQuantite < 1 ? item : { ...item, quantite: newQuantite };
            }
            return item;
        }));
    };

    const modifierRemise = (id, remise) => {
        setPanier(panier.map(item =>
            item.id === id ? { ...item, remise: parseFloat(remise) || 0 } : item
        ));
    };

    const supprimerDuPanier = (id) => {
        setPanier(panier.filter(item => item.id !== id));
        showNotification('Article retiré');
    };

    // Calculs
    const calculerTotalLigne = (item) => {
        const total = item.prix * item.quantite;
        const remiseMontant = total * (item.remise / 100);
        return total - remiseMontant;
    };

    const sousTotal = panier.reduce((sum, item) => sum + calculerTotalLigne(item), 0);
    const totalRemise = panier.reduce((sum, item) => sum + (item.prix * item.quantite * (item.remise / 100)), 0);
    const totalTransport = parseFloat(fraisTransport) || 0;
    const totalDevis = sousTotal + totalTransport;

    // Fonctions devis
    const creerDevis = () => {
        if (panier.length === 0) {
            showNotification('Ajoutez au moins un article', 'error');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            const nouveauDevis = {
                id: `DEV-2024-${String(devisListe.length + 1).padStart(3, '0')}`,
                client: clientSelectionne || { nom: "Client", prenom: "Comptoir" },
                date: new Date().toISOString().split('T')[0],
                total: totalDevis,
                statut: 'en_attente',
                validite: validite,
                items: panier.length,
                panier: [...panier],
                notes: notes
            };

            setDevisListe([nouveauDevis, ...devisListe]);
            setPanier([]);
            setClientSelectionne(null);
            setNotes('');
            setFraisTransport('');
            setMontantRemise('');

            setLoading(false);
            showNotification('Devis créé avec succès');
            setActiveTab('liste');
        }, 1500);
    };

    const exporterPDF = (devis) => {
        showNotification('Export PDF en préparation...');
        console.log('Export PDF pour:', devis.id);
    };

    const imprimerDevis = (devis) => {
        showNotification('Impression en cours...');
        console.log('Impression devis:', devis.id);
    };

    const modifierStatut = (devisId, nouveauStatut) => {
        setDevisListe(devisListe.map(devis =>
            devis.id === devisId ? { ...devis, statut: nouveauStatut } : devis
        ));
        showNotification(`Statut mis à jour: ${nouveauStatut}`);
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getStatutColor = (statut) => {
        switch(statut) {
            case 'accepté': return 'bg-green-100 text-green-800';
            case 'en_attente': return 'bg-yellow-100 text-yellow-800';
            case 'refusé': return 'bg-red-100 text-red-800';
            case 'expiré': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Gestion des Devis</h1>
                                <p className="text-sm text-gray-600">Créer et gérer vos devis clients</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-right hidden sm:block">
                                <p className="font-medium">Vendeur: Admin</p>
                                <p className="text-gray-600">Total devis: {devisListe.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex border-b mt-4">
                        <button
                            onClick={() => setActiveTab('nouveau')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                                activeTab === 'nouveau'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Nouveau Devis
                        </button>
                        <button
                            onClick={() => setActiveTab('liste')}
                            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                                activeTab === 'liste'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Liste des Devis ({devisListe.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="container mx-auto px-4 py-6">
                {activeTab === 'nouveau' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne gauche - Articles */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Recherche produit */}
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        ref={produitInputRef}
                                        type="text"
                                        placeholder="Rechercher un produit..."
                                        value={searchProduit}
                                        onChange={(e) => setSearchProduit(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {produitsFiltres.map(produit => (
                                        <div key={produit.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-medium text-gray-900">{produit.nom}</h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {produit.categorie}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-lg font-semibold text-blue-600">
                                                    {produit.prix.toLocaleString()} F
                                                </span>
                                                <button
                                                    onClick={() => ajouterAuPanier(produit)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Ajouter
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Panier actuel */}
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="p-4 border-b">
                                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Articles du devis ({panier.reduce((s, i) => s + i.quantite, 0)})
                                    </h2>
                                </div>
                                
                                <div className="p-4">
                                    {panier.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            Aucun article ajouté
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {panier.map(item => (
                                                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{item.nom}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Prix unitaire: {item.prix.toLocaleString()} F
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => supprimerDuPanier(item.id)}
                                                            className="text-gray-400 hover:text-red-600"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Quantité
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => modifierQuantite(item.id, -1)}
                                                                    className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                                                                >
                                                                    <ChevronLeft className="w-4 h-4" />
                                                                </button>
                                                                <span className="font-medium text-center min-w-[40px]">
                                                                    {item.quantite}
                                                                </span>
                                                                <button
                                                                    onClick={() => modifierQuantite(item.id, 1)}
                                                                    className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center hover:bg-blue-200"
                                                                >
                                                                    <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Remise (%)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={item.remise}
                                                                onChange={(e) => modifierRemise(item.id, e.target.value)}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600">Total ligne</p>
                                                            <p className="text-lg font-bold text-blue-600">
                                                                {calculerTotalLigne(item).toLocaleString()} F
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne droite - Informations */}
                        <div className="space-y-6">
                            {/* Informations client */}
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Client
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher un client..."
                                            value={searchClient}
                                            onChange={(e) => setSearchClient(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    
                                    {clientSelectionne ? (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-blue-900">
                                                        {clientSelectionne.entreprise}
                                                    </p>
                                                    <p className="text-sm text-blue-700 mt-1">
                                                        {clientSelectionne.prenom} {clientSelectionne.nom}
                                                    </p>
                                                    <p className="text-xs text-blue-600 mt-1">
                                                        {clientSelectionne.telephone}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => setClientSelectionne(null)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <button
                                                onClick={() => setShowModalClient(true)}
                                                className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Nouveau client
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informations devis */}
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Informations devis</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Validité (jours)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="1"
                                                value={validite}
                                                onChange={(e) => setValidite(e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            />
                                            <span className="text-sm text-gray-600">jours</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Frais de transport
                                        </label>
                                        <input
                                            type="number"
                                            value={fraisTransport}
                                            onChange={(e) => setFraisTransport(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="0"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Notes (optionnel)
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="Informations complémentaires..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Récapitulatif */}
                            <div className="bg-white rounded-lg shadow-sm border p-4">
                                <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif</h3>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sous-total</span>
                                        <span>{sousTotal.toLocaleString()} F</span>
                                    </div>
                                    
                                    <div className="flex justify-between text-red-600">
                                        <span>Remises</span>
                                        <span>- {totalRemise.toLocaleString()} F</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transport</span>
                                        <span>+ {totalTransport.toLocaleString()} F</span>
                                    </div>
                                    
                                    <div className="pt-3 border-t">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total devis</span>
                                            <span className="text-blue-600">{totalDevis.toLocaleString()} F</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={creerDevis}
                                        disabled={loading || panier.length === 0}
                                        className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                        Créer le devis
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Liste des devis */
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="p-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un devis..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-gray-500" />
                                    <select
                                        value={filterStatut}
                                        onChange={(e) => setFilterStatut(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    >
                                        <option value="tous">Tous les statuts</option>
                                        <option value="en_attente">En attente</option>
                                        <option value="accepté">Accepté</option>
                                        <option value="refusé">Refusé</option>
                                        <option value="expiré">Expiré</option>
                                    </select>
                                    
                                    <button
                                        onClick={() => setActiveTab('nouveau')}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-5 h-5" />
                                        Nouveau
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            N° Devis
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
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
                                    {devisFiltres.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                Aucun devis trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        devisFiltres.map(devis => (
                                            <tr key={devis.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-blue-600">{devis.id}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {devis.items} article{devis.items > 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">
                                                        {devis.client.prenom} {devis.client.nom}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {devis.client.entreprise}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {devis.date}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Validité: {devis.validite} jours
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">
                                                        {devis.total.toLocaleString()} F
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatutColor(devis.statut)}`}>
                                                        {devis.statut.charAt(0).toUpperCase() + devis.statut.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedDevis(devis);
                                                                setShowModalDevis(true);
                                                            }}
                                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => imprimerDevis(devis)}
                                                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                                                            title="Imprimer"
                                                        >
                                                            <Printer className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => exporterPDF(devis)}
                                                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                                            title="Exporter PDF"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <select
                                                            value={devis.statut}
                                                            onChange={(e) => modifierStatut(devis.id, e.target.value)}
                                                            className="px-2 py-1 text-xs border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                        >
                                                            <option value="en_attente">En attente</option>
                                                            <option value="accepté">Accepté</option>
                                                            <option value="refusé">Refusé</option>
                                                            <option value="expiré">Expiré</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Nouveau Client */}
            {showModalClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Nouveau client</h3>
                            <button onClick={() => setShowModalClient(false)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    placeholder="Nom de l'entreprise"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                        placeholder="Nom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                        placeholder="Prénom"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    placeholder="+229"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    placeholder="email@exemple.com"
                                />
                            </div>
                        </div>
                        
                        <div className="p-4 border-t flex gap-3">
                            <button
                                onClick={() => {
                                    // Simuler création client
                                    const nouveauClient = {
                                        id: clients.length + 1,
                                        nom: "Nouveau",
                                        prenom: "Client",
                                        entreprise: "Entreprise",
                                        telephone: "+229"
                                    };
                                    setClientSelectionne(nouveauClient);
                                    setShowModalClient(false);
                                    showNotification('Client créé');
                                }}
                                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium"
                            >
                                Créer
                            </button>
                            <button
                                onClick={() => setShowModalClient(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Détails Devis */}
            {showModalDevis && selectedDevis && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-blue-600">{selectedDevis.id}</h2>
                                    <p className="text-gray-600">Devis client</p>
                                </div>
                                <button onClick={() => setShowModalDevis(false)} className="text-gray-500 hover:text-gray-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="md:col-span-2">
                                    <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">
                                            {selectedDevis.client.entreprise}
                                        </p>
                                        <p className="text-gray-600 mt-1">
                                            {selectedDevis.client.prenom} {selectedDevis.client.nom}
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Informations</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date création:</span>
                                            <span>{selectedDevis.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Validité:</span>
                                            <span>{selectedDevis.validite} jours</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Statut:</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatutColor(selectedDevis.statut)}`}>
                                                {selectedDevis.statut}
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
                                        {selectedDevis.panier ? (
                                            selectedDevis.panier.map((item, index) => (
                                                <tr key={index} className="border-t">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium">{item.nom}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">{item.quantite}</td>
                                                    <td className="px-4 py-3 text-right">{item.prix.toLocaleString()} F</td>
                                                    <td className="px-4 py-3 text-right font-medium">
                                                        {(item.prix * item.quantite).toLocaleString()} F
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                                    Détails des articles non disponibles
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Total */}
                            <div className="flex justify-end">
                                <div className="w-64">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">{selectedDevis.total.toLocaleString()} F</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => imprimerDevis(selectedDevis)}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Printer className="w-5 h-5" />
                                Imprimer
                            </button>
                            <button
                                onClick={() => exporterPDF(selectedDevis)}
                                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Exporter PDF
                            </button>
                            <button
                                onClick={() => setShowModalDevis(false)}
                                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{notification.msg}</span>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Gestion des Devis - {devisListe.length} devis créés</p>
                        <p className="mt-1">Système de devis professionnel</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Quotes;