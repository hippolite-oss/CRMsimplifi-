import React, { useState, useEffect } from 'react';
import {
    Package, DollarSign, Tag, Hash, BarChart3, Save,
    Upload, Image, X, CheckCircle, AlertCircle, Plus,
    Trash2, Layers, Box, ShoppingBag, Loader2
} from 'lucide-react';

const NewProduct = () => {
    // États principaux
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    
    // États pour le formulaire produit
    const [formData, setFormData] = useState({
        nom: '',
        code: '',
        reference: '',
        categorie: '',
        sousCategorie: '',
        prixAchat: '',
        prixVente: '',
        marge: '',
        stockInitial: '',
        stockMinimal: '',
        stockMaximal: '',
        unite: 'unité',
        tva: 18,
        description: '',
        notes: ''
    });

    const [variantes, setVariantes] = useState([]);
    const [currentVariante, setCurrentVariante] = useState({
        nom: '',
        prixSupplement: '',
        stock: ''
    });

    const [imageUrl, setImageUrl] = useState('');
    const [categories, setCategories] = useState([
        'Électronique', 'Informatique', 'Téléphonie', 'Accessoires', 'Bureau', 'Maison'
    ]);
    
    const [sousCategories, setSousCategories] = useState({
        'Électronique': ['Téléviseurs', 'Audio', 'Caméras'],
        'Informatique': ['Ordinateurs', 'Périphériques', 'Stockage'],
        'Téléphonie': ['Smartphones', 'Tablettes', 'Accessoires'],
        'Accessoires': ['Câbles', 'Chargeurs', 'Protections'],
        'Bureau': ['Fournitures', 'Meubles', 'Éclairage'],
        'Maison': ['Décoration', 'Cuisine', 'Jardin']
    });

    // Générer un code produit automatique
    const genererCode = () => {
        const prefix = formData.categorie ? formData.categorie.substring(0, 3).toUpperCase() : 'PRO';
        const random = Math.floor(1000 + Math.random() * 9000);
        const nouveauCode = `${prefix}-${random}`;
        setFormData(prev => ({ ...prev, code: nouveauCode }));
    };

    // Calculer la marge automatiquement
    useEffect(() => {
        if (formData.prixAchat && formData.prixVente) {
            const achat = parseFloat(formData.prixAchat);
            const vente = parseFloat(formData.prixVente);
            if (!isNaN(achat) && !isNaN(vente) && achat > 0) {
                const margeCalc = ((vente - achat) / achat) * 100;
                setFormData(prev => ({ ...prev, marge: margeCalc.toFixed(2) }));
            }
        }
    }, [formData.prixAchat, formData.prixVente]);

    // Calculer le prix de vente à partir de la marge
    const calculerPrixDepuisMarge = () => {
        if (formData.prixAchat && formData.marge) {
            const achat = parseFloat(formData.prixAchat);
            const marge = parseFloat(formData.marge);
            if (!isNaN(achat) && !isNaN(marge)) {
                const vente = achat * (1 + marge / 100);
                setFormData(prev => ({ ...prev, prixVente: vente.toFixed(0) }));
            }
        }
    };

    // Gestion des variantes
    const ajouterVariante = () => {
        if (!currentVariante.nom) {
            showNotification('Veuillez saisir un nom de variante', 'error');
            return;
        }
        
        const nouvelleVariante = {
            id: Date.now(),
            ...currentVariante,
            prixSupplement: parseFloat(currentVariante.prixSupplement) || 0,
            stock: parseInt(currentVariante.stock) || 0
        };
        
        setVariantes([...variantes, nouvelleVariante]);
        setCurrentVariante({ nom: '', prixSupplement: '', stock: '' });
        showNotification('Variante ajoutée');
    };

    const supprimerVariante = (id) => {
        setVariantes(variantes.filter(v => v.id !== id));
        showNotification('Variante supprimée');
    };

    // Soumission du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation de base
        if (!formData.nom || !formData.prixVente || !formData.stockInitial) {
            showNotification('Veuillez remplir les champs obligatoires', 'error');
            return;
        }

        setLoading(true);
        
        // Simulation d'envoi
        setTimeout(() => {
            console.log('Produit créé:', {
                ...formData,
                variantes,
                imageUrl
            });
            
            setLoading(false);
            showNotification('Produit créé avec succès !');
            setShowPreview(true);
            
            // Réinitialiser après succès (optionnel)
            // resetForm();
        }, 1500);
    };

    const resetForm = () => {
        setFormData({
            nom: '',
            code: '',
            reference: '',
            categorie: '',
            sousCategorie: '',
            prixAchat: '',
            prixVente: '',
            marge: '',
            stockInitial: '',
            stockMinimal: '',
            stockMaximal: '',
            unite: 'unité',
            tva: 18,
            description: '',
            notes: ''
        });
        setVariantes([]);
        setImageUrl('');
        setShowPreview(false);
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Champs obligatoires
    const champsObligatoires = [
        'nom', 'code', 'prixVente', 'stockInitial'
    ];

    const estValide = () => {
        return champsObligatoires.every(champ => formData[champ]);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-lg">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Nouveau Produit</h1>
                                <p className="text-sm text-gray-600">Ajouter un produit au catalogue</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                {showPreview ? 'Retour au formulaire' : 'Prévisualiser'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenu Principal */}
            <div className="container mx-auto px-4 py-6">
                {showPreview ? (
                    // Prévisualisation
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Prévisualisation du Produit</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Image */}
                            <div className="border rounded-lg p-4">
                                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="Produit" className="max-h-64 rounded-lg" />
                                    ) : (
                                        <Image className="w-16 h-16 text-gray-400" />
                                    )}
                                </div>
                            </div>
                            
                            {/* Informations */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">{formData.nom || 'Nom du produit'}</h3>
                                    <p className="text-gray-600">Code: {formData.code || 'N/A'}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Catégorie</p>
                                        <p className="font-medium">{formData.categorie || 'Non spécifiée'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Sous-catégorie</p>
                                        <p className="font-medium">{formData.sousCategorie || 'Non spécifiée'}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-600">Prix de vente</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formData.prixVente ? `${parseFloat(formData.prixVente).toLocaleString()} F` : '0 F'}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Stock initial</p>
                                        <p className="font-medium">{formData.stockInitial || '0'} unités</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Unité</p>
                                        <p className="font-medium">{formData.unite}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">TVA</p>
                                        <p className="font-medium">{formData.tva}%</p>
                                    </div>
                                </div>
                                
                                {formData.description && (
                                    <div>
                                        <p className="text-sm text-gray-600">Description</p>
                                        <p className="text-gray-700">{formData.description}</p>
                                    </div>
                                )}
                                
                                {variantes.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Variantes ({variantes.length})</p>
                                        <div className="space-y-2">
                                            {variantes.map(variante => (
                                                <div key={variante.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                                    <span>{variante.nom}</span>
                                                    <span className="text-green-600">+ {variante.prixSupplement} F</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Modifier le produit
                            </button>
                        </div>
                    </div>
                ) : (
                    // Formulaire
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne gauche - Informations principales */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Informations de base */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Informations produit
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom du produit *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nom}
                                                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="Ex: Smartphone Android"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Code produit *
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={formData.code}
                                                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="Ex: PRO-001"
                                                />
                                                <button
                                                    onClick={genererCode}
                                                    type="button"
                                                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                                                >
                                                    Générer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Catégorie
                                            </label>
                                            <select
                                                value={formData.categorie}
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData, 
                                                        categorie: e.target.value,
                                                        sousCategorie: ''
                                                    });
                                                }}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Sélectionner une catégorie</option>
                                                {categories.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Sous-catégorie
                                            </label>
                                            <select
                                                value={formData.sousCategorie}
                                                onChange={(e) => setFormData({...formData, sousCategorie: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                disabled={!formData.categorie}
                                            >
                                                <option value="">Sélectionner une sous-catégorie</option>
                                                {formData.categorie && sousCategories[formData.categorie]?.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description (optionnel)
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            rows="3"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            placeholder="Description détaillée du produit..."
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Prix et stock */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Prix et stock
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix d'achat (HT)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.prixAchat}
                                                    onChange={(e) => setFormData({...formData, prixAchat: e.target.value})}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">F</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix de vente (TTC) *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.prixVente}
                                                    onChange={(e) => setFormData({...formData, prixVente: e.target.value})}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">F</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Marge (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={formData.marge}
                                                    onChange={(e) => {
                                                        setFormData({...formData, marge: e.target.value});
                                                        calculerPrixDepuisMarge();
                                                    }}
                                                    className="w-full pr-10 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock initial *
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.stockInitial}
                                                onChange={(e) => setFormData({...formData, stockInitial: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Unité
                                            </label>
                                            <select
                                                value={formData.unite}
                                                onChange={(e) => setFormData({...formData, unite: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="unité">Unité</option>
                                                <option value="paquet">Paquet</option>
                                                <option value="carton">Carton</option>
                                                <option value="mètre">Mètre</option>
                                                <option value="kilogramme">Kilogramme</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock minimal
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.stockMinimal}
                                                onChange={(e) => setFormData({...formData, stockMinimal: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock maximal
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.stockMaximal}
                                                onChange={(e) => setFormData({...formData, stockMaximal: e.target.value})}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Taux de TVA (%)
                                        </label>
                                        <select
                                            value={formData.tva}
                                            onChange={(e) => setFormData({...formData, tva: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                        >
                                            <option value="0">0% (Exonéré)</option>
                                            <option value="5.5">5.5% (Réduit)</option>
                                            <option value="10">10% (Intermédiaire)</option>
                                            <option value="20">20% (Normal)</option>
                                            <option value="18">18% (Standard)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Colonne droite - Options et actions */}
                        <div className="space-y-6">
                            {/* Image du produit */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Image className="w-5 h-5" />
                                    Image du produit
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt="Produit" className="max-h-full rounded-lg" />
                                        ) : (
                                            <Image className="w-16 h-16 text-gray-400" />
                                        )}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            URL de l'image (optionnel)
                                        </label>
                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="https://exemple.com/image.jpg"
                                        />
                                        <p className="text-xs text-gray-500">
                                            ou téléchargez une image depuis votre ordinateur
                                        </p>
                                    </div>
                                    
                                    <button className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2">
                                        <Upload className="w-4 h-4" />
                                        Télécharger une image
                                    </button>
                                </div>
                            </div>
                            
                            {/* Variantes */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Layers className="w-5 h-5" />
                                    Variantes (optionnel)
                                </h3>
                                
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nom de la variante
                                            </label>
                                            <input
                                                type="text"
                                                value={currentVariante.nom}
                                                onChange={(e) => setCurrentVariante({...currentVariante, nom: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                placeholder="Ex: Rouge, Grande taille"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Supplément prix
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentVariante.prixSupplement}
                                                    onChange={(e) => setCurrentVariante({...currentVariante, prixSupplement: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    value={currentVariante.stock}
                                                    onChange={(e) => setCurrentVariante({...currentVariante, stock: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={ajouterVariante}
                                            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Ajouter la variante
                                        </button>
                                    </div>
                                    
                                    {variantes.length > 0 && (
                                        <div className="border-t pt-4">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Variantes ajoutées ({variantes.length})
                                            </p>
                                            <div className="space-y-2">
                                                {variantes.map(variante => (
                                                    <div key={variante.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{variante.nom}</p>
                                                            <p className="text-sm text-gray-600">
                                                                + {variante.prixSupplement} F • Stock: {variante.stock}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => supprimerVariante(variante.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                                
                                <div className="space-y-3">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || !estValide()}
                                        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                                            estValide() 
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Save className="w-5 h-5" />
                                        )}
                                        {loading ? 'Création en cours...' : 'Créer le produit'}
                                    </button>
                                    
                                    <button
                                        onClick={resetForm}
                                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                                    >
                                        Réinitialiser
                                    </button>
                                    
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-600 mb-2">Champs obligatoires *</p>
                                        <ul className="text-xs text-gray-500 space-y-1">
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                Nom du produit
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                Code produit
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                Prix de vente
                                            </li>
                                            <li className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                Stock initial
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{notification.msg}</span>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Gestion des Produits - Nouveau produit</p>
                        <p className="mt-1">Remplissez tous les champs obligatoires (*) pour créer le produit</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default NewProduct;

// Ajout de l'import manquant pour Eye
import { Eye } from 'lucide-react';