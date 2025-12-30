import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";

interface DashboardStats {
  totalClients: number;
  totalVentes: number;
  totalProduits: number;
  chiffreAffaires: number;
  ventesAujourdhui: number;
  ventesMois: number;
  nouveauxClients: number;
  produitsStockBas: number;
}

interface RecentActivity {
  id: string;
  type: "vente" | "client" | "produit";
  description: string;
  date: string;
  montant?: number;
  statut?: "success" | "warning" | "info";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalVentes: 0,
    totalProduits: 0,
    chiffreAffaires: 0,
    ventesAujourdhui: 0,
    ventesMois: 0,
    nouveauxClients: 0,
    produitsStockBas: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalClients: 1248,
        totalVentes: 3567,
        totalProduits: 89,
        chiffreAffaires: 45678900,
        ventesAujourdhui: 23,
        ventesMois: 567,
        nouveauxClients: 45,
        produitsStockBas: 12,
      });

      setRecentActivities([
        {
          id: "1",
          type: "vente",
          description: "Vente #V2024-1234 - Jean Dupont",
          date: "2024-12-30 14:30",
          montant: 45000,
          statut: "success",
        },
        {
          id: "2",
          type: "client",
          description: "Nouveau client inscrit - Marie Martin",
          date: "2024-12-30 13:45",
          statut: "info",
        },
        {
          id: "3",
          type: "produit",
          description: "Stock bas pour Produit A",
          date: "2024-12-30 12:20",
          statut: "warning",
        },
        {
          id: "4",
          type: "vente",
          description: "Vente #V2024-1233 - Société ABC",
          date: "2024-12-30 11:15",
          montant: 125000,
          statut: "success",
        },
        {
          id: "5",
          type: "client",
          description: "Nouveau client inscrit - Pierre Bernard",
          date: "2024-12-30 10:30",
          statut: "info",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "vente":
        return <ShoppingCart className="w-4 h-4" />;
      case "client":
        return <Users className="w-4 h-4" />;
      case "produit":
        return <Package className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (statut?: string) => {
    switch (statut) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return ( 
    <PageWrapper>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalClients.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ventes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalVentes.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold text-gray-900">
                {(stats.chiffreAffaires / 1000000).toFixed(1)}M F
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProduits}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-yellow-600">
                  {stats.produitsStockBas} stock bas
                </span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">Actions Rapides</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate("/ventes/new")}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center gap-2 text-blue-600 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="text-sm font-medium">Nouvelle Vente</span>
            </button>

            <button
              onClick={() => navigate("/clients/new")}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center gap-2 text-green-600 transition-colors"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Nouveau Client</span>
            </button>

            <button
              onClick={() => navigate("/ventes/list")}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center gap-2 text-purple-600 transition-colors"
            >
              <Eye className="w-6 h-6" />
              <span className="text-sm font-medium">Voir Ventes</span>
            </button>

            <button
              onClick={() => navigate("/factures/list")}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg flex flex-col items-center gap-2 text-orange-600 transition-colors"
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium">Factures</span>
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
