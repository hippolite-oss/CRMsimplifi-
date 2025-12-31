// src/pages/NewSales.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Trash2,
  DollarSign,
  CreditCard,
  Phone,
  CheckCircle,
  Loader2,
  Package,
  Plus,
  Minus,
  X,
  Truck,
  Printer,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const NewSales = () => {
  // États principaux
  const [panier, setPanier] = useState([]);
  const [clientSelectionne, setClientSelectionne] = useState(null);
  const [searchProduit, setSearchProduit] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [montantPaye, setMontantPaye] = useState("");
  const [fraisTransport, setFraisTransport] = useState(0);
  const [modePaiement, setModePaiement] = useState("especes");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showModalClient, setShowModalClient] = useState(false);
  const [showFacture, setShowFacture] = useState(false);

  // Données simplifiées pour les produits
  const produits = [
    {
      id: 1,
      nom: "Ordinateur Portable",
      prix: 899900,
      categorie: "informatique",
      stock: 15,
    },
    {
      id: 2,
      nom: "Smartphone Android",
      prix: 349900,
      categorie: "téléphonie",
      stock: 25,
    },
    {
      id: 3,
      nom: "Écouteurs Bluetooth",
      prix: 79900,
      categorie: "audio",
      stock: 50,
    },
    {
      id: 4,
      nom: "Montre Connectée",
      prix: 199900,
      categorie: "wearable",
      stock: 20,
    },
    {
      id: 5,
      nom: "Tablette Android",
      prix: 449900,
      categorie: "informatique",
      stock: 12,
    },
    {
      id: 6,
      nom: "Enceinte Portable",
      prix: 129900,
      categorie: "audio",
      stock: 30,
    },
  ];

  // Clients
  const clients = [
    { id: 1, nom: "Dupont", prenom: "Jean", telephone: "+229 12 34 56 78" },
    { id: 2, nom: "Martin", prenom: "Marie", telephone: "+229 23 45 67 89" },
    { id: 3, nom: "Bernard", prenom: "Pierre", telephone: "+229 34 56 78 90" },
  ];

  // Références
  const produitInputRef = useRef(null);

  // Modes de paiement
  const modesPaiement = [
    {
      id: "especes",
      label: "Espèces",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      id: "mobile_money",
      label: "Mobile Money",
      icon: <Phone className="w-5 h-5" />,
    },
    {
      id: "carte",
      label: "Carte bancaire",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ];

  // Filtrer les produits
  const produitsFiltres = produits.filter((produit) =>
    produit.nom.toLowerCase().includes(searchProduit.toLowerCase())
  );

  // Filtrer les clients
  const clientsFiltres = clients.filter(
    (client) =>
      `${client.nom} ${client.prenom}`
        .toLowerCase()
        .includes(searchClient.toLowerCase()) ||
      client.telephone.includes(searchClient)
  );

  // Fonctions panier
  const ajouterAuPanier = (produit) => {
    const existant = panier.find((item) => item.id === produit.id);

    if (existant) {
      setPanier(
        panier.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      );
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }

    showNotification(`${produit.nom} ajouté au panier`);
  };

  const modifierQuantite = (id, delta) => {
    setPanier(
      panier.map((item) => {
        if (item.id === id) {
          const newQuantite = item.quantite + delta;
          return newQuantite < 1 ? item : { ...item, quantite: newQuantite };
        }
        return item;
      })
    );
  };

  const supprimerDuPanier = (id) => {
    setPanier(panier.filter((item) => item.id !== id));
    showNotification("Produit retiré");
  };

  const viderPanier = () => {
    if (panier.length > 0 && window.confirm("Vider tout le panier ?")) {
      setPanier([]);
      showNotification("Panier vidé");
    }
  };

  // Calculs
  const sousTotal = panier.reduce(
    (sum, item) => sum + item.prix * item.quantite,
    0
  );
  const totalAPayer = sousTotal + Number(fraisTransport);
  const montantRendu =
    montantPaye > totalAPayer ? montantPaye - totalAPayer : 0;

  // Validation vente
  const validerVente = () => {
    if (panier.length === 0) {
      showNotification("Panier vide", "error");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowFacture(true);
      showNotification("Vente validée avec succès !");
    }, 1000);
  };

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <PageWrapper>
      {/* Header Simple */}
      <div className="border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Section Gauche : Icone + Titre */}
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                Nouvelle Vente
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Gestion simplifiée
              </p>
            </div>
          </div>

          {/* Section Droite : Profil */}
          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            <span className="hidden sm:block text-sm font-semibold text-gray-700">
              Admin
            </span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-blue-50">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Produits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recherche produit */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="relative">
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
            </div>

            {/* Liste des produits */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">
                  Produits Disponibles
                </h2>
              </div>

              <div className="p-4">
                {produitsFiltres.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun produit trouvé
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {produitsFiltres.map((produit) => (
                      <div
                        key={produit.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {produit.nom}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Stock: {produit.stock}
                            </p>
                          </div>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            {produit.categorie}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-semibold text-blue-600">
                            {produit.prix.toLocaleString()} F
                          </span>
                          <button
                            onClick={() => ajouterAuPanier(produit)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Panier et Paiement */}
          <div className="space-y-6">
            {/* Panier */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Panier ({panier.reduce((s, i) => s + i.quantite, 0)})
                </h2>
                {panier.length > 0 && (
                  <button
                    onClick={viderPanier}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-4">
                {panier.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Panier vide
                  </div>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {panier.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.nom}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.prix.toLocaleString()} F × {item.quantite}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="font-semibold text-blue-600">
                            {(item.prix * item.quantite).toLocaleString()} F
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => modifierQuantite(item.id, -1)}
                              className="w-7 h-7 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-medium w-8 text-center">
                              {item.quantite}
                            </span>
                            <button
                              onClick={() => modifierQuantite(item.id, 1)}
                              className="w-7 h-7 bg-blue-100 text-blue-600 rounded flex items-center justify-center hover:bg-blue-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => supprimerDuPanier(item.id)}
                              className="w-7 h-7 bg-red-50 text-red-600 rounded flex items-center justify-center hover:bg-red-100 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totaux */}
              {panier.length > 0 && (
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">
                      {sousTotal.toLocaleString()} F
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Frais de transport
                      </label>
                      <input
                        type="number"
                        value={fraisTransport}
                        onChange={(e) => setFraisTransport(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total à payer</span>
                      <span className="text-blue-600">
                        {totalAPayer.toLocaleString()} F
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Client */}
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {clientSelectionne ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-blue-900">
                          {clientSelectionne.prenom} {clientSelectionne.nom}
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
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
                    <p className="text-gray-600 mb-2">Client comptoir</p>
                    <button
                      onClick={() => setShowModalClient(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Nouveau client
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Paiement
              </h3>

              <div className="space-y-4">
                {/* Modes de paiement */}
                <div className="grid grid-cols-3 gap-2">
                  {modesPaiement.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setModePaiement(method.id)}
                      className={`p-2 rounded-lg border text-center ${
                        modePaiement === method.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {method.icon}
                        <span className="text-xs">{method.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Montant reçu */}
                {["especes", "mobile_money"].includes(modePaiement) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant reçu
                    </label>
                    <input
                      type="number"
                      value={montantPaye}
                      onChange={(e) => setMontantPaye(e.target.value)}
                      className="w-full px-4 py-3 text-right border border-gray-300 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-lg"
                      placeholder="0"
                    />
                  </div>
                )}

                {/* Rendu */}
                {montantRendu > 0 && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      À rendre
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {montantRendu.toLocaleString()} F
                    </p>
                  </div>
                )}

                {/* Bouton de validation */}
                <button
                  onClick={validerVente}
                  disabled={loading || panier.length === 0}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  Valider la vente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Modal Nouveau Client */}
      {showModalClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Nouveau client</h3>
              <button
                onClick={() => setShowModalClient(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  placeholder="+229"
                />
              </div>
            </div>

            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => setShowModalClient(false)}
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

      {/* Modal Facture */}
      {showFacture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-blue-600 mb-2">
                  FACTURE
                </h2>
                <p className="text-gray-600">
                  N° FACT-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-medium">
                      {clientSelectionne
                        ? `${clientSelectionne.prenom} ${clientSelectionne.nom}`
                        : "Client comptoir"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Vendeur</p>
                    <p className="font-medium">Admin</p>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Article
                        </th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">
                          Qté
                        </th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {panier.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            <p className="font-medium">{item.nom}</p>
                          </td>
                          <td className="px-4 py-2 text-center">
                            {item.quantite}
                          </td>
                          <td className="px-4 py-2 text-right font-medium">
                            {(item.prix * item.quantite).toLocaleString()} F
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span>{sousTotal.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport</span>
                    <span>+ {Number(fraisTransport).toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>TOTAL</span>
                    <span className="text-blue-600">
                      {totalAPayer.toLocaleString()} F
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={() => setShowFacture(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 py-4 border-t text-center text-sm text-gray-600">
        <p>© 2024 Système de vente - Interface simplifiée</p>
      </footer>
    </PageWrapper>
  );
};

export default NewSales;
