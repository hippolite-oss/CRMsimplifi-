// pages/ListClients.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  CreditCard,
  Phone,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  PlusCircle,
  Printer,
  Download,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const ListClients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterArdoise, setFilterArdoise] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchClients();
  }, [filterArdoise]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await Axios.get("/api/clients", {
        params: { avecArdoise: filterArdoise ? "true" : undefined },
      });
      if (res.data.success) {
        setClients(res.data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement clients:", error);
      showNotification("Erreur lors du chargement des clients", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.prenom &&
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      client.telephone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      await Axios.delete(`/api/clients/${id}`);
      showNotification("Client supprimé", "success");
      fetchClients();
    } catch (error) {
      showNotification("Erreur suppression", "error");
    }
  };

  return (
    <PageWrapper
      title="Clients"
      subtitle="Gestion des clients, ardoises et cotisations"
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl animate-slide-in ${
            notification.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.length}
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
              <p className="text-sm text-gray-600">Ardoises Actives</p>
              <p className="text-2xl font-bold text-gray-900">
                {clients.filter((c) => c.solde_actuel > 0).length}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3 text-red-600" />
                <span className="text-xs text-red-600">-5%</span>
              </div>
            </div>
            <div className="p-2 bg-red-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Ardoises</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(
                  clients.reduce((sum, c) => sum + (c.solde_actuel || 0), 0)
                )}{" "}
                FCFA
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cotisations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat("fr-FR").format(
                  clients.reduce(
                    (sum, c) => sum + (c.total_cotisation_disponible || 0),
                    0
                  )
                )}{" "}
                FCFA
              </p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/clients/new")}
            className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Nouveau Client
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Imprimer
          </button>

          <button
            onClick={() => {
              const data = clients.map((c) => ({
                nom: c.nom,
                prenom: c.prenom,
                telephone: c.telephone,
                solde: c.solde_actuel || 0,
                cotisation: c.total_cotisation_disponible || 0,
              }));
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `clients_${
                new Date().toISOString().split("T")[0]
              }.json`;
              a.click();
            }}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exporter
          </button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setFilterArdoise(!filterArdoise)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
                filterArdoise
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Avec ardoise
            </button>
          </div>
        </div>
      </div>

      {/* Liste clients */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-2xl text-gray-600">Aucun client trouvé</p>
            <p className="text-gray-500 mt-2">
              Essayez de modifier votre recherche ou le filtre
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Téléphone
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Ardoise
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Montant cotisé
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {client.nom} {client.prenom}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {client.adresse || "Aucune adresse"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {client.telephone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                          client.solde_actuel > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {new Intl.NumberFormat("fr-FR").format(
                          client.solde_actuel || 0
                        )}{" "}
                        FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                          (client.total_cotisation_disponible || 0) > 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {new Intl.NumberFormat("fr-FR").format(
                          client.total_cotisation_disponible || 0
                        )}{" "}
                        FCFA
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/clients/${client._id}`)
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Voir détails"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/admin/clients/edit/${client._id}`)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ListClients;
