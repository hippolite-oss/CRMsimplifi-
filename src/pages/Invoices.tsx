import { useState, useEffect, useMemo } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  Search,
  Filter,
  FileText,
  Printer,
  Download,
  Eye,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Mail,
  MapPin,
  Hash,
  Edit,
  Trash2,
  AlertCircle,
  ExternalLink,
  Copy,
  QrCode,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
interface Client {
  id: number;
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
  telephone: string;
  adresse: string;
}

interface Article {
  id: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  tva: number;
  total: number;
}

interface Facture {
  id: string;
  numero: string;
  dateEmission: string;
  dateEcheance: string;
  client: Client;
  montantHT: number;
  tva: number;
  montantTVA: number;
  montantTTC: number;
  fraisTransport: number;
  remise: number;
  totalAPayer: number;
  montantPaye: number;
  resteAPayer: number;
  statut: "payee" | "partiellement" | "impayee";
  modePaiement: "especes" | "mobile_money" | "carte" | null;
  referencePaiement: string | null;
  datePaiement: string | null;
  vendeur: string;
  articles: Article[];
  notes: string;
  conditionsPaiement: string;
}

const Invoices = () => {
  const navigate = useNavigate();

  // États principaux
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [filterClient, setFilterClient] = useState("tous");
  const [filterDate, setFilterDate] = useState("tous");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [selectedFactures, setSelectedFactures] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [factureToDelete, setFactureToDelete] = useState<Facture | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [stats, setStats] = useState({
    total: 0,
    payees: 0,
    impayees: 0,
    montantTotal: 0,
    montantImpaye: 0,
  });

  // Données mockées pour les factures
  const facturesMock: Facture[] = [
    {
      id: "FACT-2024-00123",
      numero: "FACT-2024-00123",
      dateEmission: "2024-01-15",
      dateEcheance: "2024-02-14",
      client: {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
        entreprise: "Dupont SA",
        email: "jean.dupont@email.com",
        telephone: "+229 12 34 56 78",
        adresse: "123 Rue de Paris, 75001 Paris",
      },
      montantHT: 450000,
      tva: 18,
      montantTVA: 81000,
      montantTTC: 531000,
      fraisTransport: 10000,
      remise: 0,
      totalAPayer: 541000,
      montantPaye: 541000,
      resteAPayer: 0,
      statut: "payee",
      modePaiement: "especes",
      referencePaiement: "REF-2024-00123",
      datePaiement: "2024-01-15",
      vendeur: "Admin",
      articles: [
        {
          id: 1,
          nom: "Ordinateur Portable",
          quantite: 1,
          prixUnitaire: 350000,
          tva: 18,
          total: 350000,
        },
        {
          id: 2,
          nom: "Souris sans fil",
          quantite: 2,
          prixUnitaire: 25000,
          tva: 18,
          total: 50000,
        },
        {
          id: 3,
          nom: "Clavier mécanique",
          quantite: 1,
          prixUnitaire: 50000,
          tva: 18,
          total: 50000,
        },
      ],
      notes: "Livraison express demandée",
      conditionsPaiement: "Paiement comptant à la livraison",
    },
    {
      id: "FACT-2024-00122",
      numero: "FACT-2024-00122",
      dateEmission: "2024-01-14",
      dateEcheance: "2024-02-13",
      client: {
        id: 2,
        nom: "Martin",
        prenom: "Marie",
        entreprise: "Martin & Cie",
        email: "marie.martin@email.com",
        telephone: "+229 23 45 67 89",
        adresse: "456 Avenue des Champs, 75008 Paris",
      },
      montantHT: 297288,
      tva: 18,
      montantTVA: 53512,
      montantTTC: 350800,
      fraisTransport: 5000,
      remise: 10000,
      totalAPayer: 345800,
      montantPaye: 200000,
      resteAPayer: 145800,
      statut: "partiellement",
      modePaiement: "mobile_money",
      referencePaiement: "MOMO-2024-00122",
      datePaiement: "2024-01-20",
      vendeur: "Admin",
      articles: [
        {
          id: 4,
          nom: "Smartphone Android",
          quantite: 1,
          prixUnitaire: 299900,
          tva: 18,
          total: 299900,
        },
        {
          id: 5,
          nom: "Écouteurs Bluetooth",
          quantite: 1,
          prixUnitaire: 49900,
          tva: 18,
          total: 49900,
        },
      ],
      notes: "",
      conditionsPaiement: "30 jours net",
    },
    {
      id: "FACT-2024-00121",
      numero: "FACT-2024-00121",
      dateEmission: "2024-01-13",
      dateEcheance: "2024-02-12",
      client: {
        id: 3,
        nom: "Bernard",
        prenom: "Pierre",
        entreprise: "Bernard Tech",
        email: "pierre.bernard@email.com",
        telephone: "+229 34 56 78 90",
        adresse: "789 Boulevard Saint-Germain, 75006 Paris",
      },
      montantHT: 423729,
      tva: 18,
      montantTVA: 76271,
      montantTTC: 500000,
      fraisTransport: 0,
      remise: 0,
      totalAPayer: 500000,
      montantPaye: 0,
      resteAPayer: 500000,
      statut: "impayee",
      modePaiement: null,
      referencePaiement: null,
      datePaiement: null,
      vendeur: "Vendeur1",
      articles: [
        {
          id: 6,
          nom: "Tablette Android",
          quantite: 1,
          prixUnitaire: 423729,
          tva: 18,
          total: 423729,
        },
      ],
      notes: "Relance nécessaire",
      conditionsPaiement: "15 jours fin de mois",
    },
    {
      id: "FACT-2024-00120",
      numero: "FACT-2024-00120",
      dateEmission: "2024-01-12",
      dateEcheance: "2024-02-11",
      client: {
        id: 4,
        nom: "Leclerc",
        prenom: "Sophie",
        entreprise: "Leclerc Informatique",
        email: "sophie.leclerc@email.com",
        telephone: "+229 45 67 89 01",
        adresse: "101 Rue de la République, 69001 Lyon",
      },
      montantHT: 677966,
      tva: 18,
      montantTVA: 122034,
      montantTTC: 800000,
      fraisTransport: 20000,
      remise: 50000,
      totalAPayer: 770000,
      montantPaye: 770000,
      resteAPayer: 0,
      statut: "payee",
      modePaiement: "carte",
      referencePaiement: "CARTE-2024-00120",
      datePaiement: "2024-01-18",
      vendeur: "Admin",
      articles: [
        {
          id: 7,
          nom: "Ordinateur Portable Pro",
          quantite: 2,
          prixUnitaire: 338983,
          tva: 18,
          total: 677966,
        },
      ],
      notes: "Installation logicielle incluse",
      conditionsPaiement: "Paiement à la commande",
    },
    {
      id: "FACT-2024-00119",
      numero: "FACT-2024-00119",
      dateEmission: "2024-01-11",
      dateEcheance: "2024-02-10",
      client: {
        id: 5,
        nom: "Petit",
        prenom: "Luc",
        entreprise: "Petit Solutions",
        email: "luc.petit@email.com",
        telephone: "+229 56 78 90 12",
        adresse: "202 Avenue Victor Hugo, 13000 Marseille",
      },
      montantHT: 211864,
      tva: 18,
      montantTVA: 38136,
      montantTTC: 250000,
      fraisTransport: 15000,
      remise: 0,
      totalAPayer: 265000,
      montantPaye: 265000,
      resteAPayer: 0,
      statut: "payee",
      modePaiement: "especes",
      referencePaiement: "ESP-2024-00119",
      datePaiement: "2024-01-11",
      vendeur: "Vendeur2",
      articles: [
        {
          id: 8,
          nom: "Écouteurs Pro",
          quantite: 5,
          prixUnitaire: 42373,
          tva: 18,
          total: 211864,
        },
      ],
      notes: "Facture pour événement d'entreprise",
      conditionsPaiement: "Comptant",
    },
    {
      id: "FACT-2024-00118",
      numero: "FACT-2024-00118",
      dateEmission: "2024-01-10",
      dateEcheance: "2024-02-09",
      client: {
        id: 6,
        nom: "Robert",
        prenom: "Claire",
        entreprise: "Robert Technologies",
        email: "claire.robert@email.com",
        telephone: "+229 67 89 01 23",
        adresse: "303 Rue de la Paix, 44000 Nantes",
      },
      montantHT: 169492,
      tva: 18,
      montantTVA: 30508,
      montantTTC: 200000,
      fraisTransport: 0,
      remise: 0,
      totalAPayer: 200000,
      montantPaye: 100000,
      resteAPayer: 100000,
      statut: "partiellement",
      modePaiement: "mobile_money",
      referencePaiement: "MOMO-2024-00118",
      datePaiement: "2024-01-15",
      vendeur: "Admin",
      articles: [
        {
          id: 9,
          nom: "Montre Connectée",
          quantite: 1,
          prixUnitaire: 169492,
          tva: 18,
          total: 169492,
        },
      ],
      notes: "Solde à payer avant échéance",
      conditionsPaiement: "50% à la commande, 50% à la livraison",
    },
    {
      id: "FACT-2024-00117",
      numero: "FACT-2024-00117",
      dateEmission: "2024-01-09",
      dateEcheance: "2024-02-08",
      client: {
        id: 7,
        nom: "Durand",
        prenom: "Antoine",
        entreprise: "Durand Services",
        email: "antoine.durand@email.com",
        telephone: "+229 78 90 12 34",
        adresse: "404 Boulevard des Belges, 59000 Lille",
      },
      montantHT: 84746,
      tva: 18,
      montantTVA: 15254,
      montantTTC: 100000,
      fraisTransport: 5000,
      remise: 0,
      totalAPayer: 105000,
      montantPaye: 0,
      resteAPayer: 105000,
      statut: "impayee",
      modePaiement: null,
      referencePaiement: null,
      datePaiement: null,
      vendeur: "Vendeur1",
      articles: [
        {
          id: 10,
          nom: "Enceinte Portable",
          quantite: 1,
          prixUnitaire: 84746,
          tva: 18,
          total: 84746,
        },
      ],
      notes: "Client à relancer",
      conditionsPaiement: "30 jours net",
    },
    {
      id: "FACT-2024-00116",
      numero: "FACT-2024-00116",
      dateEmission: "2024-01-08",
      dateEcheance: "2024-02-07",
      client: {
        id: 8,
        nom: "Moreau",
        prenom: "Isabelle",
        entreprise: "Moreau Digital",
        email: "isabelle.moreau@email.com",
        telephone: "+229 89 01 23 45",
        adresse: "505 Rue du Commerce, 33000 Bordeaux",
      },
      montantHT: 762712,
      tva: 18,
      montantTVA: 137288,
      montantTTC: 900000,
      fraisTransport: 25000,
      remise: 100000,
      totalAPayer: 825000,
      montantPaye: 825000,
      resteAPayer: 0,
      statut: "payee",
      modePaiement: "carte",
      referencePaiement: "CARTE-2024-00116",
      datePaiement: "2024-01-10",
      vendeur: "Admin",
      articles: [
        {
          id: 11,
          nom: "Serveur Entreprise",
          quantite: 1,
          prixUnitaire: 762712,
          tva: 18,
          total: 762712,
        },
      ],
      notes: "Installation sur site incluse",
      conditionsPaiement: "Paiement à réception",
    },
    {
      id: "FACT-2024-00115",
      numero: "FACT-2024-00115",
      dateEmission: "2024-01-07",
      dateEcheance: "2024-02-06",
      client: {
        id: 9,
        nom: "Simon",
        prenom: "Thomas",
        entreprise: "Simon Consulting",
        email: "thomas.simon@email.com",
        telephone: "+229 90 12 34 56",
        adresse: "606 Avenue de la Liberté, 31000 Toulouse",
      },
      montantHT: 338983,
      tva: 18,
      montantTVA: 61017,
      montantTTC: 400000,
      fraisTransport: 15000,
      remise: 25000,
      totalAPayer: 390000,
      montantPaye: 390000,
      resteAPayer: 0,
      statut: "payee",
      modePaiement: "especes",
      referencePaiement: "ESP-2024-00115",
      datePaiement: "2024-01-08",
      vendeur: "Vendeur2",
      articles: [
        {
          id: 12,
          nom: "Ordinateur Portable",
          quantite: 1,
          prixUnitaire: 338983,
          tva: 18,
          total: 338983,
        },
      ],
      notes: "",
      conditionsPaiement: "Comptant",
    },
    {
      id: "FACT-2024-00114",
      numero: "FACT-2024-00114",
      dateEmission: "2024-01-06",
      dateEcheance: "2024-02-05",
      client: {
        id: 10,
        nom: "Michel",
        prenom: "Julie",
        entreprise: "Michel Solutions",
        email: "julie.michel@email.com",
        telephone: "+229 01 23 45 67",
        adresse: "707 Rue Nationale, 54000 Nancy",
      },
      montantHT: 423729,
      tva: 18,
      montantTVA: 76271,
      montantTTC: 500000,
      fraisTransport: 10000,
      remise: 30000,
      totalAPayer: 480000,
      montantPaye: 300000,
      resteAPayer: 180000,
      statut: "partiellement",
      modePaiement: "mobile_money",
      referencePaiement: "MOMO-2024-00114",
      datePaiement: "2024-01-12",
      vendeur: "Admin",
      articles: [
        {
          id: 13,
          nom: "Tablette Pro",
          quantite: 1,
          prixUnitaire: 423729,
          tva: 18,
          total: 423729,
        },
      ],
      notes: "Solde à régler avant fin janvier",
      conditionsPaiement: "60% à la commande, 40% à la livraison",
    },
  ];

  // Clients uniques pour le filtre
  const clientsUniques = [
    ...new Set(facturesMock.map((f) => f.client.entreprise)),
  ];

  // Initialisation des données
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFactures(facturesMock);
      calculerStats(facturesMock);
      setLoading(false);
    }, 800);
  }, []);

  // Calculer les statistiques
  const calculerStats = (facturesList: Facture[]) => {
    const total = facturesList.length;
    const payees = facturesList.filter((f) => f.statut === "payee").length;
    const impayees = facturesList.filter((f) => f.statut === "impayee").length;
    const montantTotal = facturesList.reduce(
      (sum, f) => sum + f.totalAPayer,
      0
    );
    const montantImpaye = facturesList
      .filter((f) => f.statut === "impayee")
      .reduce((sum, f) => sum + f.resteAPayer, 0);

    setStats({
      total,
      payees,
      impayees,
      montantTotal,
      montantImpaye,
    });
  };

  // Filtrer et trier les factures
  const facturesFiltrees = useMemo(() => {
    let filtered = [...factures];

    // Filtre par recherche
    if (search) {
      filtered = filtered.filter(
        (f) =>
          f.numero.toLowerCase().includes(search.toLowerCase()) ||
          f.client.nom.toLowerCase().includes(search.toLowerCase()) ||
          f.client.prenom.toLowerCase().includes(search.toLowerCase()) ||
          f.client.entreprise.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre par statut
    if (filterStatut !== "tous") {
      filtered = filtered.filter((f) => f.statut === filterStatut);
    }

    // Filtre par client
    if (filterClient !== "tous") {
      filtered = filtered.filter((f) => f.client.entreprise === filterClient);
    }

    // Filtre par date
    if (filterDate !== "tous") {
      const aujourdHui = new Date().toISOString().split("T")[0];
      const hier = new Date();
      hier.setDate(hier.getDate() - 1);
      const hierStr = hier.toISOString().split("T")[0];
      const moisAgo = new Date();
      moisAgo.setMonth(moisAgo.getMonth() - 1);
      const moisStr = moisAgo.toISOString().split("T")[0];

      switch (filterDate) {
        case "aujourdhui":
          filtered = filtered.filter((f) => f.dateEmission === aujourdHui);
          break;
        case "hier":
          filtered = filtered.filter((f) => f.dateEmission === hierStr);
          break;
        case "semaine":
          const semaineAgo = new Date();
          semaineAgo.setDate(semaineAgo.getDate() - 7);
          const semaineStr = semaineAgo.toISOString().split("T")[0];
          filtered = filtered.filter((f) => f.dateEmission >= semaineStr);
          break;
        case "mois":
          filtered = filtered.filter((f) => f.dateEmission >= moisStr);
          break;
        case "personnalise":
          if (dateDebut && dateFin) {
            filtered = filtered.filter(
              (f) => f.dateEmission >= dateDebut && f.dateEmission <= dateFin
            );
          }
          break;
      }
    }

    // Tri
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "numero":
          aVal = a.numero;
          bVal = b.numero;
          break;
        case "date":
          aVal = a.dateEmission;
          bVal = b.dateEmission;
          break;
        case "montant":
          aVal = a.totalAPayer;
          bVal = b.totalAPayer;
          break;
        case "client":
          aVal = a.client.entreprise;
          bVal = b.client.entreprise;
          break;
        default:
          aVal = a.dateEmission;
          bVal = b.dateEmission;
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [
    factures,
    search,
    filterStatut,
    filterClient,
    filterDate,
    dateDebut,
    dateFin,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(facturesFiltrees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const facturesPagines = facturesFiltrees.slice(
    startIndex,
    endIndex
  ) as Facture[];

  // Fonctions utilitaires
  const getStatutColor = (statut: Facture["statut"]) => {
    switch (statut) {
      case "payee":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          label: "Payée",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "partiellement":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "Partiellement",
          icon: <Clock className="w-4 h-4" />,
        };
      case "impayee":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          label: "Impayée",
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: statut,
          icon: null,
        };
    }
  };

  const getPaiementLabel = (mode: Facture["modePaiement"]) => {
    switch (mode) {
      case "especes":
        return "Espèces";
      case "mobile_money":
        return "Mobile Money";
      case "carte":
        return "Carte bancaire";
      default:
        return "Non spécifié";
    }
  };

  const handleSelectFacture = (id: string) => {
    if (selectedFactures.includes(id)) {
      setSelectedFactures(selectedFactures.filter((fId) => fId !== id));
    } else {
      setSelectedFactures([...selectedFactures, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFactures.length === facturesPagines.length) {
      setSelectedFactures([]);
    } else {
      setSelectedFactures(facturesPagines.map((f) => f.id));
    }
  };

  // const handleDelete = (facture: Facture) => {
  //   setFactureToDelete(facture);
  //   setShowDeleteConfirm(true);
  // };

  const confirmDelete = () => {
    if (factureToDelete) {
      setFactures(factures.filter((f) => f.id !== factureToDelete.id));
      setShowDeleteConfirm(false);
      setFactureToDelete(null);
    }
  };

  const handlePrint = (facture: Facture) => {
    // Simulation d'impression
    console.log("Impression de la facture:", facture.numero);
    // Dans une vraie application, vous généreriez un PDF ou ouvririez une fenêtre d'impression
  };

  const handleDownloadPDF = (facture: Facture) => {
    // Simulation de téléchargement PDF
    console.log("Téléchargement PDF de:", facture.numero);
  };

  const handleSendEmail = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowSendModal(true);
  };

  const handleMarkAsPaid = (factureId: string) => {
    setFactures(
      factures.map((f) =>
        f.id === factureId
          ? {
              ...f,
              statut: "payee",
              montantPaye: f.totalAPayer,
              resteAPayer: 0,
              datePaiement: new Date().toISOString().split("T")[0],
            }
          : f
      )
    );
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const navigateToNewSale = () => {
    navigate("/ventes/nouvelle");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  const calculateDaysLeft = (dateEcheance: string) => {
    if (!dateEcheance) return null;
    const today = new Date();
    const echeance = new Date(dateEcheance);
    const diffTime = echeance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageWrapper padding="none">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 lg:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Section Gauche : Infos */}
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl shadow-md shadow-purple-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Factures
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-sm font-medium text-gray-500">
                  {stats.total} factures au total
                </p>
              </div>
            </div>
          </div>

          {/* Section Droite : Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden xs:block">Imprimer</span>
            </button>

            <button
              onClick={navigateToNewSale}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Nouvelle Facture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Factures</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.montantTotal.toLocaleString()} F
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Factures Payées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.payees}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Factures Impayées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.impayees}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Impayé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.montantImpaye.toLocaleString()} F
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par N° facture, client..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Filtre statut */}
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="tous">Tous statuts</option>
                <option value="payee">Payées</option>
                <option value="partiellement">Partiellement</option>
                <option value="impayee">Impayées</option>
              </select>

              {/* Filtre client */}
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
              >
                <option value="tous">Tous clients</option>
                {clientsUniques.map((client) => (
                  <option key={client} value={client}>
                    {client}
                  </option>
                ))}
              </select>

              {/* Filtre date */}
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

              {/* Date personnalisée */}
              {filterDate === "personnalise" && (
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

              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatut("tous");
                  setFilterClient("tous");
                  setFilterDate("tous");
                  setDateDebut("");
                  setDateFin("");
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Actions groupe */}
        {selectedFactures.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">
                {selectedFactures.length} facture
                {selectedFactures.length > 1 ? "s" : ""} sélectionnée
                {selectedFactures.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Marquer comme payées
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Envoyer par email
              </button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1">
                <Download className="w-3 h-3" />
                Exporter en PDF
              </button>
            </div>
          </div>
        )}

        {/* Tableau des factures */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedFactures.length === facturesPagines.length &&
                        facturesPagines.length > 0
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("numero")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      N° Facture
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("client")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Client
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Date
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("montant")}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Montant
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">
                        Chargement des factures...
                      </p>
                    </td>
                  </tr>
                ) : facturesPagines.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Aucune facture trouvée
                    </td>
                  </tr>
                ) : (
                  facturesPagines.map((facture) => {
                    const statutInfo = getStatutColor(facture.statut);
                    const daysLeft = calculateDaysLeft(facture.dateEcheance);
                    const isOverdue = daysLeft !== null && daysLeft < 0;

                    return (
                      <tr key={facture.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedFactures.includes(facture.id)}
                            onChange={() => handleSelectFacture(facture.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-blue-600">
                            {facture.numero}
                          </div>
                          <div className="text-xs text-gray-500">
                            Échéance: {formatDate(facture.dateEcheance)}
                            {daysLeft !== null && (
                              <span
                                className={`ml-2 ${
                                  isOverdue
                                    ? "text-red-600"
                                    : daysLeft <= 3
                                    ? "text-yellow-600"
                                    : "text-gray-500"
                                }`}
                              >
                                (
                                {isOverdue
                                  ? `${Math.abs(daysLeft)}j retard`
                                  : `${daysLeft}j restant`}
                                )
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {facture.client.entreprise}
                          </div>
                          <div className="text-sm text-gray-500">
                            {facture.client.prenom} {facture.client.nom}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(facture.dateEmission)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            {facture.totalAPayer.toLocaleString()} F
                          </div>
                          <div className="text-xs text-gray-500">
                            Reste: {facture.resteAPayer.toLocaleString()} F
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statutInfo.bg} ${statutInfo.text}`}
                          >
                            {statutInfo.icon}
                            {statutInfo.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedFacture(facture);
                                setShowDetails(true);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrint(facture)}
                              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                              title="Imprimer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(facture)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Télécharger PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {facture.statut !== "payee" && (
                              <button
                                onClick={() => handleMarkAsPaid(facture.id)}
                                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                                title="Marquer comme payée"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à{" "}
              {Math.min(endIndex, facturesFiltrees.length)} sur{" "}
              {facturesFiltrees.length} factures
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
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
      </div>

      {/* Modal Détails Facture */}
      {showDetails && selectedFacture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-purple-600">
                    {selectedFacture.numero}
                  </h2>
                  <p className="text-gray-600">Facture client</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePrint(selectedFacture)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimer
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* En-tête facture */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Émetteur
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-bold text-lg">Votre Société</p>
                      <p className="text-gray-600">123 Avenue des Affaires</p>
                      <p className="text-gray-600">75000 Paris, France</p>
                      <p className="text-gray-600">Tél: +229 00 00 00 00</p>
                      <p className="text-gray-600">contact@votresociete.com</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-bold">
                      {selectedFacture.client.entreprise}
                    </p>
                    <p className="text-gray-600">
                      {selectedFacture.client.prenom}{" "}
                      {selectedFacture.client.nom}
                    </p>
                    <p className="text-gray-600">
                      {selectedFacture.client.adresse}
                    </p>
                    <p className="text-gray-600">
                      Tél: {selectedFacture.client.telephone}
                    </p>
                    <p className="text-gray-600">
                      Email: {selectedFacture.client.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Informations facture
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'émission:</span>
                      <span>{formatDate(selectedFacture.dateEmission)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date d'échéance:</span>
                      <span>{formatDate(selectedFacture.dateEcheance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendeur:</span>
                      <span>{selectedFacture.vendeur}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          getStatutColor(selectedFacture.statut).bg
                        } ${getStatutColor(selectedFacture.statut).text}`}
                      >
                        {getStatutColor(selectedFacture.statut).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Articles */}
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Article
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                        Qté
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Prix unitaire HT
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        TVA
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                        Total HT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFacture.articles.map((article, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">
                          <p className="font-medium">{article.nom}</p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {article.quantite}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {article.prixUnitaire.toLocaleString()} F
                        </td>
                        <td className="px-4 py-3 text-right">{article.tva}%</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {article.total.toLocaleString()} F
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totaux et paiement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Conditions
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      {selectedFacture.conditionsPaiement}
                    </p>
                    {selectedFacture.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">Notes:</p>
                        <p className="text-gray-700">{selectedFacture.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Récapitulatif
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total HT:</span>
                      <span>
                        {selectedFacture.montantHT.toLocaleString()} F
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        TVA ({selectedFacture.tva}%):
                      </span>
                      <span>
                        {selectedFacture.montantTVA.toLocaleString()} F
                      </span>
                    </div>
                    {selectedFacture.fraisTransport > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Frais de transport:
                        </span>
                        <span>
                          + {selectedFacture.fraisTransport.toLocaleString()} F
                        </span>
                      </div>
                    )}
                    {selectedFacture.remise > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Remise:</span>
                        <span>
                          - {selectedFacture.remise.toLocaleString()} F
                        </span>
                      </div>
                    )}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total TTC:</span>
                        <span className="text-purple-600">
                          {selectedFacture.totalAPayer.toLocaleString()} F
                        </span>
                      </div>
                    </div>

                    {/* Informations paiement */}
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Paiement:</p>
                      {selectedFacture.modePaiement ? (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Mode:</span>
                            <span>
                              {getPaiementLabel(selectedFacture.modePaiement)}
                            </span>
                          </div>
                          {selectedFacture.referencePaiement && (
                            <div className="flex justify-between">
                              <span>Référence:</span>
                              <span>{selectedFacture.referencePaiement}</span>
                            </div>
                          )}
                          {selectedFacture.datePaiement && (
                            <div className="flex justify-between">
                              <span>Date paiement:</span>
                              <span>
                                {formatDate(selectedFacture.datePaiement)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium">
                            <span>Montant payé:</span>
                            <span>
                              {selectedFacture.montantPaye.toLocaleString()} F
                            </span>
                          </div>
                          {selectedFacture.resteAPayer > 0 && (
                            <div className="flex justify-between font-bold text-red-600">
                              <span>Reste à payer:</span>
                              <span>
                                {selectedFacture.resteAPayer.toLocaleString()} F
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-600">Non payé</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => handlePrint(selectedFacture)}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Imprimer la facture
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedFacture)}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Télécharger PDF
              </button>
              <button
                onClick={() => handleSendEmail(selectedFacture)}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Envoyer par email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Envoyer par Email */}
      {showSendModal && selectedFacture && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900">
                  Envoyer la facture par email
                </h3>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinataire
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedFacture.client.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    defaultValue={`Facture ${selectedFacture.numero}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    defaultValue={`Bonjour ${selectedFacture.client.prenom} ${selectedFacture.client.nom},\n\nVeuillez trouver ci-joint la facture ${selectedFacture.numero}.\n\nCordialement,\nVotre Société`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    // Simulation d'envoi d'email
                    console.log(
                      "Envoi de la facture par email à:",
                      selectedFacture.client.email
                    );
                    setShowSendModal(false);
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium"
                >
                  Envoyer
                </button>
                <button
                  onClick={() => setShowSendModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteConfirm && factureToDelete && (
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
                  Êtes-vous sûr de vouloir supprimer cette facture ?
                </p>
                <p className="text-red-700 mt-1">{factureToDelete.numero}</p>
                <p className="text-sm text-red-600 mt-2">
                  Client: {factureToDelete.client.entreprise}
                </p>
                <p className="text-sm text-red-600">
                  Montant: {factureToDelete.totalAPayer.toLocaleString()} F
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
                    setFactureToDelete(null);
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

      {/* Footer */}
      <footer className="mt-8 py-6 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 Gestion des Factures - {stats.total} factures</p>
            <p className="mt-1">
              Montant total: {stats.montantTotal.toLocaleString()} F • Montant
              impayé: {stats.montantImpaye.toLocaleString()} F
            </p>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
};

export default Invoices;
