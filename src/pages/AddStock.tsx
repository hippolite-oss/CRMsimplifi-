import React, { useState, useEffect, useRef } from 'react';
import {
    Plus, Package, DollarSign, Hash, Calendar, CheckCircle,
    XCircle, AlertTriangle, Upload, Camera, Barcode, ShoppingCart,
    RefreshCw, Save, Trash2, Edit, Search, Filter, Printer,
    Eye, Download, ChevronDown, ChevronUp, Tag, Box, Truck,
    User, Smartphone, Monitor, Headphones, Tablet, Watch,
    ShoppingBag, Gift, Home, Wifi, Battery, Cpu
} from 'lucide-react';

const AddStock = () => {
    // États principaux
    const [mode, setMode] = useState('new'); // 'new' ou 'existing'
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [searchProduct, setSearchProduct] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showBulk, setShowBulk] = useState(false);
    const [bulkData, setBulkData] = useState('');
    const [showHistory, setShowHistory] = useState(false);

    // État pour nouveau produit
    const [newProduct, setNewProduct] = useState({
        nom: '',
        reference: '',
        categorie: '',
        description: '',
        prixAchat: '',
        prixVente: '',
        quantite: 1,
        stockMinimum: 5,
        stockMaximum: 100,
        fournisseur: '',
        marque: '',
        modele: '',
        couleur: '',
        taille: '',
        poids: '',
        codeBarre: '',
        emplacement: '',
        tva: 18,
        marge: 0,
        unite: 'unité'
    });

    // État pour ajout à produit existant
    const [existingProduct, setExistingProduct] = useState({
        produitId: '',
        quantite: 1,
        prixAchat: '',
        motif: 'Réapprovisionnement standard',
        fournisseur: '',
        factureRef: '',
        dateReception: new Date().toISOString().split('T')[0]
    });

    // Données mockées
    const categories = [
        'Informatique', 'Téléphonie', 'Audio', 'Tablettes', 'Montres',
        'Périphériques', 'Accessoires', 'Composants', 'Réseau', 'Gaming'
    ];

    const fournisseurs = [
        'HP Distribution', 'Samsung Bénin', 'Sony Africa', 'Apple Reseller',
        'Logitech Distribution', 'JBL Africa', 'ElectroTech', 'Huawei Bénin',
        'Dell Africa', 'Lenovo Bénin', 'Toshiba', 'Asus'
    ];

    const produitsExistants = [
        { id: 'PROD-001', nom: 'Ordinateur Portable HP EliteBook', stockActuel: 15, categorie: 'Informatique' },
        { id: 'PROD-002', nom: 'Smartphone Samsung Galaxy S23', stockActuel: 3, categorie: 'Téléphonie' },
        { id: 'PROD-003', nom: 'Écouteurs Bluetooth Sony WH-1000XM4', stockActuel: 0, categorie: 'Audio' },
        { id: 'PROD-004', nom: 'Tablette Apple iPad Air', stockActuel: 12, categorie: 'Tablettes' },
        { id: 'PROD-005', nom: 'Souris Gaming Logitech G Pro', stockActuel: 45, categorie: 'Périphériques' },
        { id: 'PROD-006', nom: 'Enceinte Portable JBL Charge 5', stockActuel: 7, categorie: 'Audio' },
        { id: 'PROD-007', nom: 'Câble USB-C 2m', stockActuel: 120, categorie: 'Accessoires' },
        { id: 'PROD-008', nom: 'Montre Connectée Huawei Watch GT3', stockActuel: 2, categorie: 'Montres' }
    ];

    // Historique des ajouts récents
    const historiqueMock = [
        { date: '2024-01-20 10:30', produit: 'Ordinateur Portable HP', quantite: 5, fournisseur: 'HP Distribution', facture: 'FACT-2024-00123' },
        { date: '2024-01-19 14:20', produit: 'Souris Gaming Logitech', quantite: 20, fournisseur: 'Logitech Distribution', facture: 'FACT-2024-00122' },
        { date: '2024-01-18 16:15', produit: 'Smartphone Samsung', quantite: 8, fournisseur: 'Samsung Bénin', facture: 'FACT-2024-00121' },
        { date: '2024-01-17 15:30', produit: 'Enceinte Portable JBL', quantite: 10, fournisseur: 'JBL Africa', facture: 'FACT-2024-00120' },
        { date: '2024-01-16 10:05', produit: 'Tablette Apple iPad', quantite: 12, fournisseur: 'Apple Reseller', facture: 'FACT-2024-00119' }
    ];

    // Référence pour l'upload d'images
    const fileInputRef = useRef(null);

    // Calculer la marge automatiquement
    useEffect(() => {
        if (newProduct.prixAchat && newProduct.prixVente) {
            const marge = ((newProduct.prixVente - newProduct.prixAchat) / newProduct.prixAchat * 100);
            setNewProduct(prev => ({
                ...prev,
                marge: Math.round(marge * 100) / 100
            }));
        }
    }, [newProduct.prixAchat, newProduct.prixVente]);

    // Générer une référence automatique
    const generateReference = () => {
        const prefix = selectedCategory ? selectedCategory.substring(0, 3).toUpperCase() : 'PROD';
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${prefix}-${random}`;
    };

    // Gérer l'upload d'images
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + uploadedImages.length > 5) {
            alert('Maximum 5 images autorisées');
            return;
        }
        
        const newImages = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            url: URL.createObjectURL(file),
            file
        }));
        
        setUploadedImages(prev => [...prev, ...newImages]);
    };

    // Supprimer une image
    const removeImage = (id) => {
        setUploadedImages(prev => prev.filter(img => img.id !== id));
    };

    // Scanner un code-barre (simulation)
    const simulateBarcodeScan = () => {
        setScanning(true);
        const barcodes = [
            '123456789012', '234567890123', '345678901234',
            '456789012345', '567890123456', '678901234567'
        ];
        const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
        
        setTimeout(() => {
            setNewProduct(prev => ({ ...prev, codeBarre: randomBarcode }));
            setScanning(false);
            setShowScanner(false);
            alert(`Code-barre scanné : ${randomBarcode}`);
        }, 1500);
    };

    // Ajouter un nouveau produit
    const handleAddNewProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation
        if (!newProduct.nom || !newProduct.reference || !newProduct.categorie) {
            alert('Veuillez remplir les champs obligatoires (nom, référence, catégorie)');
            setLoading(false);
            return;
        }

        // Simulation d'API
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Réinitialiser le formulaire
        setNewProduct({
            nom: '',
            reference: '',
            categorie: '',
            description: '',
            prixAchat: '',
            prixVente: '',
            quantite: 1,
            stockMinimum: 5,
            stockMaximum: 100,
            fournisseur: '',
            marque: '',
            modele: '',
            couleur: '',
            taille: '',
            poids: '',
            codeBarre: '',
            emplacement: '',
            tva: 18,
            marge: 0,
            unite: 'unité'
        });
        setUploadedImages([]);
        setSelectedCategory('');
        
        setSuccess(true);
        setLoading(false);
        
        // Cacher le message de succès après 5 secondes
        setTimeout(() => setSuccess(false), 5000);
    };

    // Ajouter à un produit existant
    const handleAddToExisting = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!existingProduct.produitId || !existingProduct.quantite) {
            alert('Veuillez sélectionner un produit et spécifier une quantité');
            setLoading(false);
            return;
        }

        // Simulation d'API
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Réinitialiser
        setExistingProduct({
            produitId: '',
            quantite: 1,
            prixAchat: '',
            motif: 'Réapprovisionnement standard',
            fournisseur: '',
            factureRef: '',
            dateReception: new Date().toISOString().split('T')[0]
        });
        setSelectedProduct(null);
        
        setSuccess(true);
        setLoading(false);
        
        setTimeout(() => setSuccess(false), 5000);
    };

    // Importer en masse
    const handleBulkImport = () => {
        const lines = bulkData.split('\n').filter(line => line.trim());
        const imported = lines.length;
        
        alert(`${imported} produits importés avec succès !`);
        setBulkData('');
        setShowBulk(false);
    };

    // Format CSV pour l'import
    const bulkTemplate = `nom,référence,catégorie,prixAchat,prixVente,quantité,fournisseur
Ordinateur Portable HP EliteBook,HP-ELITE-X360,Informatique,600000,899900,5,HP Distribution
Smartphone Samsung Galaxy S23,SAMSUNG-GS23,Téléphonie,450000,699900,10,Samsung Bénin
Écouteurs Bluetooth Sony,SONY-WH1000XM4,Audio,120000,199900,20,Sony Africa`;

    // Obtenir l'icône de catégorie
    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Informatique': return <Monitor className="w-4 h-4" />;
            case 'Téléphonie': return <Smartphone className="w-4 h-4" />;
            case 'Audio': return <Headphones className="w-4 h-4" />;
            case 'Tablettes': return <Tablet className="w-4 h-4" />;
            case 'Montres': return <Watch className="w-4 h-4" />;
            case 'Périphériques': return <Mouse className="w-4 h-4" />;
            case 'Accessoires': return <Gift className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Ajouter au Stock</h1>
                                <p className="text-sm text-gray-600">Ajouter de nouveaux produits ou réapprovisionner</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium flex items-center gap-2"
                            >
                                <Eye className="w-4 h-4" />
                                Historique
                            </button>
                            <button
                                onClick={() => setShowBulk(true)}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                Import CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message de succès */}
            {success && (
                <div className="container mx-auto px-4 py-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                            <p className="font-medium text-green-800">Succès !</p>
                            <p className="text-sm text-green-700">
                                Le produit a été ajouté au stock avec succès.
                            </p>
                        </div>
                        <button
                            onClick={() => setSuccess(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Sélecteur de mode */}
                <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => setMode('new')}
                            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                mode === 'new'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            Nouveau Produit
                        </button>
                        <button
                            onClick={() => setMode('existing')}
                            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                                mode === 'existing'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Package className="w-4 h-4" />
                            Produit Existant
                        </button>
                    </div>
                </div>

                {/* Formulaire Nouveau Produit */}
                {mode === 'new' ? (
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" />
                                Nouveau Produit
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Remplissez les informations du nouveau produit à ajouter au stock
                            </p>
                        </div>

                        <form onSubmit={handleAddNewProduct} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Colonne 1: Informations de base */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom du produit *
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.nom}
                                            onChange={(e) => setNewProduct({...newProduct, nom: e.target.value})}
                                            placeholder="Ex: Ordinateur Portable HP EliteBook"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Référence *
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={newProduct.reference}
                                                    onChange={(e) => setNewProduct({...newProduct, reference: e.target.value})}
                                                    placeholder="Ex: HP-ELITE-X360"
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewProduct({...newProduct, reference: generateReference()})}
                                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                                    title="Générer une référence"
                                                >
                                                    <RefreshCw className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Catégorie *
                                            </label>
                                            <select
                                                value={newProduct.categorie}
                                                onChange={(e) => {
                                                    setNewProduct({...newProduct, categorie: e.target.value});
                                                    setSelectedCategory(e.target.value);
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                required
                                            >
                                                <option value="">Sélectionner</option>
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                                            placeholder="Description détaillée du produit..."
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                        />
                                    </div>

                                    {/* Images */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Images du produit
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                            <div className="flex flex-col items-center justify-center">
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600 mb-2">
                                                    Glissez-déposez vos images ou
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                                                >
                                                    Parcourir
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleImageUpload}
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                />
                                                <p className="text-xs text-gray-500 mt-2">
                                                    PNG, JPG, GIF jusqu'à 5MB
                                                </p>
                                            </div>
                                        </div>

                                        {/* Images prévisualisées */}
                                        {uploadedImages.length > 0 && (
                                            <div className="mt-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {uploadedImages.map((image) => (
                                                        <div key={image.id} className="relative">
                                                            <img
                                                                src={image.url}
                                                                alt={image.name}
                                                                className="w-20 h-20 object-cover rounded border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(image.id)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Colonne 2: Prix et stock */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix d'achat (FCFA) *
                                            </label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={newProduct.prixAchat}
                                                    onChange={(e) => setNewProduct({...newProduct, prixAchat: e.target.value})}
                                                    placeholder="0"
                                                    min="0"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prix de vente (FCFA) *
                                            </label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    value={newProduct.prixVente}
                                                    onChange={(e) => setNewProduct({...newProduct, prixVente: e.target.value})}
                                                    placeholder="0"
                                                    min="0"
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {newProduct.marge > 0 && (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Marge:</span>
                                                <span className={`text-lg font-bold ${newProduct.marge >= 30 ? 'text-green-600' : newProduct.marge >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {newProduct.marge}%
                                                </span>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                Marge = ((Prix vente - Prix achat) / Prix achat) × 100
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantité *
                                            </label>
                                            <input
                                                type="number"
                                                value={newProduct.quantite}
                                                onChange={(e) => setNewProduct({...newProduct, quantite: e.target.value})}
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock min
                                            </label>
                                            <input
                                                type="number"
                                                value={newProduct.stockMinimum}
                                                onChange={(e) => setNewProduct({...newProduct, stockMinimum: e.target.value})}
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock max
                                            </label>
                                            <input
                                                type="number"
                                                value={newProduct.stockMaximum}
                                                onChange={(e) => setNewProduct({...newProduct, stockMaximum: e.target.value})}
                                                min="1"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fournisseur
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={newProduct.fournisseur}
                                                onChange={(e) => setNewProduct({...newProduct, fournisseur: e.target.value})}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Sélectionner</option>
                                                {fournisseurs.map((fourn) => (
                                                    <option key={fourn} value={fourn}>
                                                        {fourn}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                                title="Nouveau fournisseur"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Code-barre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Code-barre
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newProduct.codeBarre}
                                                onChange={(e) => setNewProduct({...newProduct, codeBarre: e.target.value})}
                                                placeholder="Scannez ou entrez manuellement"
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowScanner(true)}
                                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                                title="Scanner un code-barre"
                                            >
                                                <Barcode className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Colonne 3: Caractéristiques avancées */}
                                <div className="space-y-6">
                                    {/* Bouton pour afficher/masquer les options avancées */}
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-700"
                                    >
                                        {showAdvanced ? (
                                            <>
                                                <ChevronUp className="w-4 h-4" />
                                                Masquer les options avancées
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4" />
                                                Afficher les options avancées
                                            </>
                                        )}
                                    </button>

                                    {showAdvanced && (
                                        <div className="space-y-4 animate-fadeIn">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Marque
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.marque}
                                                        onChange={(e) => setNewProduct({...newProduct, marque: e.target.value})}
                                                        placeholder="Ex: HP, Samsung"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Modèle
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.modele}
                                                        onChange={(e) => setNewProduct({...newProduct, modele: e.target.value})}
                                                        placeholder="Ex: EliteBook X360"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Couleur
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.couleur}
                                                        onChange={(e) => setNewProduct({...newProduct, couleur: e.target.value})}
                                                        placeholder="Ex: Noir, Argent"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Unité
                                                    </label>
                                                    <select
                                                        value={newProduct.unite}
                                                        onChange={(e) => setNewProduct({...newProduct, unite: e.target.value})}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="unité">Unité</option>
                                                        <option value="paquet">Paquet</option>
                                                        <option value="carton">Carton</option>
                                                        <option value="mètre">Mètre</option>
                                                        <option value="kg">Kilogramme</option>
                                                        <option value="litre">Litre</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        TVA (%)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={newProduct.tva}
                                                        onChange={(e) => setNewProduct({...newProduct, tva: e.target.value})}
                                                        min="0"
                                                        max="100"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Emplacement
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.emplacement}
                                                        onChange={(e) => setNewProduct({...newProduct, emplacement: e.target.value})}
                                                        placeholder="Ex: Rayon A, Étage 2"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Dimensions
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newProduct.taille}
                                                        onChange={(e) => setNewProduct({...newProduct, taille: e.target.value})}
                                                        placeholder="Ex: 30x20x5 cm"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Poids (kg)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={newProduct.poids}
                                                        onChange={(e) => setNewProduct({...newProduct, poids: e.target.value})}
                                                        placeholder="Ex: 1.5"
                                                        step="0.1"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Ajouter au Stock
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewProduct({
                                            nom: '',
                                            reference: '',
                                            categorie: '',
                                            description: '',
                                            prixAchat: '',
                                            prixVente: '',
                                            quantite: 1,
                                            stockMinimum: 5,
                                            stockMaximum: 100,
                                            fournisseur: '',
                                            marque: '',
                                            modele: '',
                                            couleur: '',
                                            taille: '',
                                            poids: '',
                                            codeBarre: '',
                                            emplacement: '',
                                            tva: 18,
                                            marge: 0,
                                            unite: 'unité'
                                        });
                                        setUploadedImages([]);
                                    }}
                                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg"
                                >
                                    Réinitialiser
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* Formulaire Produit Existant */
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-green-600" />
                                Réapprovisionner un Produit
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Ajouter des quantités à un produit déjà existant dans le stock
                            </p>
                        </div>

                        <form onSubmit={handleAddToExisting} className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Colonne gauche: Sélection du produit */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Rechercher un produit *
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={searchProduct}
                                                onChange={(e) => setSearchProduct(e.target.value)}
                                                placeholder="Nom, référence ou catégorie..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Liste des produits */}
                                    <div className="border rounded-lg max-h-80 overflow-y-auto">
                                        {produitsExistants
                                            .filter(prod => 
                                                prod.nom.toLowerCase().includes(searchProduct.toLowerCase()) ||
                                                prod.id.toLowerCase().includes(searchProduct.toLowerCase()) ||
                                                prod.categorie.toLowerCase().includes(searchProduct.toLowerCase())
                                            )
                                            .map((produit) => (
                                                <div
                                                    key={produit.id}
                                                    onClick={() => {
                                                        setSelectedProduct(produit);
                                                        setExistingProduct({
                                                            ...existingProduct,
                                                            produitId: produit.id
                                                        });
                                                    }}
                                                    className={`p-4 border-b cursor-pointer transition-colors ${
                                                        selectedProduct?.id === produit.id
                                                        ? 'bg-blue-50 border-blue-200'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                {getCategoryIcon(produit.categorie)}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {produit.nom}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {produit.id} • Stock: {produit.stockActuel}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {selectedProduct?.id === produit.id && (
                                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                {/* Colonne droite: Détails de l'ajout */}
                                <div className="space-y-6">
                                    {selectedProduct ? (
                                        <>
                                            {/* Résumé du produit sélectionné */}
                                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            {getCategoryIcon(selectedProduct.categorie)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">
                                                                {selectedProduct.nom}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {selectedProduct.id} • {selectedProduct.categorie}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {selectedProduct.stockActuel}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Stock actuel</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Après l'ajout: <span className="font-bold text-green-600">
                                                        {selectedProduct.stockActuel + parseInt(existingProduct.quantite || 0)}
                                                    </span> unités
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Quantité à ajouter *
                                                </label>
                                                <input
                                                    type="number"
                                                    value={existingProduct.quantite}
                                                    onChange={(e) => setExistingProduct({
                                                        ...existingProduct,
                                                        quantite: e.target.value
                                                    })}
                                                    min="1"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Prix d'achat unitaire (FCFA)
                                                </label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        value={existingProduct.prixAchat}
                                                        onChange={(e) => setExistingProduct({
                                                            ...existingProduct,
                                                            prixAchat: e.target.value
                                                        })}
                                                        placeholder="Prix d'achat actuel"
                                                        min="0"
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Motif de l'ajout
                                                </label>
                                                <textarea
                                                    value={existingProduct.motif}
                                                    onChange={(e) => setExistingProduct({
                                                        ...existingProduct,
                                                        motif: e.target.value
                                                    })}
                                                    rows="2"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Fournisseur
                                                    </label>
                                                    <select
                                                        value={existingProduct.fournisseur}
                                                        onChange={(e) => setExistingProduct({
                                                            ...existingProduct,
                                                            fournisseur: e.target.value
                                                        })}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    >
                                                        <option value="">Sélectionner</option>
                                                        {fournisseurs.map((fourn) => (
                                                            <option key={fourn} value={fourn}>
                                                                {fourn}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Réf. Facture
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={existingProduct.factureRef}
                                                        onChange={(e) => setExistingProduct({
                                                            ...existingProduct,
                                                            factureRef: e.target.value
                                                        })}
                                                        placeholder="Ex: FACT-2024-00123"
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Date de réception
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="date"
                                                        value={existingProduct.dateReception}
                                                        onChange={(e) => setExistingProduct({
                                                            ...existingProduct,
                                                            dateReception: e.target.value
                                                        })}
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Package className="w-12 h-12 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Sélectionnez un produit
                                            </h3>
                                            <p className="text-gray-600 max-w-sm">
                                                Recherchez et sélectionnez un produit existant dans la liste à gauche pour ajouter des quantités.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || !selectedProduct}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Ajouter au Stock
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setExistingProduct({
                                            produitId: '',
                                            quantite: 1,
                                            prixAchat: '',
                                            motif: 'Réapprovisionnement standard',
                                            fournisseur: '',
                                            factureRef: '',
                                            dateReception: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                    className="px-6 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Modal Scanner */}
            {showScanner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Scanner Code-barre</h2>
                                    <p className="text-sm text-gray-600">Placez le code-barre devant la caméra</p>
                                </div>
                                <button 
                                    onClick={() => setShowScanner(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="bg-black rounded-lg p-8 flex flex-col items-center justify-center mb-6">
                                <div className="w-48 h-32 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center mb-4">
                                    {scanning ? (
                                        <div className="text-center">
                                            <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-2" />
                                            <p className="text-white text-sm">Scan en cours...</p>
                                        </div>
                                    ) : (
                                        <Barcode className="w-12 h-12 text-white/50" />
                                    )}
                                </div>
                                <p className="text-white/70 text-sm text-center">
                                    {scanning ? 'Scannez le code-barre...' : 'Prêt à scanner'}
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={simulateBarcodeScan}
                                    disabled={scanning}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                                >
                                    {scanning ? 'Scan en cours...' : 'Simuler le scan'}
                                </button>
                                <button
                                    onClick={() => setShowScanner(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Import CSV */}
            {showBulk && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Import en Masse</h2>
                                    <p className="text-gray-600">Importez plusieurs produits via un fichier CSV</p>
                                </div>
                                <button 
                                    onClick={() => setShowBulk(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-6">
                                {/* Instructions */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-medium text-blue-900 mb-2">Instructions</h3>
                                    <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                                        <li>Téléchargez le template pour voir le format requis</li>
                                        <li>Les champs marqués d'un * sont obligatoires</li>
                                        <li>Utilisez une ligne par produit</li>
                                        <li>Les montants doivent être en FCFA sans espaces</li>
                                    </ul>
                                </div>
                                
                                {/* Template */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Template CSV
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => navigator.clipboard.writeText(bulkTemplate)}
                                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            <Copy className="w-3 h-3" />
                                            Copier
                                        </button>
                                    </div>
                                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                                        {bulkTemplate}
                                    </pre>
                                </div>
                                
                                {/* Zone de texte */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Coller vos données CSV ici
                                    </label>
                                    <textarea
                                        value={bulkData}
                                        onChange={(e) => setBulkData(e.target.value)}
                                        placeholder="Collez ou tapez vos données au format CSV..."
                                        rows="10"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none font-mono text-sm"
                                    />
                                </div>
                                
                                {/* Upload fichier */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ou uploader un fichier
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-2">
                                            Glissez-déposez votre fichier CSV ici
                                        </p>
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
                                            Parcourir les fichiers
                                        </button>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Taille maximale: 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={handleBulkImport}
                                    disabled={!bulkData.trim()}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium"
                                >
                                    Importer {bulkData.split('\n').filter(l => l.trim()).length} produits
                                </button>
                                <button
                                    onClick={() => setShowBulk(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Historique des ajouts */}
            {showHistory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Historique des Ajouts</h2>
                                    <p className="text-gray-600">Derniers ajouts au stock</p>
                                </div>
                                <button 
                                    onClick={() => setShowHistory(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Produit
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantité
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fournisseur
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Facture
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {historiqueMock.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{item.date}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{item.produit}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                        +{item.quantite}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{item.fournisseur}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-blue-600">{item.facture}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowHistory(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Gestion des Stocks - Module d'Ajout</p>
                        <p className="mt-1">
                            Mode: {mode === 'new' ? 'Nouveau Produit' : 'Produit Existant'} | 
                            <span className="text-blue-600 ml-2">
                                Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
                            </span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Styles CSS pour animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// Composant Mouse manquant
const Mouse = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    </svg>
);

// Composant Copy manquant
const Copy = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export default AddStock;