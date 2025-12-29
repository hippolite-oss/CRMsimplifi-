// src/components/Footer.jsx
import { useState, useEffect } from 'react';


const Footer = () => {
  const [parametres, setParametres] = useState(null);

  const fetchParametres = async () => {
    try {
      const res = await Axios.get('/api/parametres');
      if (res.data.success) {
        setParametres(res.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
    }
  };

  useEffect(() => {
    fetchParametres();
  }, []);

  const columns = [
    { title: "Produits", items: ["Outillage électrique", "Outillage manuel", "Équipement de sécurité", "Consommables"] },
    { title: "Services", items: ["Livraison express", "Réparation", "Formation", "Location"] },
    { title: "Entreprise", items: ["À propos", "Carrières", "Presse", "Boutiques"] }
  ];

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="logo.jpg" 
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold">
                {parametres?.nom_societe || 'Quincaillerie'}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Fournisseur officiel des artisans depuis 1952. Qualité, fiabilité et expertise.
            </p>
          </div>
          
          {columns.map((column, index) => (
            <div key={index}>
              <h3 className="font-bold text-lg mb-6">{column.title}</h3>
              <ul className="space-y-2">
                {column.items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 Bradley Hypox. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;