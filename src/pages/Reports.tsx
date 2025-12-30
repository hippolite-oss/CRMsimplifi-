import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign,
    ShoppingCart, Package, Users, Calendar, Filter, Download,
    Printer, Eye, RefreshCw, ChevronDown, ChevronUp, FileText,
    Database, Layers, Target, Activity, AlertTriangle, CheckCircle,
    Clock, ArrowUpRight, ArrowDownRight, Maximize2, Minimize2,
    Percent, CreditCard, Building, Globe, Shield, Star,
    BarChart, LineChart, Grid, List, Settings, ExternalLink
} from 'lucide-react';



const Reports = () => {
    // États principaux
    const [period, setPeriod] = useState('mois');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('overview'); // overview, sales, stock, finance, clients
    const [comparePeriod, setComparePeriod] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [exportFormat, setExportFormat] = useState('pdf');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [activeFilters, setActiveFilters] = useState({
        departments: [],
        categories: [],
        statuses: ['complete']
    });

    // Données globales
    const globalData = {
        overview: {
            totalRevenue: 78450000,
            totalExpenses: 56800000,
            netProfit: 21650000,
            profitMargin: 27.6,
            growthRate: 12.8,
            activeProducts: 156,
            totalClients: 124,
            employeeCount: 8,
            systemUptime: 99.8
        },
        periods: {
            today: { revenue: 2850000, sales: 18, newClients: 5 },
            week: { revenue: 18500000, sales: 89, newClients: 12 },
            month: { revenue: 78450000, sales: 325, newClients: 24 },
            year: { revenue: 892000000, sales: 3890, newClients: 156 }
        }
    };

    // Données détaillées par module
    const moduleData = {
        sales: {
            summary: {
                totalSales: 325,
                totalRevenue: 78450000,
                averageTicket: 241385,
                conversionRate: 68.5,
                refundRate: 2.3,
                topCategory: 'Électronique'
            },
            trends: {
                daily: [2850000, 2450000, 3100000, 2950000, 3200000, 2800000, 2750000],
                weekly: [18500000, 17200000, 19800000, 20100000, 19500000, 21000000, 20500000],
                monthly: [78450000, 75200000, 69800000, 81500000, 76500000, 82000000, 79200000]
            },
            channels: [
                { name: 'Magasin', value: 65, revenue: 50992500 },
                { name: 'En ligne', value: 25, revenue: 19612500 },
                { name: 'Téléphone', value: 8, revenue: 6276000 },
                { name: 'WhatsApp', value: 2, revenue: 1569000 }
            ],
            topProducts: [
                { name: 'Ordinateur Portable HP', sales: 28, revenue: 25197200, margin: 8399000 },
                { name: 'Smartphone Samsung', sales: 45, revenue: 31495500, margin: 11250000 },
                { name: 'Écouteurs Sony', sales: 67, revenue: 13393000, margin: 5353000 },
                { name: 'Tablette Apple', sales: 18, revenue: 15298200, margin: 5396400 },
                { name: 'Souris Logitech', sales: 89, revenue: 6221100, margin: 3107100 }
            ]
        },
        stock: {
            summary: {
                totalProducts: 156,
                totalValue: 96800000,
                lowStockItems: 8,
                outOfStockItems: 3,
                rotationRate: 3.2,
                averageMargin: 32.5
            },
            categories: [
                { name: 'Informatique', count: 45, value: 40500000, margin: 13500000 },
                { name: 'Téléphonie', count: 28, value: 19500000, margin: 7000000 },
                { name: 'Audio', count: 15, value: 3000000, margin: 1200000 },
                { name: 'Tablettes', count: 32, value: 27000000, margin: 9000000 },
                { name: 'Accessoires', count: 120, value: 6000000, margin: 2400000 }
            ],
            movements: {
                entries: 156,
                exits: 189,
                adjustments: 23,
                transfers: 12
            },
            alerts: [
                { product: 'Smartphone Samsung', stock: 3, min: 10, status: 'critical' },
                { product: 'Écouteurs Sony', stock: 0, min: 15, status: 'out' },
                { product: 'Enceinte JBL', stock: 7, min: 15, status: 'low' },
                { product: 'Montre Huawei', stock: 2, min: 5, status: 'low' }
            ]
        },
        finance: {
            summary: {
                cashBalance: 5240000,
                accountsReceivable: 1850000,
                accountsPayable: 920000,
                monthlyRevenue: 78450000,
                monthlyExpenses: 56800000,
                netProfit: 21650000
            },
            expenses: [
                { category: 'Achats', amount: 48500000, budget: 45000000, variance: '+7.8%' },
                { category: 'Salaires', amount: 15000000, budget: 14000000, variance: '+7.1%' },
                { category: 'Frais opérationnels', amount: 8500000, budget: 8000000, variance: '+6.3%' },
                { category: 'Marketing', amount: 5000000, budget: 4500000, variance: '+11.1%' },
                { category: 'Loyer', amount: 3000000, budget: 3000000, variance: '0%' }
            ],
            cashflow: {
                inflow: 78450000,
                outflow: 56800000,
                net: 21650000,
                dailyAverage: 722000
            },
            metrics: {
                roi: 28.5,
                roa: 22.3,
                currentRatio: 2.8,
                debtRatio: 0.35
            }
        },
        clients: {
            summary: {
                totalClients: 124,
                activeClients: 89,
                newThisMonth: 24,
                loyaltyRate: 78.5,
                averageSpent: 285000,
                churnRate: 8.2
            },
            segmentation: [
                { segment: 'Premium', count: 18, revenue: 35200000, avgSpent: 1955000 },
                { segment: 'Business', count: 12, revenue: 28500000, avgSpent: 2375000 },
                { segment: 'Regular', count: 45, revenue: 12500000, avgSpent: 277778 },
                { segment: 'New', count: 49, revenue: 2250000, avgSpent: 45918 }
            ],
            topClients: [
                { name: 'SARL TechImport', revenue: 12500000, orders: 18, lastPurchase: '2024-01-20' },
                { name: 'Jean Dupont', revenue: 8900000, orders: 12, lastPurchase: '2024-01-19' },
                { name: 'Marie Martin', revenue: 6700000, orders: 9, lastPurchase: '2024-01-18' },
                { name: 'Pierre Bernard', revenue: 5500000, orders: 7, lastPurchase: '2024-01-17' }
            ],
            satisfaction: {
                rating: 4.8,
                reviews: 45,
                complaints: 3,
                responseTime: '2.4h'
            }
        },
        operations: {
            summary: {
                totalOrders: 325,
                pendingOrders: 12,
                processingOrders: 8,
                completedOrders: 305,
                averageProcessingTime: '2.8h',
                fulfillmentRate: 93.8
            },
            performance: [
                { metric: 'Temps de réponse', value: '12min', target: '15min', status: 'good' },
                { metric: 'Taux de résolution', value: '94%', target: '90%', status: 'good' },
                { metric: 'Erreurs de traitement', value: '0.8%', target: '1%', status: 'good' },
                { metric: 'Satisfaction équipe', value: '4.6/5', target: '4.5/5', status: 'good' }
            ],
            inventory: {
                accuracy: 98.5,
                shrinkage: 0.8,
                turnover: 3.2,
                carryingCost: 1850000
            },
            quality: {
                defectRate: 1.2,
                returnRate: 2.3,
                warrantyClaims: 8,
                customerComplaints: 3
            }
        }
    };

    // Activités récentes
    const recentActivities = [
        { id: 1, module: 'Ventes', action: 'Vente #VENT-2024-00123', amount: 914900, user: 'Admin', time: '10:30' },
        { id: 2, module: 'Stock', action: 'Réapprovisionnement smartphones', amount: 3000000, user: 'Admin', time: '11:15' },
        { id: 3, module: 'Finance', action: 'Paiement facture fournisseur', amount: 1500000, user: 'Admin', time: '12:45' },
        { id: 4, module: 'Clients', action: 'Nouveau client enregistré', amount: 0, user: 'Vendeur1', time: '14:20' },
        { id: 5, module: 'Ventes', action: 'Vente #VENT-2024-00124', amount: 439800, user: 'Vendeur2', time: '15:30' },
        { id: 6, module: 'Stock', action: 'Ajustement inventaire', amount: -50000, user: 'Admin', time: '16:45' }
    ];

    // Calcul des indicateurs globaux
    const globalIndicators = useMemo(() => {
        const currentPeriod = globalData.periods[period === 'jour' ? 'today' : 
                           period === 'semaine' ? 'week' : 
                           period === 'mois' ? 'month' : 'year'];
        
        return [
            {
                id: 1,
                title: 'Chiffre d\'Affaires',
                value: `${(currentPeriod.revenue / 1000000).toFixed(1)}M F`,
                change: '+12.8%',
                isPositive: true,
                icon: <DollarSign className="w-5 h-5" />,
                color: 'from-green-500 to-emerald-600',
                details: moduleData.sales.summary
            },
            {
                id: 2,
                title: 'Bénéfice Net',
                value: `${(globalData.overview.netProfit / 1000000).toFixed(1)}M F`,
                change: '+8.5%',
                isPositive: true,
                icon: <TrendingUp className="w-5 h-5" />,
                color: 'from-blue-500 to-cyan-600',
                details: moduleData.finance.summary
            },
            {
                id: 3,
                title: 'Produits Actifs',
                value: globalData.overview.activeProducts,
                change: '+12',
                isPositive: true,
                icon: <Package className="w-5 h-5" />,
                color: 'from-purple-500 to-violet-600',
                details: moduleData.stock.summary
            },
            {
                id: 4,
                title: 'Clients Actifs',
                value: globalData.overview.activeClients,
                change: '+5%',
                isPositive: true,
                icon: <Users className="w-5 h-5" />,
                color: 'from-orange-500 to-amber-600',
                details: moduleData.clients.summary
            },
            {
                id: 5,
                title: 'Marge Bénéficiaire',
                value: `${globalData.overview.profitMargin}%`,
                change: '+2.1%',
                isPositive: true,
                icon: <Percent className="w-5 h-5" />,
                color: 'from-pink-500 to-rose-600',
                details: moduleData.finance.metrics
            },
            {
                id: 6,
                title: 'Taux de Croissance',
                value: `${globalData.overview.growthRate}%`,
                change: '+1.4%',
                isPositive: true,
                icon: <Activity className="w-5 h-5" />,
                color: 'from-indigo-500 to-blue-600',
                details: globalData.overview
            }
        ];
    }, [period]);

    // Calcul des tendances
    const trends = useMemo(() => {
        const salesTrend = moduleData.sales.trends[period === 'jour' ? 'daily' : 
                          period === 'semaine' ? 'weekly' : 'monthly'];
        const previousPeriod = [...salesTrend].slice(0, -1);
        const currentPeriod = salesTrend.slice(1);
        
        const growth = ((currentPeriod.reduce((a, b) => a + b, 0) - 
                        previousPeriod.reduce((a, b) => a + b, 0)) / 
                        previousPeriod.reduce((a, b) => a + b, 0) * 100).toFixed(1);
        
        return {
            salesGrowth: parseFloat(growth),
            bestDay: salesTrend.indexOf(Math.max(...salesTrend)),
            worstDay: salesTrend.indexOf(Math.min(...salesTrend)),
            average: (salesTrend.reduce((a, b) => a + b, 0) / salesTrend.length).toLocaleString(),
            trend: parseFloat(growth) >= 0 ? 'positive' : 'negative'
        };
    }, [period]);

    // Obtenir les données du module actuel
    const currentModuleData = useMemo(() => {
        return moduleData[viewMode] || moduleData.sales;
    }, [viewMode]);

    // Obtenir le libellé du module
    const getModuleLabel = (module) => {
        const labels = {
            overview: 'Vue d\'Ensemble',
            sales: 'Ventes',
            stock: 'Stock',
            finance: 'Finances',
            clients: 'Clients',
            operations: 'Opérations'
        };
        return labels[module] || module;
    };

    // Obtenir la couleur du module
    const getModuleColor = (module) => {
        const colors = {
            overview: 'bg-gradient-to-r from-blue-500 to-purple-600',
            sales: 'bg-gradient-to-r from-green-500 to-emerald-600',
            stock: 'bg-gradient-to-r from-blue-500 to-cyan-600',
            finance: 'bg-gradient-to-r from-purple-500 to-violet-600',
            clients: 'bg-gradient-to-r from-orange-500 to-amber-600',
            operations: 'bg-gradient-to-r from-pink-500 to-rose-600'
        };
        return colors[module] || 'bg-gradient-to-r from-gray-500 to-gray-600';
    };

    // Obtenir l'icône du module
    const getModuleIcon = (module) => {
        const icons = {
            overview: <BarChart3 className="w-5 h-5" />,
            sales: <ShoppingCart className="w-5 h-5" />,
            stock: <Package className="w-5 h-5" />,
            finance: <CreditCard className="w-5 h-5" />,
            clients: <Users className="w-5 h-5" />,
            operations: <Activity className="w-5 h-5" />
        };
        return icons[module] || <BarChart3 className="w-5 h-5" />;
    };

    // Générer le rapport PDF
    const generatePDF = () => {
        setLoading(true);
        
        const doc = new jsPDF();
        const title = `Bilan des Activités - ${getModuleLabel(viewMode)}`;
        const date = new Date().toLocaleDateString('fr-FR');
        
        // En-tête
        doc.setFontSize(20);
        doc.text(title, 14, 22);
        doc.setFontSize(10);
        doc.text(`Période: ${period} | Généré le: ${date}`, 14, 30);
        
        // Indicateurs globaux
        doc.setFontSize(16);
        doc.text('Indicateurs Clés', 14, 45);
        
        let y = 55;
        globalIndicators.forEach((indicator, idx) => {
            doc.setFontSize(11);
            doc.text(`${indicator.title}: ${indicator.value} (${indicator.change})`, 14, y);
            y += 7;
            if ((idx + 1) % 3 === 0) y += 3;
        });
        
        // Résumé du module
        doc.setFontSize(16);
        doc.text(`Résumé ${getModuleLabel(viewMode)}`, 14, y + 10);
        y += 20;
        
        const summaryData = Object.entries(currentModuleData.summary || {});
        summaryData.forEach(([key, value], idx) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            doc.setFontSize(10);
            doc.text(`${label}: ${value}`, 14, y);
            y += 6;
            if ((idx + 1) % 5 === 0) y += 3;
        });
        
        // Activités récentes
        doc.setFontSize(16);
        doc.text('Activités Récentes', 14, y + 10);
        y += 20;
        
        const activitiesTable = recentActivities.map(activity => [
            activity.time,
            activity.module,
            activity.action,
            activity.amount > 0 ? `${activity.amount.toLocaleString()} F` : '-',
            activity.user
        ]);
        
        doc.autoTable({
            startY: y,
            head: [['Heure', 'Module', 'Action', 'Montant', 'Utilisateur']],
            body: activitiesTable,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // Pied de page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Page ${i} sur ${pageCount}`, 195, 285, { align: 'right' });
            doc.text('© Gestion Stock Pro - Bilan des Activités', 14, 285);
        }
        
        doc.save(`bilan_activites_${viewMode}_${date.replace(/\//g, '-')}.pdf`);
        setLoading(false);
    };

    // Générer le rapport Excel
    const generateExcel = () => {
        setLoading(true);
        
        const wsData = [
            [`Bilan des Activités - ${getModuleLabel(viewMode)}`],
            [`Période: ${period} | Généré le: ${new Date().toLocaleDateString('fr-FR')}`],
            [],
            ['Indicateurs Globaux'],
            ...globalIndicators.map(ind => [ind.title, ind.value, ind.change]),
            [],
            [`Résumé ${getModuleLabel(viewMode)}`],
            ...Object.entries(currentModuleData.summary || {}).map(([key, value]) => [
                key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                value
            ]),
            [],
            ['Activités Récentes'],
            ['Heure', 'Module', 'Action', 'Montant', 'Utilisateur'],
            ...recentActivities.map(activity => [
                activity.time,
                activity.module,
                activity.action,
                activity.amount,
                activity.user
            ])
        ];
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Styliser les colonnes
        const wscols = [
            { wch: 20 },
            { wch: 25 },
            { wch: 40 },
            { wch: 20 },
            { wch: 15 }
        ];
        ws['!cols'] = wscols;
        
        XLSX.utils.book_append_sheet(wb, ws, 'Bilan');
        XLSX.writeFile(wb, `bilan_activites_${viewMode}_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        setLoading(false);
    };

    // Exporter les données
    const exportData = () => {
        if (exportFormat === 'pdf') {
            generatePDF();
        } else if (exportFormat === 'excel') {
            generateExcel();
        } else {
            // Export JSON
            const data = {
                period: period,
                viewMode: viewMode,
                date: new Date().toISOString(),
                globalIndicators: globalIndicators,
                moduleData: currentModuleData,
                recentActivities: recentActivities,
                trends: trends
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `bilan_${viewMode}_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
        }
    };

    // Rafraîchir les données
    const refreshData = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    };

    // Formater la monnaie
    const formatCurrency = (amount) => {
        if (amount >= 1000000) {
            return `${(amount / 1000000).toFixed(1)}M F`;
        } else if (amount >= 1000) {
            return `${(amount / 1000).toFixed(0)}K F`;
        }
        return `${amount} F`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* En-tête */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                                <BarChart className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Bilan des Activités</h1>
                                <p className="text-sm text-gray-600">Analyse complète de toutes les activités de l'entreprise</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={refreshData}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualiser
                            </button>
                            <div className="flex items-center gap-2">
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="json">JSON</option>
                                </select>
                                <button
                                    onClick={exportData}
                                    disabled={loading}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Exporter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Filtres et navigation */}
                <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {/* Sélecteur de période */}
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <select
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                >
                                    <option value="jour">Aujourd'hui</option>
                                    <option value="semaine">Cette semaine</option>
                                    <option value="mois">Ce mois</option>
                                    <option value="annee">Cette année</option>
                                    <option value="personnalise">Période personnalisée</option>
                                </select>
                            </div>
                            
                            {/* Période personnalisée */}
                            {period === 'personnalise' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="date"
                                        value={customStart}
                                        onChange={(e) => setCustomStart(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                    <span>au</span>
                                    <input
                                        type="date"
                                        value={customEnd}
                                        onChange={(e) => setCustomEnd(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}
                            
                            {/* Comparaison */}
                            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={comparePeriod}
                                    onChange={(e) => setComparePeriod(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm">Comparer avec période précédente</span>
                            </label>
                        </div>
                        
                        {/* Navigation par module */}
                        <div className="flex flex-wrap gap-2">
                            {['overview', 'sales', 'stock', 'finance', 'clients', 'operations'].map((module) => (
                                <button
                                    key={module}
                                    onClick={() => setViewMode(module)}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                                        viewMode === module
                                            ? `${getModuleColor(module)} text-white`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {getModuleIcon(module)}
                                    {getModuleLabel(module)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Indicateurs globaux */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                    {globalIndicators.map((indicator) => (
                        <div 
                            key={indicator.id} 
                            className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                                setSelectedMetric(indicator);
                                setShowDetails(true);
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">{indicator.title}</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{indicator.value}</p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {indicator.isPositive ? (
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                        )}
                                        <span className={`text-sm ${indicator.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                            {indicator.change}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">vs période précédente</span>
                                    </div>
                                </div>
                                <div className={`p-2 rounded-lg ${indicator.color} bg-opacity-10`}>
                                    <div className={`${indicator.color.split(' ')[0].replace('from-', 'text-')}`}>
                                        {indicator.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vue principale */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Graphique et tendances */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                            <div className="p-5 border-b flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-gray-900">
                                        {viewMode === 'overview' ? 'Performance Globale' : 
                                         `Performance ${getModuleLabel(viewMode)}`}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Tendances et évolutions sur la période sélectionnée
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                    <select className="px-3 py-1 border border-gray-300 rounded-lg focus:border-blue-500 outline-none text-sm">
                                        <option value="bar">Barres</option>
                                        <option value="line">Lignes</option>
                                        <option value="area">Aires</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="h-64 flex items-end justify-between">
                                    {viewMode === 'sales' && moduleData.sales.trends && (
                                        moduleData.sales.trends[period === 'jour' ? 'daily' : 
                                          period === 'semaine' ? 'weekly' : 'monthly'].map((value, index) => (
                                            <div key={index} className="flex flex-col items-center">
                                                <div className="text-xs text-gray-500 mb-2">
                                                    {period === 'jour' ? `${8 + index * 2}h` : 
                                                     period === 'semaine' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index] :
                                                     `Sem ${index + 1}`}
                                                </div>
                                                <div className="relative">
                                                    <div 
                                                        className="w-8 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t"
                                                        style={{ 
                                                            height: `${(value / Math.max(...moduleData.sales.trends[period === 'jour' ? 'daily' : 
                                                                  period === 'semaine' ? 'weekly' : 'monthly'])) * 150}px` 
                                                        }}
                                                    ></div>
                                                    {comparePeriod && (
                                                        <div 
                                                            className="w-8 bg-gradient-to-t from-green-300 to-emerald-400 rounded-t absolute -right-4"
                                                            style={{ 
                                                                height: `${(value * 0.85 / Math.max(...moduleData.sales.trends[period === 'jour' ? 'daily' : 
                                                                      period === 'semaine' ? 'weekly' : 'monthly'])) * 150}px` 
                                                            }}
                                                        ></div>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-600 mt-2">
                                                    {(value / 1000000).toFixed(1)}M
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    
                                    {viewMode === 'stock' && moduleData.stock.categories && (
                                        <div className="w-full">
                                            <div className="grid grid-cols-5 gap-4">
                                                {moduleData.stock.categories.map((cat, idx) => (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        <div className="text-xs text-gray-500 mb-2">{cat.name}</div>
                                                        <div className="relative w-full">
                                                            <div 
                                                                className="bg-gradient-to-t from-blue-500 to-cyan-600 rounded-t"
                                                                style={{ 
                                                                    height: `${(cat.value / Math.max(...moduleData.stock.categories.map(c => c.value))) * 120}px` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-2">
                                                            {(cat.value / 1000000).toFixed(1)}M
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {viewMode === 'finance' && moduleData.finance.expenses && (
                                        <div className="w-full">
                                            <div className="grid grid-cols-5 gap-4">
                                                {moduleData.finance.expenses.map((exp, idx) => (
                                                    <div key={idx} className="flex flex-col items-center">
                                                        <div className="text-xs text-gray-500 mb-2">{exp.category}</div>
                                                        <div className="relative w-full">
                                                            <div 
                                                                className="bg-gradient-to-t from-purple-500 to-violet-600 rounded-t"
                                                                style={{ 
                                                                    height: `${(exp.amount / Math.max(...moduleData.finance.expenses.map(e => e.amount))) * 120}px` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-2">
                                                            {(exp.amount / 1000000).toFixed(1)}M
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="text-sm text-gray-600">Tendance</div>
                                                <div className={`text-lg font-medium ${trends.trend === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                                                    {trends.trend === 'positive' ? '↑ Positive' : '↓ Négative'}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Croissance</div>
                                                <div className="text-lg font-medium">{trends.salesGrowth}%</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-600">Moyenne</div>
                                                <div className="text-lg font-medium">{trends.average} F</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Données mises à jour en temps réel
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Résumé et statistiques */}
                    <div className="space-y-6">
                        {/* Résumé du module */}
                        <div className="bg-white rounded-xl shadow-sm border p-5">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                {getModuleIcon(viewMode)}
                                Résumé {getModuleLabel(viewMode)}
                            </h3>
                            <div className="space-y-3">
                                {currentModuleData.summary && Object.entries(currentModuleData.summary).map(([key, value], idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </span>
                                        <span className="font-medium">
                                            {typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}
                                            {key.includes('Rate') || key.includes('margin') ? '%' : ''}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Alertes et notifications */}
                        <div className="bg-white rounded-xl shadow-sm border p-5">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                Alertes en cours
                            </h3>
                            <div className="space-y-3">
                                {moduleData.stock.alerts.map((alert, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div>
                                            <div className="font-medium text-sm">{alert.product}</div>
                                            <div className="text-xs text-yellow-700">
                                                Stock: {alert.stock} | Minimum: {alert.min}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            alert.status === 'critical' ? 'bg-red-100 text-red-800' :
                                            alert.status === 'out' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {alert.status === 'critical' ? 'Critique' :
                                             alert.status === 'out' ? 'Rupture' : 'Seuil bas'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Données détaillées */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top données */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-5 border-b">
                            <h2 className="font-semibold text-gray-900">
                                {viewMode === 'sales' ? 'Top Produits' :
                                 viewMode === 'clients' ? 'Top Clients' :
                                 viewMode === 'finance' ? 'Dépenses par Catégorie' :
                                 'Données Clés'}
                            </h2>
                        </div>
                        <div className="divide-y">
                            {viewMode === 'sales' && moduleData.sales.topProducts.map((product, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {product.sales} ventes • {formatCurrency(product.revenue)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">
                                                {formatCurrency(product.margin)}
                                            </div>
                                            <div className="text-xs text-gray-500">Marge</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {viewMode === 'clients' && moduleData.clients.topClients.map((client, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{client.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {client.orders} commandes • Dernier achat: {client.lastPurchase}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-blue-600">
                                                {formatCurrency(client.revenue)}
                                            </div>
                                            <div className="text-xs text-gray-500">CA Total</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {viewMode === 'finance' && moduleData.finance.expenses.map((expense, idx) => (
                                <div key={idx} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{expense.category}</div>
                                            <div className="text-sm text-gray-600">
                                                Budget: {formatCurrency(expense.budget)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-purple-600">
                                                {formatCurrency(expense.amount)}
                                            </div>
                                            <div className={`text-xs ${expense.variance.includes('+') ? 'text-red-600' : 'text-green-600'}`}>
                                                {expense.variance}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activités récentes */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="font-semibold text-gray-900">Activités Récentes</h2>
                            <button className="text-sm text-blue-600 hover:text-blue-800">
                                Voir tout
                            </button>
                        </div>
                        <div className="divide-y">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            activity.module === 'Ventes' ? 'bg-green-100 text-green-800' :
                                            activity.module === 'Stock' ? 'bg-blue-100 text-blue-800' :
                                            activity.module === 'Finance' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {activity.module === 'Ventes' && <ShoppingCart className="w-4 h-4" />}
                                            {activity.module === 'Stock' && <Package className="w-4 h-4" />}
                                            {activity.module === 'Finance' && <CreditCard className="w-4 h-4" />}
                                            {activity.module === 'Clients' && <Users className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium text-gray-900">{activity.action}</div>
                                                <div className={`text-sm font-medium ${
                                                    activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {activity.amount > 0 ? `+${formatCurrency(activity.amount)}` : 
                                                     activity.amount < 0 ? `${formatCurrency(activity.amount)}` : '-'}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {activity.time}
                                                </span>
                                                <span>{activity.module}</span>
                                                <span>{activity.user}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Insights et recommandations */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Insights et Recommandations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <h4 className="font-medium text-gray-900">Forces</h4>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Croissance des ventes de {trends.salesGrowth}% cette période</li>
                                <li>• Marge bénéficiaire stable à {globalData.overview.profitMargin}%</li>
                                <li>• Taux de fidélité client élevé: {moduleData.clients.summary.loyaltyRate}%</li>
                                <li>• Rotation des stocks optimale: {moduleData.stock.summary.rotationRate}</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                                <h4 className="font-medium text-gray-900">Points d'Attention</h4>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• {moduleData.stock.alerts.length} produits nécessitent réapprovisionnement</li>
                                <li>• Certaines dépenses dépassent le budget alloué</li>
                                <li>• Taux de rotation des nouveaux clients à améliorer</li>
                                <li>• Stocks dormants représentent 15% de la valeur totale</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <Target className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-gray-900">Recommandations</h4>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Réapprovisionner les produits en seuil bas cette semaine</li>
                                <li>• Optimiser les coûts opérationnels de 5% ce trimestre</li>
                                <li>• Lancer une campagne de fidélisation pour les clients réguliers</li>
                                <li>• Réduire les stocks dormants de 20% d'ici fin du mois</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Métriques de performance */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">📊 Métriques de Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {globalData.overview.growthRate}%
                            </div>
                            <div className="text-sm text-gray-600">Croissance</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {moduleData.operations.summary.fulfillmentRate}%
                            </div>
                            <div className="text-sm text-gray-600">Taux d'exécution</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {moduleData.clients.satisfaction.rating}/5
                            </div>
                            <div className="text-sm text-gray-600">Satisfaction client</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {moduleData.operations.inventory.accuracy}%
                            </div>
                            <div className="text-sm text-gray-600">Précision inventaire</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-8 py-6 border-t bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-gray-600">
                        <p>© 2024 Bilan des Activités - Système de Gestion Intégré</p>
                        <p className="mt-1">
                            Vue: {getModuleLabel(viewMode)} | 
                            <span className="text-blue-600 ml-2">
                                Période: {period} | Données mises à jour: {new Date().toLocaleTimeString('fr-FR')}
                            </span>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Modal Détails Métrique */}
            {showDetails && selectedMetric && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selectedMetric.color} bg-opacity-10`}>
                                        <div className={`${selectedMetric.color.split(' ')[0].replace('from-', 'text-')}`}>
                                            {selectedMetric.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{selectedMetric.title}</h2>
                                        <p className="text-gray-600">Analyse détaillée de l'indicateur</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowDetails(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold text-gray-900">{selectedMetric.value}</div>
                                            <div className="text-sm text-gray-600">Valeur actuelle</div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-lg font-medium ${selectedMetric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedMetric.change}
                                            </div>
                                            <div className="text-sm text-gray-600">Évolution</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Détails de l'indicateur</h3>
                                    <div className="space-y-2">
                                        {selectedMetric.details && Object.entries(selectedMetric.details).map(([key, value], idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                <span className="text-sm text-gray-600">
                                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                                </span>
                                                <span className="font-medium">
                                                    {typeof value === 'number' && value > 1000 ? formatCurrency(value) : value}
                                                    {key.includes('Rate') || key.includes('margin') || key.includes('percentage') ? '%' : ''}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Analyse</h3>
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-900">
                                            Cet indicateur montre une performance {selectedMetric.isPositive ? 'positive' : 'négative'} 
                                            avec une évolution de {selectedMetric.change}. 
                                            {selectedMetric.isPositive ? 
                                                ' Cette tendance positive doit être maintenue et optimisée.' :
                                                ' Des actions correctives sont nécessaires pour inverser la tendance.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-6 border-t flex gap-3">
                            <button
                                onClick={() => setShowDetails(false)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;