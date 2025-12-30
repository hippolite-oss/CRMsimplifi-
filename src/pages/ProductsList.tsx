import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Package,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Printer,
  Download,
  PlusCircle,
  RefreshCw,
  BarChart3,
  ShoppingBag,
  Hash,
  Tag,
  DollarSign,
  Box,
  Layers,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Grid,
  List,
  PackagePlus,
  Zap,
  Battery,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductsList = () => {
  const navigate = useNavigate();

  // États principaux
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategorie, setFilterCategorie] = useState("tous");
  const [filterStock, setFilterStock] = useState("tous");
  const [filterStatus, setFilterStatus] = useState("tous");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("nom");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [showDetails, setShowDetails] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  // Données mockées pour les produits
  const produitsMock = [
    {
      id: 1,
      code: "PROD-001",
      nom: "Ordinateur Portable Dell XPS 13",
      categorie: "Informatique",
      sousCategorie: "Ordinateurs",
      prixAchat: 650000,
      prixVente: 899900,
      stock: 8,
      stockMin: 5,
      stockMax: 20,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      fournisseur: "Dell Technologies",
      dateAjout: "2024-01-15",
      dernierAchat: "2024-01-20",
      ventesMois: 12,
      marge: 38.4,
    },
    {
      id: 2,
      code: "PROD-002",
      nom: "Smartphone Samsung Galaxy S23",
      categorie: "Téléphonie",
      sousCategorie: "Smartphones",
      prixAchat: 280000,
      prixVente: 349900,
      stock: 15,
      stockMin: 10,
      stockMax: 30,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w-400",
      fournisseur: "Samsung",
      dateAjout: "2024-01-10",
      dernierAchat: "2024-01-25",
      ventesMois: 24,
      marge: 25.0,
    },
    {
      id: 3,
      code: "PROD-003",
      nom: "Écouteurs Bluetooth Sony WH-1000XM4",
      categorie: "Audio",
      sousCategorie: "Écouteurs",
      prixAchat: 60000,
      prixVente: 79900,
      stock: 45,
      stockMin: 20,
      stockMax: 50,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      fournisseur: "Sony",
      dateAjout: "2024-01-05",
      dernierAchat: "2024-01-28",
      ventesMois: 18,
      marge: 33.2,
    },
    {
      id: 4,
      code: "PROD-004",
      nom: "Montre Connectée Apple Watch Series 8",
      categorie: "Wearable",
      sousCategorie: "Montres",
      prixAchat: 165000,
      prixVente: 199900,
      stock: 3,
      stockMin: 5,
      stockMax: 15,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1434493650001-5d43a6fea0a7?w=400",
      fournisseur: "Apple",
      dateAjout: "2024-01-20",
      dernierAchat: "2024-01-22",
      ventesMois: 8,
      marge: 21.2,
    },
    {
      id: 5,
      code: "PROD-005",
      nom: "Tablette iPad Pro 12.9",
      categorie: "Informatique",
      sousCategorie: "Tablettes",
      prixAchat: 375000,
      prixVente: 449900,
      stock: 12,
      stockMin: 8,
      stockMax: 25,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      fournisseur: "Apple",
      dateAjout: "2024-01-12",
      dernierAchat: "2024-01-18",
      ventesMois: 15,
      marge: 20.0,
    },
    {
      id: 6,
      code: "PROD-006",
      nom: "Enceinte Bluetooth JBL Flip 6",
      categorie: "Audio",
      sousCategorie: "Enceintes",
      prixAchat: 95000,
      prixVente: 129900,
      stock: 25,
      stockMin: 15,
      stockMax: 40,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400",
      fournisseur: "JBL",
      dateAjout: "2024-01-08",
      dernierAchat: "2024-01-30",
      ventesMois: 22,
      marge: 36.8,
    },
    {
      id: 7,
      code: "PROD-007",
      nom: "Clavier Mécanique Logitech G Pro",
      categorie: "Informatique",
      sousCategorie: "Périphériques",
      prixAchat: 65000,
      prixVente: 89900,
      stock: 35,
      stockMin: 20,
      stockMax: 50,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400",
      fournisseur: "Logitech",
      dateAjout: "2024-01-14",
      dernierAchat: "2024-01-26",
      ventesMois: 14,
      marge: 38.3,
    },
    {
      id: 8,
      code: "PROD-008",
      nom: "Souris Gaming Razer DeathAdder V2",
      categorie: "Informatique",
      sousCategorie: "Périphériques",
      prixAchat: 45000,
      prixVente: 59900,
      stock: 0,
      stockMin: 10,
      stockMax: 30,
      unite: "unité",
      tva: 18,
      statut: "inactif",
      image:
        "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400",
      fournisseur: "Razer",
      dateAjout: "2024-01-03",
      dernierAchat: "2024-01-10",
      ventesMois: 0,
      marge: 33.1,
    },
    {
      id: 9,
      code: "PROD-009",
      nom: "Webcam Logitech C920",
      categorie: "Informatique",
      sousCategorie: "Accessoires",
      prixAchat: 40000,
      prixVente: 54900,
      stock: 2,
      stockMin: 5,
      stockMax: 20,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
      fournisseur: "Logitech",
      dateAjout: "2024-01-25",
      dernierAchat: "2024-01-27",
      ventesMois: 6,
      marge: 37.3,
    },
    {
      id: 10,
      code: "PROD-010",
      nom: "Disque Dur Externe Seagate 2TB",
      categorie: "Informatique",
      sousCategorie: "Stockage",
      prixAchat: 80000,
      prixVente: 109900,
      stock: 18,
      stockMin: 10,
      stockMax: 25,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1581344983112-6d4b4c59e11b?w=400",
      fournisseur: "Seagate",
      dateAjout: "2024-01-17",
      dernierAchat: "2024-01-29",
      ventesMois: 9,
      marge: 37.4,
    },
    {
      id: 11,
      code: "PROD-011",
      nom: "Chargeur Sans Fil Samsung 15W",
      categorie: "Accessoires",
      sousCategorie: "Chargeurs",
      prixAchat: 15000,
      prixVente: 24900,
      stock: 60,
      stockMin: 30,
      stockMax: 100,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
      fournisseur: "Samsung",
      dateAjout: "2024-01-22",
      dernierAchat: "2024-01-24",
      ventesMois: 32,
      marge: 66.0,
    },
    {
      id: 12,
      code: "PROD-012",
      nom: "Câble USB-C 2m Anker Powerline",
      categorie: "Accessoires",
      sousCategorie: "Câbles",
      prixAchat: 5000,
      prixVente: 8900,
      stock: 120,
      stockMin: 50,
      stockMax: 200,
      unite: "unité",
      tva: 18,
      statut: "actif",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      fournisseur: "Anker",
      dateAjout: "2024-01-04",
      dernierAchat: "2024-01-26",
      ventesMois: 45,
      marge: 78.0,
    },
  ];

  // Catégories disponibles
  const categories = [
    "tous",
    "Informatique",
    "Téléphonie",
    "Audio",
    "Wearable",
    "Accessoires",
  ];

  // Initialisation des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProduits(produitsMock);
      calculerStats(produitsMock);
      setLoading(false);
    }, 800);
  }, []);

  // Calculer les statistiques
  const calculerStats = (produitsList) => {
    const total = produitsList.length;
    const lowStock = produitsList.filter(
      (p) => p.stock > 0 && p.stock <= p.stockMin
    ).length;
    const outOfStock = produitsList.filter((p) => p.stock === 0).length;
    const totalValue = produitsList.reduce(
      (sum, p) => sum + p.prixVente * p.stock,
      0
    );

    setStats({
      total,
      lowStock,
      outOfStock,
      totalValue,
    });
  };

  // Filtrer et trier les produits
  const produitsFiltres = useMemo(() => {
    let filtered = [...produits];

    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.nom.toLowerCase().includes(search.toLowerCase()) ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.categorie.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (filterCategorie !== "tous") {
      filtered = filtered.filter((p) => p.categorie === filterCategorie);
    }

    // Filtre par stock
    if (filterStock !== "tous") {
      if (filterStock === "en_stock") {
        filtered = filtered.filter((p) => p.stock > p.stockMin);
      } else if (filterStock === "stock_faible") {
        filtered = filtered.filter((p) => p.stock > 0 && p.stock <= p.stockMin);
      } else if (filterStock === "rupture") {
        filtered = filtered.filter((p) => p.stock === 0);
      }
    }

    // Filtre par statut
    if (filterStatus !== "tous") {
      filtered = filtered.filter((p) => p.statut === filterStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "nom":
          aVal = a.nom.toLowerCase();
          bVal = b.nom.toLowerCase();
          break;
        case "prix":
          aVal = a.prixVente;
          bVal = b.prixVente;
          break;
        case "stock":
          aVal = a.stock;
          bVal = b.stock;
          break;
        case "ventes":
          aVal = a.ventesMois;
          bVal = b.ventesMois;
          break;
        case "marge":
          aVal = a.marge;
          bVal = b.marge;
          break;
        default:
          aVal = a.nom.toLowerCase();
          bVal = b.nom.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    produits,
    search,
    filterCategorie,
    filterStock,
    filterStatus,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(produitsFiltres.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const produitsPagines = produitsFiltres.slice(startIndex, endIndex);

  // Fonctions utilitaires
  const getStockStatus = (stock, stockMin) => {
    if (stock === 0) {
      return {
        color: "bg-red-100 text-red-800",
        text: "Rupture",
        icon: <XCircle className="w-4 h-4" />,
      };
    } else if (stock <= stockMin) {
      return {
        color: "bg-yellow-100 text-yellow-800",
        text: "Stock faible",
        icon: <AlertTriangle className="w-4 h-4" />,
      };
    } else {
      return {
        color: "bg-green-100 text-green-800",
        text: "En stock",
        icon: <CheckCircle className="w-4 h-4" />,
      };
    }
  };

  const getMargeColor = (marge) => {
    if (marge >= 50) return "text-green-600";
    if (marge >= 30) return "text-blue-600";
    if (marge >= 20) return "text-yellow-600";
    return "text-red-600";
  };

  const handleSelectProduct = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pId) => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === produitsPagines.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(produitsPagines.map((p) => p.id));
    }
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProduits(produits.filter((p) => p.id !== productToDelete.id));
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(produitsFiltres, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `produits_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const navigateToNewProduct = () => {
    navigate("/produits/nouveau");
  };

  const navigateToEdit = (id) => {
    navigate(`/produits/${id}/edit`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Catalogue Produits
                </h1>
                <p className="text-sm text-gray-600">
                  {stats.total} produits référencés
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={navigateToNewProduct}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" />
                Nouveau Produit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Produits</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Box className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Valeur Stock</p>
                <p className="text-lg font-bold text-gray-900">
                  {(stats.totalValue / 1000).toFixed(0)}K F
                </p>
              </div>
              <div className="p-1.5 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Stock Faible</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.lowStock}
                </p>
              </div>
              <div className="p-1.5 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">En Rupture</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.outOfStock}
                </p>
              </div>
              <div className="p-1.5 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, code ou catégorie..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Contrôles */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Mode de vue */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-white shadow" : ""
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-white shadow" : ""
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filtres */}
              <div className="flex flex-wrap gap-2 flex-1">
                <select
                  value={filterCategorie}
                  onChange={(e) => setFilterCategorie(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "tous" ? "Toutes catégories" : cat}
                    </option>
                  ))}
                </select>

                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                >
                  <option value="tous">Tous les stocks</option>
                  <option value="en_stock">En stock</option>
                  <option value="stock_faible">Stock faible</option>
                  <option value="rupture">Rupture</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm"
                >
                  <option value="tous">Tous statuts</option>
                  <option value="actif">Actifs</option>
                  <option value="inactif">Inactifs</option>
                </select>

                <button
                  onClick={() => {
                    setSearch("");
                    setFilterCategorie("tous");
                    setFilterStock("tous");
                    setFilterStatus("tous");
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Réinitialiser</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions groupe */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                {selectedProducts.length} produit
                {selectedProducts.length > 1 ? "s" : ""} sélectionné
                {selectedProducts.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                Activer
              </button>
              <button className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">
                Désactiver
              </button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                Supprimer
              </button>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : viewMode === "grid" ? (
          /* Vue Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {produitsPagines.map((produit) => {
              const stockStatus = getStockStatus(
                produit.stock,
                produit.stockMin
              );
              return (
                <div
                  key={produit.id}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={produit.image}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(produit.id)}
                        onChange={() => handleSelectProduct(produit.id)}
                        className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-blue-600"
                      />
                    </div>
                    <div
                      className={`absolute top-2 left-2 px-1.5 py-1 rounded-full text-xs font-medium ${stockStatus.color} flex items-center gap-1`}
                    >
                      {stockStatus.icon}
                      <span className="hidden sm:inline">
                        {stockStatus.text}
                      </span>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {produit.nom}
                        </h3>
                        <p className="text-sm text-gray-600">{produit.code}</p>
                      </div>
                      {produit.statut === "actif" ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Inactif
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600">
                        {produit.categorie} • {produit.sousCategorie}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-gray-600">Prix</p>
                        <p className="font-bold text-blue-600">
                          {produit.prixVente.toLocaleString()} F
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Stock</p>
                        <p className="font-bold">
                          {produit.stock} {produit.unite}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Marge</p>
                        <p
                          className={`text-sm font-bold ${getMargeColor(
                            produit.marge
                          )}`}
                        >
                          {produit.marge}%
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedProduct(produit);
                            setShowDetails(true);
                          }}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigateToEdit(produit.id)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(produit)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Vue Tableau */
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === produitsPagines.length &&
                          produitsPagines.length > 0
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                      />
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort("nom")}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Produit
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      <button
                        onClick={() => handleSort("prix")}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Prix
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      <button
                        onClick={() => handleSort("stock")}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Stock
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Catégorie
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      <button
                        onClick={() => handleSort("marge")}
                        className="flex items-center gap-1 hover:text-gray-700"
                      >
                        Marge
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {produitsPagines.map((produit) => {
                    const stockStatus = getStockStatus(
                      produit.stock,
                      produit.stockMin
                    );
                    return (
                      <tr key={produit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(produit.id)}
                            onChange={() => handleSelectProduct(produit.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={produit.image}
                                alt={produit.nom}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {produit.nom}
                              </div>
                              <div className="text-sm text-gray-500">
                                {produit.code}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-blue-600">
                            {produit.prixVente.toLocaleString()} F
                          </div>
                          <div className="text-xs text-gray-500">
                            {produit.prixAchat.toLocaleString()} F achat
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${stockStatus.color}`}
                            >
                              {stockStatus.icon}
                              {produit.stock} {produit.unite}
                            </div>
                            <div className="text-xs text-gray-500">
                              Min: {produit.stockMin}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {produit.categorie}
                          </div>
                          <div className="text-xs text-gray-500">
                            {produit.sousCategorie}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`font-bold ${getMargeColor(
                              produit.marge
                            )}`}
                          >
                            {produit.marge}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {produit.ventesMois} ventes/mois
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {produit.statut === "actif" ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Actif
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Inactif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedProduct(produit);
                                setShowDetails(true);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigateToEdit(produit.id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(produit)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Affichage de {startIndex + 1} à{" "}
                {Math.min(endIndex, produitsFiltres.length)} sur{" "}
                {produitsFiltres.length} produits
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Confirmation Suppression */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Confirmer la suppression
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cette action est irréversible
                  </p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="font-medium text-red-900">
                  Êtes-vous sûr de vouloir supprimer ce produit ?
                </p>
                <p className="text-red-700 mt-1">{productToDelete.nom}</p>
                <p className="text-sm text-red-600 mt-2">
                  Code: {productToDelete.code}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setProductToDelete(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails Produit */}
      {showDetails && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedProduct.nom}
                  </h2>
                  <p className="text-gray-600">Code: {selectedProduct.code}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image et statut */}
                <div>
                  <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    {getStockStatus(
                      selectedProduct.stock,
                      selectedProduct.stockMin
                    ).icon && (
                      <div
                        className={`p-3 rounded-lg flex items-center gap-3 ${
                          getStockStatus(
                            selectedProduct.stock,
                            selectedProduct.stockMin
                          ).color
                        }`}
                      >
                        {
                          getStockStatus(
                            selectedProduct.stock,
                            selectedProduct.stockMin
                          ).icon
                        }
                        <div>
                          <p className="font-medium">Statut stock</p>
                          <p>
                            {
                              getStockStatus(
                                selectedProduct.stock,
                                selectedProduct.stockMin
                              ).text
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Statut produit</p>
                      <p className="font-medium">
                        {selectedProduct.statut === "actif"
                          ? "Actif"
                          : "Inactif"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations principales */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Informations générales
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Catégorie</p>
                          <p className="font-medium">
                            {selectedProduct.categorie}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Sous-catégorie
                          </p>
                          <p className="font-medium">
                            {selectedProduct.sousCategorie}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Unité</p>
                          <p className="font-medium">{selectedProduct.unite}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Fournisseur</p>
                          <p className="font-medium">
                            {selectedProduct.fournisseur}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">
                        Prix et stock
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Prix d'achat</p>
                          <p className="font-medium">
                            {selectedProduct.prixAchat.toLocaleString()} F
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Prix de vente</p>
                          <p className="font-bold text-blue-600">
                            {selectedProduct.prixVente.toLocaleString()} F
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Marge</p>
                          <p
                            className={`font-bold ${getMargeColor(
                              selectedProduct.marge
                            )}`}
                          >
                            {selectedProduct.marge}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">TVA</p>
                          <p className="font-medium">{selectedProduct.tva}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stock détaillé */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Gestion du stock
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Stock actuel</p>
                        <p className="text-xl font-bold">
                          {selectedProduct.stock} {selectedProduct.unite}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stock minimum</p>
                        <p className="text-lg font-medium">
                          {selectedProduct.stockMin} {selectedProduct.unite}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Stock maximum</p>
                        <p className="text-lg font-medium">
                          {selectedProduct.stockMax} {selectedProduct.unite}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Performances */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Performances
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Ventes ce mois</p>
                        <p className="text-xl font-bold text-blue-600">
                          {selectedProduct.ventesMois}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">Date d'ajout</p>
                        <p className="text-lg font-medium text-green-600">
                          {selectedProduct.dateAjout}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => navigateToEdit(selectedProduct.id)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
              >
                Modifier le produit
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
            <p>© 2024 Catalogue Produits - {stats.total} produits référencés</p>
            <p className="mt-1">
              Valeur totale du stock: {stats.totalValue.toLocaleString()} F
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductsList;
