// components/SelectCentre.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCentres, setCurrentCentre } from '../store/centresSlice'; // Assure-toi que ces actions existent
import Axios from '../utils/Axios';

const SelectCentre = () => {
  const dispatch = useDispatch();

  // Récupération depuis Redux
  const { centres, currentCentre } = useSelector((state) => state.centres);
  const userRole = useSelector((state) => state.user.role);
  const userCentre = useSelector((state) => state.user.centre); // Pour pré-sélection si vendeur

  // Chargement des centres au montage du composant
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await Axios.get('/api/centres');
        if (res.data.success) {
          const fetchedCentres = res.data.data || [];
          dispatch(setCentres(fetchedCentres));

          // Si aucun centre courant n'est défini, on prend le premier
          if (!currentCentre && fetchedCentres.length > 0) {
            dispatch(setCurrentCentre(fetchedCentres[0]));
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des centres :", error);
        // Optionnel : afficher une notification d'erreur
      }
    };

    // On charge toujours pour l'admin (pour avoir la liste complète)
    // Pour un vendeur, on pourrait ne pas charger, mais ici on charge quand même pour cohérence
    if (userRole === 'admin' || centres.length === 0) {
      fetchCentres();
    }
  }, [dispatch, userRole, currentCentre, centres.length]);

  // Si l'utilisateur n'est pas admin → on n'affiche rien
  if (userRole !== 'admin') {
    return null;
  }

  // Si pas encore de centres chargés
  if (centres.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        Chargement des centres...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Centre actif :
      </label>
      <select
        value={currentCentre?._id || ''}
        onChange={(e) => {
          const selected = centres.find((c) => c._id === e.target.value);
          if (selected) {
            dispatch(setCurrentCentre(selected));
          }
        }}
        className="px-4 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {centres.map((centre) => (
          <option key={centre._id} value={centre._id}>
            {centre.nom} 
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectCentre;