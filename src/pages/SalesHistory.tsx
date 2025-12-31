import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Printer,
  Download,
  Eye,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import PageWrapper from "../components/PageWrapper";

// Types
interface Client {
  nom: string;
  prenom: string;
  telephone: string;
}

interface Article {
  nom: string;
  quantite: number;
  prix: number;
}

interface Stats {
  totalVentes: number;
  totalCA: number;
  moyennePanier: number;
  meilleurJour: { date: string; montant: number };
}

interface Vente {
  id: string;
  date: string;
  client: Client | null;
  articles: Article[];
  total: number;
  paiement: string;
  statut: string;
  vendeur: string;
  transport: number;
  remise: number;
}

const SalesHistory = () => {
  // États principaux
  const [search, setSearch] = useState("");
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [filterDate, setFilterDate] = useState<string>("tous");
  const [filterStatut, setFilterStatut] = useState<string>("tous");
  const [filterPaiement, setFilterPaiement] = useState<string>("tous");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");
  const [selectedVente, setSelectedVente] = useState<Vente | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalVentes: 0,
    totalCA: 0,
    moyennePanier: 0,
    meilleurJour: { date: "", montant: 0 },
  });

  // Données mockées pour les ventes
  const ventesMock: Vente[] = [
    {
      id: "VENT-2024-00123",
      date: "2024-01-15 14:30",
      client: { nom: "Dupont", prenom: "Jean", telephone: "+229 12 34 56 78" },
      articles: [
        { nom: "Ordinateur Portable", quantite: 1, prix: 899900 },
        { nom: "Souris", quantite: 1, prix: 15000 },
      ],
      total: 914900,
      paiement: "especes",
      statut: "complete",
      vendeur: "Admin",
      transport: 0,
      remise: 0,
    },
    {
      id: "VENT-2024-00122",
      date: "2024-01-15 11:15",
      client: { nom: "Martin", prenom: "Marie", telephone: "+229 23 45 67 89" },
      articles: [
        { nom: "Smartphone Android", quantite: 1, prix: 349900 },
        { nom: "Écouteurs Bluetooth", quantite: 1, prix: 79900 },
        { nom: "Coque", quantite: 1, prix: 10000 },
      ],
      total: 439800,
      paiement: "mobile_money",
      statut: "complete",
      vendeur: "Admin",
      transport: 5000,
      remise: 10000,
    },
    {
      id: "VENT-2024-00121",
      date: "2024-01-14 16:45",
      client: {
        nom: "Bernard",
        prenom: "Pierre",
        telephone: "+229 34 56 78 90",
      },
      articles: [
        { nom: "Tablette Android", quantite: 1, prix: 449900 },
        { nom: "Clavier", quantite: 1, prix: 25000 },
      ],
      total: 474900,
      paiement: "carte",
      statut: "annule",
      vendeur: "Admin",
      transport: 0,
      remise: 0,
    },
    {
      id: "VENT-2024-00120",
      date: "2024-01-14 10:20",
      client: null,
      articles: [
        { nom: "Enceinte Portable", quantite: 2, prix: 129900 },
        { nom: "Câble USB", quantite: 3, prix: 5000 },
      ],
      total: 274800,
      paiement: "especes",
      statut: "complete",
      vendeur: "Vendeur1",
      transport: 10000,
      remise: 5000,
    },
    {
      id: "VENT-2024-00119",
      date: "2024-01-13 15:30",
      client: { nom: "Dupont", prenom: "Jean", telephone: "+229 12 34 56 78" },
      articles: [{ nom: "Montre Connectée", quantite: 1, prix: 199900 }],
      total: 199900,
      paiement: "especes",
      statut: "complete",
      vendeur: "Vendeur2",
      transport: 0,
      remise: 10000,
    },
    {
      id: "VENT-2024-00118",
      date: "2024-01-12 09:45",
      client: {
        nom: "Leclerc",
        prenom: "Sophie",
        telephone: "+229 45 67 89 01",
      },
      articles: [
        { nom: "Ordinateur Portable", quantite: 1, prix: 899900 },
        { nom: "Sacoche", quantite: 1, prix: 25000 },
        { nom: "Souris sans fil", quantite: 1, prix: 35000 },
      ],
      total: 959900,
      paiement: "mobile_money",
      statut: "complete",
      vendeur: "Admin",
      transport: 15000,
      remise: 20000,
    },
    {
      id: "VENT-2024-00117",
      date: "2024-01-11 13:20",
      client: null,
      articles: [
        { nom: "Écouteurs Bluetooth", quantite: 3, prix: 79900 },
        { nom: "Adaptateur", quantite: 2, prix: 15000 },
      ],
      total: 269700,
      paiement: "especes",
      statut: "complete",
      vendeur: "Vendeur1",
      transport: 0,
      remise: 0,
    },
    {
      id: "VENT-2024-00116",
      date: "2024-01-10 17:10",
      client: {
        nom: "Moreau",
        prenom: "Thomas",
        telephone: "+229 56 78 90 12",
      },
      articles: [{ nom: "Smartphone Android", quantite: 2, prix: 349900 }],
      total: 699800,
      paiement: "carte",
      statut: "complete",
      vendeur: "Admin",
      transport: 0,
      remise: 0,
    },
  ];

  // Initialisation des données
  useEffect(() => {
    setVentes(ventesMock);
    calculerStats(ventesMock);
  }, []);

  // Calculer les statistiques
  const calculerStats = (ventesList: Vente[]) => {
    const totalVentes = ventesList.filter(
      (v) => v.statut === "complete"
    ).length;
    const totalCA = ventesList
      .filter((v) => v.statut === "complete")
      .reduce((sum, v) => sum + v.total, 0);

    const moyennePanier = totalVentes > 0 ? totalCA / totalVentes : 0;

    // Trouver le meilleur jour (simplifié)
    const ventesParDate: { [key: string]: number } = {};
    ventesList.forEach((v) => {
      if (v.statut === "complete") {
        const date = v.date.split(" ")[0];
        ventesParDate[date] = (ventesParDate[date] || 0) + v.total;
      }
    });

    let meilleurJour = { date: "", montant: 0 };
    Object.entries(ventesParDate).forEach(([date, montant]) => {
      if (montant > meilleurJour.montant) {
        meilleurJour = { date, montant };
      }
    });

    setStats({
      totalVentes,
      totalCA,
      moyennePanier,
      meilleurJour,
    });
  };

  // Filtrer les ventes
  const ventesFiltrees = ventes.filter((vente) => {
    const matchesSearch =
      vente.id.toLowerCase().includes(search.toLowerCase()) ||
      (vente.client &&
        `${vente.client.prenom} ${vente.client.nom}`
          .toLowerCase()
          .includes(search.toLowerCase())) ||
      vente.vendeur.toLowerCase().includes(search.toLowerCase());

    const matchesStatut =
      filterStatut === "tous" ||
      filterStatut === "" ||
      vente.statut === filterStatut;
    const matchesPaiement =
      filterPaiement === "tous" ||
      filterPaiement === "" ||
      vente.paiement === filterPaiement;

    let matchesDate = true;
    if (dateDebut && dateFin) {
      const venteDate = vente.date.split(" ")[0];
      matchesDate = venteDate >= dateDebut && venteDate <= dateFin;
    } else if (filterDate !== "tous" && filterDate !== "") {
      const aujourdHui = new Date().toISOString().split("T")[0];
      const hier = new Date();
      hier.setDate(hier.getDate() - 1);
      const hierStr = hier.toISOString().split("T")[0];

      const venteDate = vente.date.split(" ")[0];

      switch (filterDate) {
        case "aujourdhui":
          matchesDate = venteDate === aujourdHui;
          break;
        case "hier":
          matchesDate = venteDate === hierStr;
          break;
        case "semaine":
          const semaineAgo = new Date();
          semaineAgo.setDate(semaineAgo.getDate() - 7);
          const semaineStr = semaineAgo.toISOString().split("T")[0];
          matchesDate = venteDate >= semaineStr;
          break;
        case "mois":
          const moisAgo = new Date();
          moisAgo.setMonth(moisAgo.getMonth() - 1);
          const moisStr = moisAgo.toISOString().split("T")[0];
          matchesDate = venteDate >= moisStr;
          break;
      }
    }

    return matchesSearch && matchesStatut && matchesPaiement && matchesDate;
  });

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Obtenir la couleur du statut
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "complete":
        return "bg-green-100 text-green-800";
      case "annule":
        return "bg-red-100 text-red-800";
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Obtenir l'icône du statut
  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "complete":
        return <CheckCircle className="w-4 h-4" />;
      case "annule":
        return <XCircle className="w-4 h-4" />;
      case "en_attente":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Obtenir le libellé du mode de paiement
  const getPaiementLabel = (paiement: string) => {
    switch (paiement) {
      case "especes":
        return "Espèces";
      case "mobile_money":
        return "Mobile Money";
      case "carte":
        return "Carte bancaire";
      default:
        return paiement;
    }
  };

  // Exporter les données
  const exporterDonnees = () => {
    const dataStr = JSON.stringify(ventesFiltrees, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ventes_${new Date().toISOString().split("T")[0]}.json`;
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
    <PageWrapper
      title="Historique des Ventes"
      subtitle="Consultation et analyse des ventes"
    >
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ventes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalVentes}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">
                {(stats.totalCA / 1000000).toFixed(1)}M F
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Panier Moyen</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.moyennePanier.toLocaleString()} F
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-600">-3%</span>
              </div>
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
              <p className="text-2xl font-bold text-gray-900">
                {new Date(stats.meilleurJour.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-green-600">
                  {stats.meilleurJour.montant.toLocaleString()} F
                </span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une vente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="complete">Complètes</option>
              <option value="annule">Annulées</option>
              <option value="en_attente">En attente</option>
            </select>

            <button
              onClick={exporterDonnees}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Tableau des ventes */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Statut
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ventesFiltrees.slice(0, 10).map((vente) => (
                <tr key={vente.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {vente.id}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {vente.client
                        ? `${vente.client.prenom} ${vente.client.nom}`
                        : "Client anonyme"}
                    </div>
                    <div className="text-xs text-gray-500 sm:hidden">
                      {formatDate(vente.date)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">
                      {formatDate(vente.date)}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {vente.total.toLocaleString()} F
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      vente.statut === 'complete' 
                        ? 'bg-green-100 text-green-800'
                        : vente.statut === 'annule'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vente.statut === 'complete' ? 'Complète' : 
                       vente.statut === 'annule' ? 'Annulée' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() => console.log('Voir détails', vente.id)}
                        className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => console.log('Imprimer', vente.id)}
                        className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </PageWrapper>
  );
};

export default SalesHistory;
