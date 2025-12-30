import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';

// Import des pages
import Reports from './pages/Reports';
import CompanySettings from './pages/CompanySettings';
import SettingsUsers from './pages/SettingsUsers';
import CashRegister from './pages/CashRegister';
import Activitie from './pages/Activitie';
import StockHistory from './pages/StockHistory';
import StockMovements from './pages/StockMovements';
import NewProduct from './pages/NewProduct';
import ProductsList from './pages/ProductsList';
import Invoices from './pages/Invoices';
import Quotes from './pages/Quotes';
import NewSale from './pages/NewSale';
import SalesHistory from './pages/SalesHistory';
import NewClient from './pages/NewClient';
import ClientList from './pages/ClientList';
import Centre from './pages/Centre';
import Home from './pages/Home';
import Otp from './pages/Otp';
import Users from './pages/Users';
import Login from './pages/LoginPge';
import ForgotPassword from './pages/Forgotpassword';
import Commande from './pages/Commande';

// Import du Layout existant
import Layout from './pages/Layout';
import { LayoutDashboard } from 'lucide-react';
import AddStock from './pages/AddStock';
import StockOut from './pages/StockOut';

// Composant ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Remplace par ta logique
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* Routes publiques (sans Layout) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/commande" element={<Commande />} />
        <Route path="/password" element={<ForgotPassword />} />

        {/* Routes protégées avec Layout */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<LayoutDashboard />} />
          <Route path="/clients" element={<ClientList />} />
          <Route path="/clients/nouveau" element={<NewClient />} />
          <Route path="/ventes" element={<SalesHistory />} />
          <Route path="/ventes/nouvelle" element={<NewSale />} />
          <Route path="/devis" element={<Quotes />} />
          <Route path="/factures" element={<Invoices />} />
          <Route path="/produits" element={<ProductsList />} />
          <Route path="/produits/nouveau" element={<NewProduct />} />
          <Route path="/stock/mouvements" element={<StockMovements />} />
          <Route path="/stock/historique" element={<StockHistory />} />
          <Route path="/stock/sortir" element={<StockOut/>} />
          <Route path="/stock/ajouter" element={<AddStock/>} /> 
          <Route path="/activites" element={<Activitie />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/utilisateurs" element={<Users />} />
          <Route path="/caisse" element={<CashRegister />} />
          <Route path="/paramètres/utilisateurs" element={<SettingsUsers />} />
          <Route path="/paramètres/societe" element={<CompanySettings />} />
          <Route path="/paramètres/general" element={<CompanySettings />} />
          <Route path="/paramètres/centre" element={<Centre />} />
        </Route>

        {/* Redirection 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;